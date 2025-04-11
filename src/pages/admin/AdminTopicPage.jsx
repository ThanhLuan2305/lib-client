import React, { useState, useEffect } from "react";
import { Button, Space, Table, message, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TopicModal from "../../components/admin/TopicModal";
import { createTopic, getAllTopics } from "../../services/admin/Chat";
import "../../styles/adminTopicsPage.css";

const AdminTopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Load topics when page changes
  useEffect(() => {
    handleGetAllTopics();
  }, [page]);

  const handleGetAllTopics = async () => {
    setLoading(true);
    try {
      const topics = await getAllTopics();
      setTopics(topics);
      setTotalElements(topics.length); // Placeholder until API supports pagination
      message.success("Topics fetched successfully");
    } catch (error) {
      message.error("Failed to fetch topics");
      setTopics([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    setLoading(true);
    try {
      const response = await createTopic(values.topicName, values.description);
      message.success(response.message);
      setModalVisible(false);
      handleGetAllTopics(); // Refresh topics
    } catch (error) {
      message.error("Failed to create topic");
    } finally {
      setLoading(false);
    }
  };

  // Table columns for displaying topics
  const columns = [
    {
      title: "Topic Name",
      dataIndex: "name", // Adjust if TopicResponse uses "topicName"
      key: "name",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
  ];

  return (
    <div className="admin-topics-page">
      <h1>Manage Topics</h1>
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTopic}
            loading={loading}
          >
            Add Topic
          </Button>
          <Button type="default" onClick={handleGetAllTopics} loading={loading}>
            Refresh Topics
          </Button>
        </Space>
      </Space>
      <Table
        className="topic-table"
        columns={columns}
        dataSource={topics}
        rowKey="name" // Adjust if TopicResponse has a different unique key
        loading={loading}
        pagination={false} // Disabled until API supports pagination
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "No topics available" }}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalElements}
        onChange={(newPage) => setPage(newPage)}
        style={{ marginTop: "20px", textAlign: "right" }}
      />
      <TopicModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default AdminTopicPage;
