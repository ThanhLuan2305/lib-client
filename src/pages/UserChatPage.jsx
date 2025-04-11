// src/pages/UserChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Layout, message } from "antd";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import {
  sendPrivateMessage,
  getPrivateMessages,
  sendGroupMessage,
  getMessagesInTopic,
  getSubscribedTopics,
  subscribeToTopic,
  unsubscribeFromTopic,
  getAllTopics,
} from "../services/Chat";
import "../styles/userChat.css";

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

const UserChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [recentlySentMessageIds, setRecentlySentMessageIds] = useState(
    new Set()
  );
  const [allTopics, setAllTopics] = useState([]);

  const selectedChatRef = useRef(null);
  const processedMessageIds = useRef(new Set());

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const currentUserId = userProfile.id || 0;
  const adminId = 1;

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toISOString();
    if (typeof timestamp === "number") {
      if (timestamp < 10 ** 12) timestamp *= 1000;
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

  const getUniqueMessages = (messages) => {
    if (!Array.isArray(messages)) {
      console.warn("getUniqueMessages: messages is not an array", messages);
      return [];
    }

    const uniqueMessages = [];
    const seenIds = new Set();
    const sortedMessages = sortMessagesByTime(messages);

    for (const msg of sortedMessages) {
      if (!seenIds.has(msg.id)) {
        seenIds.add(msg.id);
        uniqueMessages.push({
          ...msg,
          uniqueId: `${msg.id}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          timeAgo: timeAgo(normalizeTimestamp(msg.timestamp)),
        });
      }
    }
    return uniqueMessages;
  };

  const handleNewMessage = (newMsg) => {
    const normalizedMsg = {
      ...newMsg,
      senderId: parseInt(newMsg.senderId) || newMsg.senderId,
      timestamp: normalizeTimestamp(newMsg.timestamp),
      id: newMsg.id || `temp-${Date.now()}`,
    };

    if (
      processedMessageIds.current.has(normalizedMsg.id) ||
      recentlySentMessageIds.has(normalizedMsg.id)
    ) {
      if (recentlySentMessageIds.has(normalizedMsg.id)) {
        setRecentlySentMessageIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(normalizedMsg.id);
          return newSet;
        });
      }
      return;
    }

    processedMessageIds.current.add(normalizedMsg.id);

    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (
          (chat.type === "admin" &&
            (normalizedMsg.senderId === adminId ||
              normalizedMsg.receiverId === adminId) &&
            (normalizedMsg.senderId === currentUserId ||
              normalizedMsg.receiverId === currentUserId)) ||
          (chat.type === "group" && normalizedMsg.topic === chat.id)
        ) {
          const updatedMessages = [...(chat.messages || []), normalizedMsg];
          return {
            ...chat,
            lastMessage: {
              content: normalizedMsg.content,
              timeAgo: timeAgo(normalizedMsg.timestamp),
              timestamp: normalizedMsg.timestamp,
            },
            messages: updatedMessages,
          };
        }
        return chat;
      });
      return sortChatsByLastMessage(updatedChats);
    });

    const selectedChatValue = selectedChatRef.current;
    if (selectedChatValue) {
      if (
        (selectedChatValue.type === "admin" &&
          (normalizedMsg.senderId === adminId ||
            normalizedMsg.receiverId === adminId) &&
          (normalizedMsg.senderId === currentUserId ||
            normalizedMsg.receiverId === currentUserId)) ||
        (selectedChatValue.type === "group" &&
          normalizedMsg.topic === selectedChatValue.id)
      ) {
        setMessages((prev) => {
          const combinedMessages = [...prev, normalizedMsg];
          return getUniqueMessages(combinedMessages);
        });
      }
    }
  };

  const sortChatsByLastMessage = (chats) => {
    return [...chats].sort((a, b) => {
      const timeA = a.lastMessage
        ? new Date(normalizeTimestamp(a.lastMessage.timestamp)).getTime()
        : 0;
      const timeB = b.lastMessage
        ? new Date(normalizeTimestamp(b.lastMessage.timestamp)).getTime()
        : 0;
      return timeB - timeA;
    });
  };

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all topics
      const allTopics = await getAllTopics();
      setAllTopics(allTopics);

      // Fetch subscribed topics
      const subscribedTopics = await getSubscribedTopics(currentUserId);

      // Fetch admin messages
      const adminMessages = await getPrivateMessages(currentUserId, adminId);
      const normalizedAdminMessages = adminMessages.map((msg) => ({
        ...msg,
        timestamp: normalizeTimestamp(msg.timestamp),
      }));

      // Fetch group chats for subscribed topics
      const groupChats = await Promise.all(
        subscribedTopics.map(async (topic) => {
          const messages = await getMessagesInTopic(topic);
          const normalizedMessages = messages.map((msg) => ({
            ...msg,
            timestamp: normalizeTimestamp(msg.timestamp),
          }));
          const sortedMessages = sortMessagesByTime(normalizedMessages);
          const lastMessage = sortedMessages[sortedMessages.length - 1];
          return {
            id: topic,
            name: topic,
            type: "group",
            subscribed: true,
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  timeAgo: timeAgo(lastMessage.timestamp),
                  timestamp: lastMessage.timestamp,
                }
              : null,
            messages: sortedMessages,
          };
        })
      );

      // Create admin chat
      const adminChat = {
        id: "admin",
        name: "Admin",
        type: "admin",
        subscribed: true,
        lastMessage: normalizedAdminMessages.length
          ? {
              content:
                normalizedAdminMessages[normalizedAdminMessages.length - 1]
                  .content,
              timeAgo: timeAgo(
                normalizedAdminMessages[normalizedAdminMessages.length - 1]
                  .timestamp
              ),
              timestamp:
                normalizedAdminMessages[normalizedAdminMessages.length - 1]
                  .timestamp,
            }
          : null,
        messages: normalizedAdminMessages,
      };

      // Combine and sort chats (only subscribed ones)
      const allChats = [adminChat, ...groupChats];
      const sortedChats = sortChatsByLastMessage(allChats);
      setChats(sortedChats);

      if (sortedChats.length > 0 && !selectedChat) {
        setSelectedChat(sortedChats[0]);
        setMessages(getUniqueMessages(sortedChats[0].messages || []));
      }

      processedMessageIds.current.clear();
      allChats.forEach((chat) => {
        (chat.messages || []).forEach((msg) => {
          processedMessageIds.current.add(msg.id);
        });
      });

      if (adminMessages.length === 0) {
        const defaultMessage = {
          senderId: currentUserId,
          receiverId: adminId,
          content: "Welcome! How can I assist you today?",
        };
        await sendPrivateMessage(defaultMessage);
        const updatedAdminMessages = await getPrivateMessages(
          currentUserId,
          adminId
        );
        const normalizedUpdatedMessages = updatedAdminMessages.map((msg) => ({
          ...msg,
          timestamp: normalizeTimestamp(msg.timestamp),
        }));

        processedMessageIds.current.clear();
        normalizedUpdatedMessages.forEach((msg) => {
          processedMessageIds.current.add(msg.id);
        });

        const updatedAdminChat = {
          ...adminChat,
          lastMessage: normalizedUpdatedMessages.length
            ? {
                content:
                  normalizedUpdatedMessages[
                    normalizedUpdatedMessages.length - 1
                  ].content,
                timeAgo: timeAgo(
                  normalizedUpdatedMessages[
                    normalizedUpdatedMessages.length - 1
                  ].timestamp
                ),
                timestamp:
                  normalizedUpdatedMessages[
                    normalizedUpdatedMessages.length - 1
                  ].timestamp,
              }
            : null,
          messages: normalizedUpdatedMessages,
        };

        setChats((prev) => {
          const updatedChats = prev.map((chat) =>
            chat.id === "admin" ? updatedAdminChat : chat
          );
          return sortChatsByLastMessage(updatedChats);
        });

        setSelectedChat(updatedAdminChat);
        setMessages(getUniqueMessages(normalizedUpdatedMessages));
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
      setError("Failed to load chats. Please try again later.");
      message.error("Failed to load chats.");
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
      console.log("WebSocket message:", newMsg);
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
      if (newMsg.status === "subscribed" || newMsg.status === "unsubscribed") {
        fetchChats();
        return;
      }

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
    if (currentUserId) {
      fetchChats();
      connectWebSocket();
    }
    return () => {
      if (socket) socket.close();
    };
  }, [currentUserId]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setNewMessage("");
    setMessages(getUniqueMessages(chat.messages || []));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      senderId: currentUserId,
      [selectedChat.type === "admin" ? "receiverId" : "topic"]:
        selectedChat.type === "admin" ? adminId : selectedChat.id,
      content: newMessage,
      id: tempId,
      uniqueId: `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      timeAgo: timeAgo(new Date().toISOString()),
    };

    setMessages((prev) => getUniqueMessages([...prev, tempMessage]));
    setNewMessage("");

    try {
      let response;
      if (selectedChat.type === "admin") {
        const messageRequest = {
          senderId: currentUserId,
          receiverId: adminId,
          content: newMessage,
        };
        response = await sendPrivateMessage(messageRequest);
      } else {
        response = await sendGroupMessage(
          currentUserId,
          selectedChat.id,
          newMessage
        );
      }

      const sentMessage = {
        ...response,
        timestamp: normalizeTimestamp(response.timestamp),
        uniqueId: `${response.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        timeAgo: timeAgo(normalizeTimestamp(response.timestamp)),
      };

      setRecentlySentMessageIds((prev) => new Set(prev).add(sentMessage.id));
      processedMessageIds.current.add(sentMessage.id);

      setMessages((prev) => {
        const updatedMessages = prev.map((msg) =>
          msg.id === tempId ? sentMessage : msg
        );
        return getUniqueMessages(updatedMessages);
      });

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === selectedChat.id) {
            return {
              ...chat,
              lastMessage: {
                content: sentMessage.content,
                timeAgo: sentMessage.timeAgo,
                timestamp: sentMessage.timestamp,
              },
              messages: [...(chat.messages || []), sentMessage],
            };
          }
          return chat;
        });
        return sortChatsByLastMessage(updatedChats);
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      message.error("Failed to send message.");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleRetry = () => {
    fetchChats();
  };

  const handleSubscribe = async (topic) => {
    try {
      await subscribeToTopic(topic);
      message.success(`Subscribed to ${topic}`);
      fetchChats(); // Refresh chats to include new subscription
    } catch (err) {
      message.error(`Failed to subscribe to ${topic}`);
    }
  };

  const handleUnsubscribe = async (topic) => {
    try {
      await unsubscribeFromTopic(topic);
      message.success(`Unsubscribed from ${topic}`);
      if (selectedChat?.id === topic) {
        setSelectedChat(null);
        setMessages([]);
      }
      fetchChats(); // Refresh chats to remove unsubscribed topic
    } catch (err) {
      message.error(`Failed to unsubscribe from ${topic}`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Sider width={300} style={{ background: "#fff", padding: "10px" }}>
        <div className="chat-header">
          <h3>Chats</h3>
        </div>
        <ChatList
          chats={chats}
          allTopics={allTopics}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
        />
      </Sider>
      <Layout>
        <Content className="chat-content">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <h3>{selectedChat.name}</h3>
              </div>
              <ChatWindow
                messages={messages}
                loading={loading}
                error={error}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
                onRetry={handleRetry}
                currentUserId={currentUserId}
              />
            </>
          ) : (
            <div className="chat-empty">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserChatPage;
