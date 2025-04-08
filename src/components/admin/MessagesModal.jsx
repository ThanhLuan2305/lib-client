import React from "react";
import { Modal, Table } from "antd";

const MessagesModal = ({
  visible,
  onCancel,
  messages,
  loading,
  currentPage,
  pageSize,
  totalMessages,
  onPageChange,
}) => {
  const messageColumns = [
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Sent At",
      dataIndex: "timeStamp",
      key: "timeStamp",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Modal
      title="Messages"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table
        columns={messageColumns}
        dataSource={messages}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalMessages,
          onChange: onPageChange,
        }}
        rowKey="messageId"
      />
    </Modal>
  );
};

export default MessagesModal;
