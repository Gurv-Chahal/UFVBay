import React, { useEffect, useState, useRef } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { getToken, getUserInfo } from "../services/AuthService.js";
import "../public/index.css";

const ChatRoom = () => {



    // organize private chats by user in a Map
    const [privateChats, setPrivateChats] = useState(new Map());
    // stores messages for public chats
    const [publicChats, setPublicChats] = useState([]);
    // track whether the user is viewing public or private chat
    const [tab, setTab] = useState("CHATROOM");
    // hold username, websocket connection status, and current message input
    const [userData, setUserData] = useState({
        username: "",
        connected: false,
        message: "",
    });

    const chatContentRef = useRef(null);
    const messagesEndRef = useRef(null);





    // stores list of all users
    const [users, setUsers] = useState([]);
    // tracks current page for public message pagination
    const [publicPage, setPublicPage] = useState(0);
    const [publicHasMore, setPublicHasMore] = useState(true);
    // tracks current pagination state for private messages
    const [privatePages, setPrivatePages] = useState({});
    const [privateHasMore, setPrivateHasMore] = useState({});
    // stores filtered list of users for search functionality
    const [filteredUsers, setFilteredUsers] = useState([]);


    const [userPage, setUserPage] = useState(0);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);



    // key to force rerenders
    const [componentKey, setComponentKey] = useState(0);


    // Use a ref to store stompClient to prevent multiple connections
    const stompClientRef = useRef(null);

    useEffect(() => {
        // automatically fetch user information and connect
        getUserDetails();

        // cleanup function to disconnect on unmount
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
        };
    }, []);




    // retrieve user info, intialize websocket, and fetch list of users
    // made async so it only runs when api request is called
    const getUserDetails = async () => {
        try {
            // fetch user details
            const user = await getUserInfo();
            if (user) {
                setUserData((prevState) => ({
                    ...prevState,
                    username: user.username,
                }));
                // establish web socket connect
                connect(user.username);
                // Get all users for sidebar
                fetchUsers();
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            alert("Failed to retrieve user details. Please try again.");
        }
    };


    const fetchUsers = async (isLoadMore = false) => {
        try {

            const response = await fetch(`http://localhost:8080/api/users?page=${userPage}&size=20`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                return;
            }

            const updatedUsers = isLoadMore ? [...users, ...data] : data;

            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers); // Ensure filteredUsers matches users
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to load users. Please try again.");
        }
    };



    useEffect(() => {
        // sync filteredUsers with users when users array updates
        setFilteredUsers(users);
    }, [users]);


    // established websocket connection using sockjs and authenticates JWT token through URL
    const connect = (username) => {
        // get JWT token
        const token = getToken();
        // Attach JWT token as a query parameter
        const Sock = new SockJS(`http://localhost:8080/ws?token=${token}`);
        const stomp = over(Sock);
        stompClientRef.current = stomp;

        // connect websocket
        stomp.connect(
            {},
            () => onConnected(username),
            onError
        );
    };


    // subscribes to public and private websocket and initalizes chat states
    const onConnected = (username) => {
        setUserData((prevState) => ({ ...prevState, connected: true }));
        console.log("Connected to WebSocket");

        // subscribe to public chatroom
        stompClientRef.current.subscribe("/chatroom/public", onMessageReceived);
        console.log("Subscribed to /chatroom/public");

        // subscribe to private messages
        stompClientRef.current.subscribe(`/user/${username}/private`, onPrivateMessage);
        console.log(`Subscribed to /user/${username}/private`);

        userJoin(username);

        // Fetch initial public messages
        fetchPublicMessages();

        // initialize pagination for private chats after users are fetched
        initializePrivateChats();
    };



    const userJoin = (username) => {
        const chatMessage = {
            senderName: username,
            status: "JOIN",
        };
        stompClientRef.current.send("/app/message", {}, JSON.stringify(chatMessage));
        console.log(`${username} joined the chatroom`);
    };



    // add received public messages to state
    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        console.log("Public message received:", payloadData);

        setPublicChats((prevChats) => [...prevChats, payloadData]);

        // Scroll to bottom after receiving a new public message
        setTimeout(() => {
            scrollToBottom();
        }, 100); // Slight delay to ensure DOM updates
    };


    // add private messages to users chat in state
    // made async so when function is called it and sends api request if fetches the conversation history
    const onPrivateMessage = async (payload) => {
        const payloadData = JSON.parse(payload.body);
        console.log("Private message received:", payloadData);

        const otherUser =
            payloadData.senderName === userData.username
                ? payloadData.receiverName
                : payloadData.senderName;

        setPrivateChats((prevChats) => {
            const updatedChats = new Map(prevChats);
            if (!updatedChats.has(otherUser)) {
                updatedChats.set(otherUser, []);
            }

            updatedChats.set(otherUser, [...updatedChats.get(otherUser), payloadData]);
            console.log("Updated privateChats:", updatedChats);
            return updatedChats;
        });

        await fetchConversationHistory(otherUser);

        // Scroll to the bottom of the conversation after receiving a new private message
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };



    const onError = (err) => {
        console.error("Error connecting to WebSocket:", err);
        alert("Failed to connect to the chat server. Please try again.");
    };


    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData((prevState) => ({ ...prevState, message: value }));
    };



    // Send a message (public or private) and update the chat
    // made async so that whenever a chat is sent when the api request is sent to the backend it
    // calls the function and updates the chatbox for both users
    const sendMessage = async () => {
        if (stompClientRef.current && userData.message.trim() !== "") {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab === "CHATROOM" ? "CHATROOM" : tab,
                message: userData.message.trim(),
                status: "MESSAGE",
                timestamp: new Date().toISOString(),
            };

            // send the message through WebSocket
            const endpoint = tab === "CHATROOM" ? "/app/message" : "/app/private-message";
            stompClientRef.current.send(endpoint, {}, JSON.stringify(chatMessage));


            setUserData((prevState) => ({ ...prevState, message: "" }));


            if (tab === "CHATROOM") {
                await fetchPublicMessages();
            } else {
                await fetchConversationHistory(tab);
            }

            // scroll to bottom after sending a message
            scrollToBottom();
        }
    };





    const handleTabChange = (selectedTab) => {
        setTab(selectedTab);

        if (selectedTab !== "CHATROOM" && !privateChats.has(selectedTab)) {
            setPrivateChats((prevChats) => {
                const newChats = new Map(prevChats);
                newChats.set(selectedTab, []);
                return newChats;
            });

            fetchConversationHistory(selectedTab);
        }
    };



    const fetchPublicMessages = async (page = 0) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/public-messages?page=${page}&size=20`,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length > 0) {
                setPublicChats((prevChats) => [...data.reverse(), ...prevChats]);
                setPublicPage(page);
                setPublicHasMore(true);
            } else {
                setPublicHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching public messages:", error);
        }
    };


    const fetchConversationHistory = async (otherUser) => {
        try {
            const response = await fetch(`http://localhost:8080/api/conversation/${otherUser}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // add messages
            setPrivateChats((prevChats) => {
                const newChats = new Map(prevChats);
                newChats.set(otherUser, data);
                return newChats;
            });

            // scroll to the bottom of the conversation after loading
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } catch (error) {
            console.error(`Error fetching conversation with ${otherUser}:`, error);
        }
    };




    useEffect(() => {
        if (tab === "CHATROOM") {
            scrollToBottom();
        }
    }, [publicChats, tab]);


    useEffect(() => {
        if (tab !== "CHATROOM") {
            scrollToBottom();
        }
    }, [privateChats, tab]);




    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            console.log("Scrolled to bottom");
        } else {
            console.log("messagesEndRef.current is null");
        }
    };



    // initialize private chats pagination
    const initializePrivateChats = () => {
        users.forEach(user => {
            setPrivatePages(prev => ({ ...prev, [user.username]: 0 }));
            setPrivateHasMore(prev => ({ ...prev, [user.username]: true }));
        });
    };



    // search function
    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredUsers(filtered);
    };



    // made changes to this so that it wouldnt create infinite loop of calling users
    const handleUserListScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // check if we are at the bottom of the scroll and if there are more users to fetch
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreUsers) {
            // stop fetching users
            fetchUsers(false);
        }
    };





    // handles scrolling functionality, made async so that it only works when
    // the scroll happens and its called
    const handleScroll = async (e) => {
        const { scrollTop } = e.target;

        if (scrollTop <= 0 && privateHasMore[tab] && !loadingMoreMessages) {
            setLoadingMoreMessages(true);
            await fetchConversationHistory(tab);
            setLoadingMoreMessages(false);
        }
    };





    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        {/* Search Box */}
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-box"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div
                            className="user-list"
                            onScroll={handleUserListScroll}
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                            <ul>
                                <li
                                    onClick={() => handleTabChange("CHATROOM")}
                                    className={`member ${tab === "CHATROOM" ? "active" : ""}`}
                                >
                                    Chatroom
                                </li>
                                {filteredUsers.map((user) => (
                                    <li
                                        key={user.username}
                                        onClick={() => handleTabChange(user.username)}
                                        className={`member ${tab === user.username ? "active" : ""}`}
                                    >
                                        {user.username}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div
                        key={componentKey}
                        className="chat-content"
                        onScroll={handleScroll}
                        ref={chatContentRef}
                    >
                        <ul className="chat-messages">
                            {tab === "CHATROOM" &&
                                publicChats.map((chat) => (
                                    <li
                                        key={chat.id}
                                        className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                                    >
                                        {chat.senderName !== userData.username && (
                                            <div className="avatar">{chat.senderName}</div>
                                        )}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && (
                                            <div className="avatar self">{chat.senderName}</div>
                                        )}
                                    </li>
                                ))}
                            {tab !== "CHATROOM" &&
                                (privateChats.get(tab) || []).map((chat) => (
                                    <li
                                        key={chat.id}
                                        className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                                    >
                                        {chat.senderName !== userData.username && (
                                            <div className="avatar">{chat.senderName}</div>
                                        )}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && (
                                            <div className="avatar self">{chat.senderName}</div>
                                        )}
                                    </li>
                                ))}
                            <div ref={messagesEndRef}/>
                        </ul>

                        {/* Loading indicator for fetching more messages */}
                        {loadingMoreMessages && (
                            <div className="loading-more-messages">
                                Loading more messages...
                            </div>
                        )}
                        <div className="send-message">
                            <input
                                type="text"
                                className="input-message"
                                placeholder="Enter the message"
                                value={userData.message}
                                onChange={handleMessage}
                                onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="send-button"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );

};

export default ChatRoom;