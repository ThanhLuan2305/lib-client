import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Avatar, Input, Button, message } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { sendPrivateMessage, getPrivateMessages } from "../services/Chat";
import "../styles/userChat.css";

const { Content } = Layout;

const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const secondsAgo = Math.floor((now - past) / 1000);
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo}d ago`;
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) return `${monthsAgo}mo ago`;
  return `${Math.floor(monthsAgo / 12)}y ago`;
};

const UserChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const currentUserId = userProfile.id || 0;
  const adminId = 1;

  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp === "string") {
      return timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`;
    }
    return timestamp.toString();
  };

  const sortMessagesByTime = (msgs) => {
    return [...msgs].sort((a, b) => {
      const timeA = new Date(normalizeTimestamp(a.timestamp)).getTime();
      const timeB = new Date(normalizeTimestamp(b.timestamp)).getTime();
      return timeA - timeB;
    });
  };

  const updateMessagesWithNew = (prevMessages, newMsg) => {
    if (prevMessages.some((msg) => msg.id === newMsg.id)) {
      return prevMessages;
    }
    return sortMessagesByTime([...prevMessages, newMsg]);
  };

  const handleNewMessage = (newMsg) => {
    const normalizedMsg = {
      ...newMsg,
      timestamp: normalizeTimestamp(newMsg.timestamp),
    };
    setMessages((prev) => updateMessagesWithNew(prev, normalizedMsg));
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrivateMessages(currentUserId, adminId);
      const normalizedMessages = data.map((msg) => ({
        ...msg,
        timestamp: normalizeTimestamp(msg.timestamp),
      }));
      setMessages(sortMessagesByTime(normalizedMessages));

      if (data.length === 0) {
        const defaultMessage = {
          senderId: currentUserId,
          receiverId: adminId,
          content: "Welcome! How can I assist you today?",
          messageType: "TEXT",
        };
        await sendPrivateMessage(defaultMessage);
        const updatedMessages = await getPrivateMessages(
          currentUserId,
          adminId
        );
        const normalizedUpdatedMessages = updatedMessages.map((msg) => ({
          ...msg,
          timestamp: normalizeTimestamp(msg.timestamp),
        }));
        setMessages(sortMessagesByTime(normalizedUpdatedMessages));
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages. Please try again later.");
      message.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(socket);
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "user-id": currentUserId.toString(),
    };

    client.connect(
      headers,
      () => {
        console.log("WebSocket connected successfully for User");
        client.subscribe(`/queue/private/${currentUserId}`, (msg) => {
          const newMsg = JSON.parse(msg.body);
          handleNewMessage(newMsg);
        });
      },
      (err) => {
        console.error("WebSocket connection error:", err);
        setError("Failed to connect to WebSocket. Please refresh the page.");
        message.error("Failed to connect to WebSocket.");
      }
    );
    setStompClient(client);
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
      connectWebSocket();
    }
    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageRequest = {
      senderId: currentUserId,
      receiverId: adminId,
      content: newMessage,
      messageType: "TEXT",
    };

    const tempMessage = {
      ...messageRequest,
      id: `temp-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => sortMessagesByTime([...prev, tempMessage]));
    setNewMessage("");

    try {
      const response = await sendPrivateMessage(messageRequest);
      const sentMessage = {
        ...response,
        timestamp: normalizeTimestamp(response.timestamp),
      };
      setMessages((prev) =>
        sortMessagesByTime(
          prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      message.error("Failed to send message.");
      setMessages((prev) =>
        sortMessagesByTime(prev.filter((msg) => msg.id !== tempMessage.id))
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleRetry = () => {
    fetchMessages();
  };

  const renderChatContent = () => {
    if (loading) return <Spin className="chat-loading" />;

    if (error) {
      return (
        <div className="chat-empty">
          <p className="error-text">{error}</p>
          <Button type="primary" onClick={handleRetry} className="retry-btn">
            Retry
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`chat-message ${
                msg.senderId === currentUserId ? "sent" : "received"
              }`}
            >
              {msg.senderId !== currentUserId && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#f56a00", marginRight: "8px" }}
                />
              )}
              <div className="chat-message-content">
                {msg.senderId !== currentUserId && (
                  <span className="chat-message-sender">Admin</span>
                )}
                <div className="message-bubble">
                  <span>{msg.content}</span>
                </div>
                <span className="chat-message-timestamp">
                  {msg.messageType === "TEXT"
                    ? timeAgo(normalizeTimestamp(msg.timestamp))
                    : msg.messageType}
                </span>
              </div>
              {msg.senderId === currentUserId && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff", marginLeft: "8px" }}
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
            suffix={
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              />
            }
          />
        </div>
      </>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content className="chat-content">
        <div className="chat-header">
          <h3>Chat with Admin</h3>
        </div>
        <div className="chat-container">{renderChatContent()}</div>
      </Content>
    </Layout>
  );
};

export default UserChatPage;
