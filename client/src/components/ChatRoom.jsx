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




    // stores list of all users
    const [users, setUsers] = useState([]);
    // tracks current page for public message pagination
    const [publicPage, setPublicPage] = useState(0);
    const [publicHasMore, setPublicHasMore] = useState(true);
    // tracks current pagination state for private messages
    const [privatePages, setPrivatePages] = useState({});
    const [privateHasMore, setPrivateHasMore] = useState({});


    // key to force rerenders
    const [componentKey, setComponentKey] = useState(0);


    // Use a ref to store stompClient to prevent multiple connections
    const stompClientRef = useRef(null);

    useEffect(() => {
        // Automatically fetch user information and connect
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


    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setUsers(data);
            console.log("Fetched users:", data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to load users. Please try again.");
        }
    };

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
    };


    // add private messages to users chat in state
    // made async so when function is called it and sends api request if fetches the conversation history
    const onPrivateMessage = async (payload) => {
        // parse private messages
        const payloadData = JSON.parse(payload.body);
        console.log("Private message received:", payloadData);

        const otherUser =
            payloadData.senderName === userData.username
                ? payloadData.receiverName
                : payloadData.senderName;

        setPrivateChats((prevChats) => {
            const updatedChats = new Map(prevChats); // Create a new reference for updated and prev chats
            if (!updatedChats.has(otherUser)) {
                // Initialize chat if not present
                updatedChats.set(otherUser, []);
            }

            // append the message
            updatedChats.set(otherUser, [...updatedChats.get(otherUser), payloadData]);
            console.log("Updated privateChats:", updatedChats);
            return updatedChats;
        });

        // fetch updated messages to ensure data consistency
        await fetchConversationHistory(otherUser);
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

            // Send the message through WebSocket
            const endpoint = tab === "CHATROOM" ? "/app/message" : "/app/private-message";
            stompClientRef.current.send(endpoint, {}, JSON.stringify(chatMessage));

            // Clear the input field
            setUserData((prevState) => ({ ...prevState, message: "" }));

            // Fetch updated messages after sending
            if (tab === "CHATROOM") {
                await fetchPublicMessages(); // Fetch updated public messages
            } else {
                await fetchConversationHistory(tab); // Fetch updated conversation messages
            }
        }
    };



    // handle when tab is changed from chatroom to a user, or user to user then fetch conversation history
    const handleTabChange = (selectedTab) => {
        setTab(selectedTab);

        if (selectedTab !== "CHATROOM" && !privateChats.has(selectedTab)) {
            setPrivateChats((prevChats) => {
                const newChats = new Map(prevChats);
                newChats.set(selectedTab, []);
                return newChats;
            });

            // Fetch conversation history for the selected tab
            fetchConversationHistory(selectedTab);
        }
    };


    // Function to fetch public messages with pagination when called
    const fetchPublicMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/public-messages?page=${publicPage}&size=20`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            if (data.length === 0) {
                return;
            }

            setPublicChats(prevChats => [...prevChats, ...data]);
            setPublicPage(prevPage => prevPage + 1);

        } catch (error) {
            console.error("Error fetching public messages:", error);
            alert("Failed to load public messages. Please try again later.");
        }
    };

    // Function to fetch conversation history between two users with pagination when called and sends rest api request
    const fetchConversationHistory = async (otherUser) => {
        try {

            const response = await fetch(`http://localhost:8080/api/conversation/${otherUser}?page=0&size=20`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            setPrivateChats(prevChats => {
                const newChats = new Map(prevChats);
                newChats.set(otherUser, data);
                return newChats;
            });

        } catch (error) {
            console.error(`Error fetching conversation between ${userData.username} and ${otherUser}:`, error);
            alert(`Failed to load conversation with ${otherUser}. Please try again later.`);
        }
    };

    // Initialize private chats pagination (optional)
    const initializePrivateChats = () => {
        users.forEach(user => {
            setPrivatePages(prev => ({ ...prev, [user.username]: 0 }));
            setPrivateHasMore(prev => ({ ...prev, [user.username]: true }));
        });
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li
                                onClick={() => handleTabChange("CHATROOM")}
                                className={`member ${tab === "CHATROOM" ? "active" : ""}`}
                            >
                                Chatroom
                            </li>
                            {users.map((user) => (
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
                    {tab === "CHATROOM" && (
                        <div key={componentKey} className="chat-content">
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
                                    [...(privateChats.get(tab) || [])].map((chat) => (
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
                            </ul>
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
                    )}
                    {tab !== "CHATROOM" && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {[...(privateChats.get(tab) || [])].map((chat) => (
                                    <li
                                        key={chat.id} // Ensure unique ID
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
                            </ul>
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
                    )}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default ChatRoom;
