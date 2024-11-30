import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { getToken, getUserInfo } from "../services/AuthService.js";
import "../public/index.css";

let stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: "",
        receiverName: "",
        connected: false,
        message: "",
    });

    // store users
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // automatically fetch user information and connect
        getUserDetails();
    }, []);

    const getUserDetails = async () => {
        try {
            const user = await getUserInfo();
            if (user) {
                setUserData((prevState) => ({
                    ...prevState,
                    username: user.username,
                }));
                connect(user.username);
                // get all users for sidebar
                fetchUsers();
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const connect = (username) => {
        const token = getToken();
        // attach jwt token to query param
        const Sock = new SockJS(`http://localhost:8080/ws?token=${token}`);
        stompClient = over(Sock);

        // connect
        stompClient.connect({}, () => onConnected(username), onError);
    };

    const onConnected = (username) => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe("/chatroom/public", onMessageReceived);
        stompClient.subscribe(`/user/${username}/private`, onPrivateMessage);
        userJoin(username);
    };

    const userJoin = (username) => {
        const chatMessage = {
            senderName: username,
            status: "JOIN",
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            default:
                break;
        }
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            const list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err) => {
        console.error("Error connecting to WebSocket:", err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const sendPrivateValue = () => {
        if (stompClient) {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE",
            };
            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li
                                onClick={() => setTab("CHATROOM")}
                                className={`member ${tab === "CHATROOM" && "active"}`}
                            >
                                Chatroom
                            </li>
                            {users.map((user) => (
                                <li
                                    key={user.username}
                                    onClick={() => setTab(user.username)}
                                    className={`member ${tab === user.username && "active"}`}
                                >
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {publicChats.map((chat, index) => (
                                    <li
                                        key={index}
                                        className={`message ${
                                            chat.senderName === userData.username && "self"
                                        }`}
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
                        </div>
                    )}
                    {tab !== "CHATROOM" && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {[...(privateChats.get(tab) || [])].map((chat, index) => (
                                    <li
                                        key={index}
                                        className={`message ${
                                            chat.senderName === userData.username && "self"
                                        }`}
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
                                />
                                <button
                                    type="button"
                                    className="send-button"
                                    onClick={sendPrivateValue}
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
