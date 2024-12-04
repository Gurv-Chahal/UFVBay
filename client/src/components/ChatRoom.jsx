import React, { useEffect, useState, useRef } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { getToken, getUserInfo } from "../services/AuthService.js";
import "../public/index.css";

const ChatRoom = () => {

    // organize private chats by user in a Map
    const [privateChats, setPrivateChats] = useState(new Map());
    // track whether the user is viewing private chat
    const [tab, setTab] = useState(null); // Changed from "CHATROOM" to null
    // hold username, websocket connection status, and current message input
    const [userData, setUserData] = useState({
        username: "",
        connected: false,
        message: "",
    });

    const chatContentRef = useRef(null);
    const messagesEndRef = useRef(null);

    // stores list of all users with unread counts
    const [users, setUsers] = useState([]);
    // tracks current page for user list pagination
    const [userPage, setUserPage] = useState(0);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);

    // use a ref to store stompClient to prevent multiple connections
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

    // retrieve user info, initialize websocket, and fetch list of users
    const getUserDetails = async () => {
        try {
            // fetch user details
            const user = await getUserInfo();
            if (user) {
                setUserData((prevState) => ({
                    ...prevState,
                    username: user.username,
                }));
                // establish websocket connection
                connect(user.username);
                // get all users for sidebar
                await fetchUsers();
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            alert("Failed to retrieve user details. Please try again.");
        }
    };

    // fetch users with unread counts
    const fetchUsers = async (isLoadMore = false) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/unread?page=${userPage}&size=20`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const usersData = await response.json();

            if (usersData.length === 0) {
                setHasMoreUsers(false);
                return;
            }


            let updatedUsers = isLoadMore ? [...users, ...usersData] : [...usersData];


            // since backend sorts by lastMessageTime then maintain order
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error fetching users with unread counts:", error);
            alert("Failed to load users. Please try again.");
        }
    };


    // established websocket connection using sockjs and authenticates JWT token through URL
    const connect = (username) => {
        const token = getToken();
        const Sock = new SockJS(`http://localhost:8080/ws?token=${token}`);
        const stomp = over(Sock);
        stompClientRef.current = stomp;

        stomp.connect(
            {},
            () => onConnected(username),
            onError
        );
    };

    // Subscribes to private websocket and initializes chat states
    const onConnected = (username) => {
        setUserData((prevState) => ({ ...prevState, connected: true }));
        console.log("Connected to WebSocket");

        stompClientRef.current.subscribe(`/user/${username}/private`, onPrivateMessage);
        console.log(`Subscribed to /user/${username}/private`);

    };



    // Add private messages to users chat in state
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


        // Update the user list based on the sender
        if (payloadData.senderName !== userData.username) {
            setUsers((prevUsers) => {
                return prevUsers.map((user) => {
                    if (user.username === otherUser) {
                        return {
                            ...user,
                            unreadCount: user.unreadCount + 1,
                            lastMessageTime: payloadData.timestamp,
                        };
                    }
                    return user;
                }).sort((a, b) => {
                    if (a.lastMessageTime && b.lastMessageTime) {
                        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
                    } else if (a.lastMessageTime) {
                        return -1;
                    } else if (b.lastMessageTime) {
                        return 1;
                    }
                    return 0;
                });
            });
        }

        // scroll to the bottom of the conversation after receiving a new private messagef
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

    // Send a private message and update the chat
    const sendMessage = async () => {
        if (stompClientRef.current && userData.message.trim() !== "" && tab) {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message.trim(),
                status: "MESSAGE",
                timestamp: new Date().toISOString(),
            };

            // send the message through WebSocket
            const endpoint = "/app/private-message";
            stompClientRef.current.send(endpoint, {}, JSON.stringify(chatMessage));

            setUserData((prevState) => ({ ...prevState, message: "" }));

            // update private chats
            setPrivateChats((prevChats) => {
                const updatedChats = new Map(prevChats);
                if (!updatedChats.has(tab)) {
                    updatedChats.set(tab, []);
                }
                updatedChats.set(tab, [...updatedChats.get(tab), chatMessage]);
                return updatedChats;
            });

            // update the user list
            setUsers((prevUsers) => {
                return prevUsers.map((user) => {
                    if (user.username === tab) {
                        return {
                            ...user,
                            lastMessageTime: chatMessage.timestamp,
                        };
                    }
                    return user;
                }).sort((a, b) => {
                    if (a.lastMessageTime && b.lastMessageTime) {
                        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
                    } else if (a.lastMessageTime) {
                        return -1;
                    } else if (b.lastMessageTime) {
                        return 1;
                    }
                    return 0;
                });
            });

            // scroll to bottom after sending a message
            scrollToBottom();
        }
    };

    const handleTabChange = async (selectedTab) => {
        setTab(selectedTab);

        if (!privateChats.has(selectedTab)) {
            setPrivateChats((prevChats) => {
                const newChats = new Map(prevChats);
                newChats.set(selectedTab, []);
                return newChats;
            });

            // Fetch conversation history (which marks messages as read)
            await fetchConversationHistory(selectedTab, 1);
        }

        await fetchUsers(false);

        // reset unreadCount for the selected user
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.username === selectedTab ? { ...user, unreadCount: 0 } : user
            )
        );
    };

    // fetch conversation history with a user
    const fetchConversationHistory = async (otherUser, limit = 0) => {
        try {
            let url = `http://localhost:8080/api/conversation/${otherUser}`;
            if (limit > 0) {
                url += `?limit=${limit}`;
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                throw new Error(`Error fetching conversation with ${otherUser}: ${response.statusText}`);
            }

            const data = await response.json();

            setPrivateChats((prevChats) => {
                const newChats = new Map(prevChats);
                newChats.set(otherUser, data);
                return newChats;
            });

            // scroll to the bottom of the conversation after loading
            setTimeout(() => {
                scrollToBottom();
            }, 100);

            return data;
        } catch (error) {
            console.error(`Error fetching conversation with ${otherUser}:`, error);
            return [];
        }
    };



    // search function
    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        // Fflter users based on search query
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(lowerCaseQuery)
        );
        setUsers(filtered);
    };

    // handle user list scroll for infinite loading
    const handleUserListScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // check if we are at the bottom of the scroll and if there are more users to fetch
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreUsers) {
            // increment the page number
            setUserPage((prevPage) => prevPage + 1);
            // stop fetching more users
            fetchUsers(false);
        }
    };

    // Handle scrolling functionality for chat messages
    const handleScroll = async (e) => {
        const { scrollTop } = e.target;

        if (scrollTop <= 0 && !loadingMoreMessages) {
            setLoadingMoreMessages(true);
            setLoadingMoreMessages(false);
        }
    };

    // scroll to bottom of messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            console.log("Scrolled to bottom");
        } else {
            console.log("messagesEndRef.current is null");
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
                                {users.map((user) => (
                                    <li
                                        key={user.username}
                                        onClick={() => handleTabChange(user.username)}
                                        className={`member ${tab === user.username ? "active" : ""} ${
                                            user.unreadCount > 0 ? "unread" : ""
                                        }`}
                                    >
                                        {user.username}
                                        {user.unreadCount > 0 && <span className="badge">{user.unreadCount}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div
                        className="chat-content"
                        onScroll={handleScroll}
                        ref={chatContentRef}
                    >
                        <ul className="chat-messages">
                            {tab &&
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
                            <div ref={messagesEndRef} />
                        </ul>

                        {/* loading indicator for fetching more messages */}
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
