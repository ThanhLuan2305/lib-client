import React from "react";
import { List, Button, Space, Popconfirm, Tag } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "../styles/topicList.css";

const TopicList = ({ topics, subscribedTopics, onSubscribe, onUnsubscribe }) => {
  return (
    <div className="topic-list">
      <h4>Available Topics</h4>
      <List
        dataSource={topics}
        renderItem={(topic) => {
          const isSubscribed = subscribedTopics.includes(topic.name);
          return (
            <List.Item
              actions={[
                isSubscribed ? (
                  <Popconfirm
                    title={`Leave ${topic.name}?`}
                    onConfirm={() => onUnsubscribe(topic.name)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" danger>
                      Leave
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => onSubscribe(topic.name)}
                  >
                    Join
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<TeamOutlined />}
                title={
                  <Space>
                    {topic.name}
                    {isSubscribed && <Tag color="green">Joined</Tag>}
                  </Space>
                }
                description={topic.description || "No description"}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

TopicList.propTypes = {
  topics: PropTypes.array.isRequired,
  subscribedTopics: PropTypes.array.isRequired,
  onSubscribe: PropTypes.func.isRequired,
  onUnsubscribe: PropTypes.func.isRequired,
};

export default TopicList;