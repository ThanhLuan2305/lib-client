import React, { useState, useEffect, useRef } from "react";
import { Layout, List, Avatar, Spin, Button, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getPrivateMessages, sendPrivateMessage } from "../../services/Chat";
import { getUsersChattingWithAdmin } from "../../services/admin/Chat";
import "../../styles/adminChat.css";

const { Sider, Content } = Layout;

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

const AdminChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const selectedUserIdRef = useRef(null);

  const adminId = 1;

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
    console.log("Updated selectedUserIdRef to:", selectedUserIdRef.current);
  }, [selectedUserId]);

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
      setUsers([...new Set(userIds)] || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setError("Failed to load users. Please try again.");
      message.error("Failed to load users. Please try again.");
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
      // Kết hợp tin nhắn từ API và tin nhắn từ pendingMessages
      const pendingForUser = pendingMessages.filter(
        (msg) =>
          (msg.senderId === userId && msg.receiverId === adminId) ||
          (msg.senderId === adminId && msg.receiverId === userId)
      );
      setMessages(
        sortMessagesByTime([...normalizedMessages, ...pendingForUser])
      );
      // Xóa tin nhắn đã hiển thị khỏi pendingMessages
      setPendingMessages((prev) =>
        prev.filter(
          (msg) =>
            !(
              (msg.senderId === userId && msg.receiverId === adminId) ||
              (msg.senderId === adminId && msg.receiverId === userId)
            )
        )
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages. Please try again.");
      message.error("Failed to load messages. Please try again.");
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
      "user-id": "1",
    };

    client.connect(
      headers,
      () => {
        console.log("WebSocket connected successfully for Admin");
        client.subscribe(`/queue/private/admin`, (message) => {
          console.log(
            `Received message on /queue/private/admin:`,
            message.body
          );
          const newMsg = JSON.parse(message.body);
          const normalizedMsg = {
            ...newMsg,
            senderId: parseInt(newMsg.senderId), // Chuyển senderId thành number
            timestamp: normalizeTimestamp(newMsg.timestamp),
          };
          const senderId = parseInt(newMsg.senderId);
          const currentSelectedUserId = selectedUserIdRef.current; // Sử dụng giá trị mới nhất từ useRef
          console.log(
            `Comparing selectedUserId: ${currentSelectedUserId} with senderId: ${senderId}`
          );

          // Cập nhật danh sách users nếu senderId chưa có
          if (!users.includes(senderId) && senderId !== adminId) {
            setUsers((prev) => [...new Set([...prev, senderId])]);
          }

          // Cập nhật tin nhắn nếu đang xem User đó
          console.log(
            `Checking if message is for selected user: ${currentSelectedUserId} and senderId: ${senderId}`
          );
          if (currentSelectedUserId === senderId) {
            setMessages((prev) => {
              if (prev.some((msg) => msg.id === normalizedMsg.id)) {
                console.log(
                  "Message already exists, skipping:",
                  normalizedMsg.id
                );
                return prev;
              }
              console.log("Adding new message:", normalizedMsg);
              return sortMessagesByTime([...prev, normalizedMsg]);
            });
          } else {
            // Lưu tin nhắn vào pendingMessages nếu không phải User đang chọn
            console.log(
              "Message received but not for selected user. Selected:",
              currentSelectedUserId,
              "Sender:",
              senderId
            );
            setPendingMessages((prev) => {
              if (prev.some((msg) => msg.id === normalizedMsg.id)) {
                return prev;
              }
              return sortMessagesByTime([...prev, normalizedMsg]);
            });
          }
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
    fetchUsers();
    connectWebSocket();
    return () => {
      if (stompClient) {
        console.log("Disconnecting WebSocket");
        stompClient.disconnect();
      }
    };
  }, []);

  // Kiểm tra pendingMessages khi selectedUserId thay đổi
  useEffect(() => {
    if (selectedUserId) {
      console.log("Selected user changed to:", selectedUserId);
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const messageRequest = {
      senderId: adminId,
      receiverId: selectedUserId,
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
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    } else {
      fetchUsers();
    }
  };

  // Xử lý chọn User
  const handleSelectUser = (userId) => {
    console.log("Selecting user:", userId);
    setSelectedUserId(userId);
    fetchMessages(userId); // Gọi ngay fetchMessages để tránh delay
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider width={300}>
          <div className="chat-sider">
            <h3 className="chat-sider-title">Users</h3>
            {loading && !users.length ? (
              <Spin className="chat-loading" />
            ) : error ? (
              <div className="chat-empty">
                <h3>{error}</h3>
                <Button type="primary" onClick={handleRetry}>
                  Retry
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="chat-empty">
                <h3>No users have messaged yet</h3>
              </div>
            ) : (
              <List
                dataSource={users}
                renderItem={(userId) => (
                  <List.Item
                    className={`chat-room-item ${
                      selectedUserId === userId ? "selected" : ""
                    }`}
                    onClick={() => handleSelectUser(userId)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <span className="chat-room-title">User {userId}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Sider>
        <Content className="chat-content">
          {selectedUserId ? (
            loading ? (
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
                <div className="chat-header">
                  <h3>Chat with User {selectedUserId}</h3>
                </div>
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`chat-message ${
                        msg.senderId === adminId ? "sent" : "received"
                      }`}
                    >
                      {msg.senderId !== adminId && (
                        <Avatar
                          icon={<UserOutlined />}
                          style={{
                            backgroundColor: "#f56a00",
                            marginRight: "8px",
                          }}
                        />
                      )}
                      <div className="chat-message-content">
                        <span>{msg.content}</span>
                        <span className="chat-message-timestamp">
                          {msg.messageType === "TEXT"
                            ? timeAgo(normalizeTimestamp(msg.timestamp))
                            : msg.messageType}
                        </span>
                      </div>
                      {msg.senderId === adminId && (
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
            )
          ) : (
            <div className="chat-empty">
              <h3>Select a user to start messaging</h3>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminChatPage;
