import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Avatar, Input, Button, message } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
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
  const [socket, setSocket] = useState(null);
  const [recentlySentMessageIds, setRecentlySentMessageIds] = useState(
    new Set()
  );
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const processedMessageIds = useRef(new Set()); // Để theo dõi các tin nhắn đã xử lý

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const currentUserId = userProfile.id || 0;
  const adminId = 1;

  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return null;

    if (typeof timestamp === "number") {
      if (timestamp < 10 ** 12) {
        timestamp *= 1000;
      }
      return new Date(timestamp).toISOString();
    }

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

  // Sửa lại phương thức xử lý loại bỏ tin nhắn trùng lặp
  const getUniqueMessages = (messages) => {
    const uniqueMessages = [];
    const seenIds = new Set();

    // Sắp xếp trước để đảm bảo lấy tin nhắn mới nhất
    const sortedMessages = sortMessagesByTime(messages);

    // Duyệt từ tin nhắn cũ đến mới nhất
    for (const msg of sortedMessages) {
      if (!seenIds.has(msg.id)) {
        seenIds.add(msg.id);
        uniqueMessages.push({
          ...msg,
          uniqueId: `${msg.id}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
        });
      }
    }

    return uniqueMessages;
  };

  const handleNewMessage = (newMsg) => {
    const normalizedMsg = {
      ...newMsg,
      senderId: parseInt(newMsg.senderId),
      timestamp: normalizeTimestamp(newMsg.timestamp),
    };

    // Nếu tin nhắn đã được xử lý hoặc là tin nhắn vừa gửi bởi user, bỏ qua
    if (
      processedMessageIds.current.has(normalizedMsg.id) ||
      recentlySentMessageIds.has(normalizedMsg.id)
    ) {
      // Xóa khỏi danh sách tin nhắn vừa gửi nếu phù hợp
      if (recentlySentMessageIds.has(normalizedMsg.id)) {
        setRecentlySentMessageIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(normalizedMsg.id);
          return newSet;
        });
      }
      return;
    }

    // Đánh dấu là đã xử lý
    processedMessageIds.current.add(normalizedMsg.id);

    // Cập nhật danh sách tin nhắn
    setMessages((prev) => {
      const combinedMessages = [...prev, normalizedMsg];
      return getUniqueMessages(combinedMessages);
    });
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrivateMessages(currentUserId, adminId);

      // Reset processed message ids khi fetch mới
      processedMessageIds.current.clear();

      // Chuẩn hóa thời gian
      const normalizedMessages = data.map((msg) => ({
        ...msg,
        timestamp: normalizeTimestamp(msg.timestamp),
      }));

      // Lưu ID các tin nhắn đã xử lý
      normalizedMessages.forEach((msg) => {
        processedMessageIds.current.add(msg.id);
      });

      // Đặt danh sách tin nhắn độc nhất
      setMessages(getUniqueMessages(normalizedMessages));

      if (data.length === 0) {
        const defaultMessage = {
          senderId: currentUserId,
          receiverId: adminId,
          content: "Welcome! How can I assist you today?",
        };
        await sendPrivateMessage(defaultMessage);
        const updatedMessages = await getPrivateMessages(
          currentUserId,
          adminId
        );

        // Chuẩn hóa thời gian
        const normalizedUpdatedMessages = updatedMessages.map((msg) => ({
          ...msg,
          timestamp: normalizeTimestamp(msg.timestamp),
        }));

        // Làm mới danh sách tin nhắn đã xử lý
        processedMessageIds.current.clear();
        normalizedUpdatedMessages.forEach((msg) => {
          processedMessageIds.current.add(msg.id);
        });

        // Đặt danh sách tin nhắn độc nhất
        setMessages(getUniqueMessages(normalizedUpdatedMessages));
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
    if (!currentUserId || isNaN(currentUserId)) {
      setError("Invalid user ID. Please log in again.");
      message.error("Authentication required.");
      return;
    }

    const ws = new WebSocket(
      `ws://localhost:8080/chat?userId=${currentUserId}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected successfully for User", currentUserId);
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      if (newMsg.error) {
        console.error("WebSocket error:", newMsg.error);
        setError(newMsg.error);
        ws.close();
        return;
      }
      if (newMsg.status === "connected") {
        console.log("Connected with userId:", newMsg.userId);
        return;
      }

      // Xử lý tin nhắn mới
      handleNewMessage(newMsg);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Failed to connect to WebSocket. Please refresh the page.");
      message.error("Failed to connect to WebSocket.");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setError("WebSocket connection closed.");
    };

    setSocket(ws);
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
      if (socket) socket.close();
    };
  }, [currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageRequest = {
      senderId: currentUserId,
      receiverId: adminId,
      content: newMessage,
    };

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      ...messageRequest,
      id: tempId,
      uniqueId: `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Thêm tin nhắn tạm thời vào danh sách
    setMessages((prev) => getUniqueMessages([...prev, tempMessage]));
    setNewMessage("");

    try {
      const response = await sendPrivateMessage(messageRequest);
      const sentMessage = {
        ...response,
        timestamp: normalizeTimestamp(response.timestamp),
        uniqueId: `${response.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
      };

      // Đánh dấu tin nhắn đã gửi để tránh lặp lại từ websocket
      setRecentlySentMessageIds((prev) => new Set(prev).add(sentMessage.id));
      processedMessageIds.current.add(sentMessage.id);

      // Cập nhật tin nhắn tạm thời thành tin nhắn đã gửi
      setMessages((prev) => {
        const updatedMessages = prev.map((msg) =>
          msg.id === tempId ? sentMessage : msg
        );
        return getUniqueMessages(updatedMessages);
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      message.error("Failed to send message.");

      // Xóa tin nhắn tạm thời nếu gửi thất bại
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
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
          {messages.map((msg) => (
            <div
              key={
                msg.uniqueId ||
                `${msg.id}-${Math.random().toString(36).substring(2, 9)}`
              }
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
                  {timeAgo(normalizeTimestamp(msg.timestamp))}
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
