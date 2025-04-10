import React, { useState, useEffect, useRef } from "react";
import { Layout, List, Avatar, Spin, Button, Input, message } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { getPrivateMessages, sendPrivateMessage } from "../../services/Chat";
import { getUsersChattingWithAdmin } from "../../services/admin/Chat";
import "../../styles/adminChat.css";

const { Sider, Content } = Layout;

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

const AdminChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const selectedUserIdRef = useRef(null);
  const adminId = 1; // Giả định adminId là 1, có thể lấy từ AuthContext nếu cần

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return null;

    // Nếu timestamp là số (epoch time in seconds), chuyển thành milliseconds
    if (typeof timestamp === "number") {
      // Kiểm tra nếu timestamp nhỏ hơn 10^12, giả định là giây, nhân 1000 để thành milliseconds
      if (timestamp < 10 ** 12) {
        timestamp *= 1000;
      }
      return new Date(timestamp).toISOString();
    }

    // Nếu timestamp là chuỗi, kiểm tra định dạng
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userIds = await getUsersChattingWithAdmin();
      setUsers(Array.from(new Set(userIds)));
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again.");
      message.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrivateMessages(userId, adminId);
      const normalizedMessages = data.map((msg) => ({
        ...msg,
        timestamp: normalizeTimestamp(msg.timestamp),
      }));
      const pendingForUser = pendingMessages.filter(
        (msg) =>
          (msg.senderId === userId && msg.receiverId === adminId) ||
          (msg.senderId === adminId && msg.receiverId === userId)
      );
      const combinedMessages = [...normalizedMessages, ...pendingForUser];
      const uniqueMessages = Array.from(
        new Map(combinedMessages.map((msg) => [msg.id, msg])).values()
      );
      setMessages(sortMessagesByTime(uniqueMessages));
      setPendingMessages((prev) =>
        prev.filter(
          (msg) =>
            !(
              (msg.senderId === userId && msg.receiverId === adminId) ||
              (msg.senderId === adminId && msg.receiverId === userId)
            )
        )
      );
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages. Please try again.");
      message.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const moveUserToTop = (userId) => {
    setUsers((prev) => {
      const filteredUsers = prev.filter((id) => id !== userId);
      return [userId, ...filteredUsers];
    });
  };

  const updateMessages = (currentMessages, normalizedMsg) => {
    const messageIndex = currentMessages.findIndex(
      (msg) => msg.id === normalizedMsg.id
    );
    if (messageIndex === -1) {
      return sortMessagesByTime([...currentMessages, normalizedMsg]);
    } else {
      const updatedMessages = [...currentMessages];
      updatedMessages[messageIndex] = normalizedMsg;
      return sortMessagesByTime(updatedMessages);
    }
  };

  const handleNewUserMessage = (senderId) => {
    if (!users.includes(senderId) && senderId !== adminId) {
      setUsers((prevUsers) => Array.from(new Set([senderId, ...prevUsers])));
    } else if (senderId !== adminId) {
      moveUserToTop(senderId);
    }
  };

  const handleMessageUpdate = (senderId, normalizedMsg) => {
    if (selectedUserIdRef.current === senderId) {
      setMessages((prevMessages) =>
        updateMessages(prevMessages, normalizedMsg)
      );
    } else {
      setPendingMessages((prevPending) =>
        updateMessages(prevPending, normalizedMsg)
      );
    }
  };

  const connectWebSocket = () => {
    if (!adminId || isNaN(adminId)) {
      setError("Invalid admin ID. Please log in again.");
      message.error("Authentication required.");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8080/chat?userId=${adminId}`);

    ws.onopen = () => {
      console.log("WebSocket connected successfully for Admin", adminId);
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
      const normalizedMsg = {
        ...newMsg,
        senderId: parseInt(newMsg.senderId),
        timestamp: normalizeTimestamp(newMsg.timestamp),
      };
      const senderId = parseInt(newMsg.senderId);

      handleNewUserMessage(senderId);
      handleMessageUpdate(senderId, normalizedMsg);
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
    fetchUsers();
    connectWebSocket();
    return () => {
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    if (selectedUserId) fetchMessages(selectedUserId);
  }, [selectedUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const messageRequest = {
      senderId: adminId,
      receiverId: selectedUserId,
      content: newMessage,
    };

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      ...messageRequest,
      id: tempId,
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
          prev.map((msg) => (msg.id === tempId ? sentMessage : msg))
        )
      );
      moveUserToTop(selectedUserId);
    } catch (err) {
      console.error("Failed to send message:", err);
      message.error("Failed to send message.");
      setMessages((prev) =>
        sortMessagesByTime(prev.filter((msg) => msg.id !== tempId))
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleRetry = () => {
    if (selectedUserId) fetchMessages(selectedUserId);
    else fetchUsers();
  };

  const renderUserList = () => {
    if (loading && !users.length) return <Spin className="chat-loading" />;
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
    if (!users.length) {
      return (
        <div className="chat-empty">
          <p>No users have messaged yet</p>
        </div>
      );
    }
    return (
      <List
        dataSource={users}
        renderItem={(userId) => (
          <List.Item
            className={`chat-room-item ${
              selectedUserId === userId ? "selected" : ""
            }`}
            onClick={() => setSelectedUserId(userId)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
              }
              title={<span className="chat-room-title">User {userId}</span>}
            />
          </List.Item>
        )}
      />
    );
  };

  const renderChatContent = () => {
    if (!selectedUserId) {
      return (
        <div className="chat-empty">
          <h3>Select a user to start messaging</h3>
        </div>
      );
    }
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
        <div className="chat-header">
          <h3>Chat with User {selectedUserId}</h3>
        </div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.senderId === adminId ? "sent" : "received"
              }`}
            >
              {msg.senderId !== adminId && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#f56a00", marginRight: "8px" }}
                />
              )}
              <div className="chat-message-content">
                <div className="message-bubble">
                  <span>{msg.content}</span>
                </div>
                <span className="chat-message-timestamp">
                  {timeAgo(normalizeTimestamp(msg.timestamp))}
                </span>
              </div>
              {msg.senderId === adminId && (
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
      <Sider
        width={300}
        style={{ background: "#fff", boxShadow: "2px 0 8px rgba(0,0,0,0.1)" }}
      >
        <div className="chat-sider">
          <h3 className="chat-sider-title">Users</h3>
          {renderUserList()}
        </div>
      </Sider>
      <Content style={{ padding: "16px" }}>
        <div className="chat-container">{renderChatContent()}</div>
      </Content>
    </Layout>
  );
};

export default AdminChatPage;
