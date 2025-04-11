import React, { useEffect, useRef } from "react";
import { Spin, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import ChatMessage from "./ChatMessage";
import PropTypes from "prop-types";

const ChatWindow = ({
  messages,
  loading,
  error,
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  onRetry,
  currentUserId,
}) => {
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) return <Spin className="chat-loading" />;

  if (error) {
    return (
      <div className="chat-empty">
        <p className="error-text">{error}</p>
        <Button type="primary" onClick={onRetry} className="retry-btn">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.uniqueId}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          className="message-input"
          suffix={
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={onSendMessage}
              disabled={!newMessage.trim()}
            />
          }
        />
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default ChatWindow;
