import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ChatMessage = ({ message, currentUserId }) => {
  const isSentByCurrentUser = message.senderId === currentUserId;

  return (
    <div
      className={`chat-message ${isSentByCurrentUser ? "sent" : "received"}`}
    >
      {!isSentByCurrentUser && (
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: "#f56a00", marginRight: "8px" }}
        />
      )}
      <div className="chat-message-content">
        {!isSentByCurrentUser && (
          <span className="chat-message-sender">
            {message.senderId === 1 ? "Admin" : `User ${message.senderId}`}
          </span>
        )}
        <div className="message-bubble">
          <span>{message.content}</span>
        </div>
        <span className="chat-message-timestamp">{message.timeAgo}</span>
      </div>
      {isSentByCurrentUser && (
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", marginLeft: "8px" }}
        />
      )}
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    uniqueId: PropTypes.string.isRequired,
    senderId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    timeAgo: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default ChatMessage;
