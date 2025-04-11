// src/components/ChatList.jsx
import React from "react";
import { Avatar, List, Button, Space, Popconfirm } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ChatList = ({
  chats,
  allTopics,
  selectedChat,
  onSelectChat,
  onSubscribe,
  onUnsubscribe,
}) => {
  // Merge chats (admin + subscribed topics) with all topics, avoiding duplicates
  const combinedChats = [
    ...chats,
    ...allTopics
      .filter((topic) => !chats.some((chat) => chat.id === topic.name))
      .map((topic) => ({
        id: topic.name,
        name: topic.name,
        type: "group",
        subscribed: chats.some((chat) => chat.id === topic.name),
        lastMessage: null,
        description: topic.description,
      })),
  ];

  return (
    <div className="chat-list">
      <List
        dataSource={combinedChats}
        renderItem={(chat) => (
          <List.Item
            onClick={() => onSelectChat(chat)}
            className={selectedChat?.id === chat.id ? "selected" : ""}
            actions={[
              chat.type === "group" && (
                <Popconfirm
                  title={
                    chat.subscribed
                      ? `Leave ${chat.name}?`
                      : `Join ${chat.name}?`
                  }
                  onConfirm={(e) => {
                    e.stopPropagation();
                    chat.subscribed
                      ? onUnsubscribe(chat.id)
                      : onSubscribe(chat.id);
                  }}
                  okText="Yes"
                  cancelText="No"
                  disabled={chat.subscribed && selectedChat?.id === chat.id}
                >
                  <Button
                    type="link"
                    onClick={(e) => e.stopPropagation()}
                    danger={chat.subscribed}
                  >
                    {chat.subscribed ? "Leave" : "Join"}
                  </Button>
                </Popconfirm>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    chat.type === "admin" ? <UserOutlined /> : <TeamOutlined />
                  }
                  style={{
                    backgroundColor:
                      chat.type === "admin" ? "#f56a00" : "#1890ff",
                  }}
                />
              }
              title={
                <Space>
                  {chat.name}
                  {chat.type === "group" && !chat.subscribed && (
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      (Not Joined)
                    </span>
                  )}
                </Space>
              }
              description={
                chat.lastMessage
                  ? `${chat.lastMessage.content} • ${chat.lastMessage.timeAgo}`
                  : chat.description || "No messages yet"
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      lastMessage: PropTypes.shape({
        content: PropTypes.string,
        timeAgo: PropTypes.string,
      }),
      subscribed: PropTypes.bool,
    })
  ).isRequired,
  allTopics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  selectedChat: PropTypes.object,
  onSelectChat: PropTypes.func.isRequired,
  onSubscribe: PropTypes.func.isRequired,
  onUnsubscribe: PropTypes.func.isRequired,
};

export default ChatList;
