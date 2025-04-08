import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Avatar, Input, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { sendPrivateMessage, getPrivateMessages } from "../services/Chat";
import "../styles/userChat.css";

const { Content } = Layout;

// Hàm timeAgo để hiển thị thời gian tương đối
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const secondsAgo = Math.floor((now - past) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo} days ago`;
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) return `${monthsAgo} months ago`;
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} years ago`;
};

const UserChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // Lấy userId từ localStorage
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const currentUserId = userProfile.id || 0;
  const adminId = 1;

  // Hàm chuẩn hóa timestamp
  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp === "string") {
      return timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`;
    }
    if (timestamp instanceof Object && timestamp.toString) {
      return timestamp.toString();
    }
    return timestamp;
  };

  // Hàm sắp xếp tin nhắn theo thời gian
  const sortMessagesByTime = (msgs) => {
    return [...msgs].sort((a, b) => {
      const timeA = new Date(normalizeTimestamp(a.timestamp)).getTime();
      const timeB = new Date(normalizeTimestamp(b.timestamp)).getTime();
      return timeA - timeB;
    });
  };

  // Lấy danh sách tin nhắn private với Admin
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

      // Nếu không có tin nhắn, gửi tin nhắn mặc định từ Admin
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
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages. Please try again later.");
      message.error("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Kết nối WebSocket
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
        client.subscribe(`/queue/private/${currentUserId}`, (message) => {
          console.log(
            `Received message on /queue/private/${currentUserId}:`,
            message.body
          );
          const newMsg = JSON.parse(message.body);
          const normalizedMsg = {
            ...newMsg,
            timestamp: normalizeTimestamp(newMsg.timestamp),
          };
          // Tránh trùng lặp tin nhắn
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === normalizedMsg.id)) {
              return prev;
            }
            return sortMessagesByTime([...prev, normalizedMsg]);
          });
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        setError("Failed to connect to WebSocket. Please refresh the page.");
        message.error(
          "Failed to connect to WebSocket. Please refresh the page."
        );
      }
    );
    setStompClient(client);
  };

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
      connectWebSocket();
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [currentUserId]);

  // Gửi tin nhắn
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
    } catch (error) {
      console.error("Failed to send message:", error);
      message.error("Failed to send message. Please try again.");
      setMessages((prev) =>
        sortMessagesByTime(prev.filter((msg) => msg.id !== tempMessage.id))
      );
    }
  };

  // Xử lý khi nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Retry khi có lỗi
  const handleRetry = () => {
    fetchMessages();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="chat-content">
        <div className="chat-header">
          <h3>Chat with Admin</h3>
        </div>
        {loading ? (
          <Spin className="chat-loading" />
        ) : error ? (
          <div className="chat-empty">
            <h3>{error}</h3>
            <Button type="primary" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="chat-messages">
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
                      style={{
                        backgroundColor: "#f56a00",
                        marginRight: "8px",
                      }}
                    />
                  )}
                  <div className="chat-message-content">
                    {msg.senderId !== currentUserId && (
                      <span className="chat-message-sender">Admin</span>
                    )}
                    <span>{msg.content}</span>
                    <span className="chat-message-timestamp">
                      {msg.messageType === "TEXT"
                        ? timeAgo(normalizeTimestamp(msg.timestamp))
                        : msg.messageType}
                    </span>
                  </div>
                  {msg.senderId === currentUserId && (
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: "#1890ff",
                        marginLeft: "8px",
                      }}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div
              className="chat-input"
              style={{ display: "flex", gap: "8px", padding: "16px" }}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <Button type="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default UserChatPage;
