import React, { useState } from "react";
import { Table, Button, Popconfirm, Space, Modal } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import CustomPagination from "../Pagination";
import "../../styles/activityLogTable.css";

const AdminActivityLog = ({
  activities,
  loading,
  onDeleteAll,
  currentPage,
  setPage,
  totalElements,
  pageSize,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const showDetailModal = (record) => {
    setSelectedLog(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLog(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 200,
      render: (timestamp) =>
        timestamp ? dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            type="primary"
            ghost
            size="small"
          />
        </Space>
      ),
    },
  ];

  // Hàm so sánh và tạo dữ liệu bảng
  const renderChangeTable = (before, after) => {
    if (!before && !after) {
      return <p>No changes available</p>;
    }

    // Lấy tất cả các key từ cả hai object
    const beforeKeys = before ? Object.keys(before) : [];
    const afterKeys = after ? Object.keys(after) : [];
    const allKeys = [...new Set([...beforeKeys, ...afterKeys])];

    // Lọc các field có thay đổi hoặc chỉ hiển thị nếu cần
    const dataSource = allKeys
      .filter((key) => {
        const beforeValue = before?.[key];
        const afterValue = after?.[key];
        return JSON.stringify(beforeValue) !== JSON.stringify(afterValue); // Chỉ giữ field khác nhau
      })
      .map((key) => ({
        key,
        field: key,
        before: before?.[key] ?? "N/A",
        after: after?.[key] ?? "N/A",
      }));

    const changeColumns = [
      { title: "Field", dataIndex: "field", key: "field", width: 200 },
      {
        title: "Before",
        dataIndex: "before",
        key: "before",
        render: (value) =>
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : String(value),
      },
      {
        title: "After",
        dataIndex: "after",
        key: "after",
        render: (value) =>
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : String(value),
      },
    ];

    return (
      <Table
        dataSource={dataSource}
        columns={changeColumns}
        pagination={false}
        size="small"
        scroll={{ x: "max-content" }}
      />
    );
  };

  return (
    <div className="activity-log-table-container">
      <div className="activity-log-actions">
        <Popconfirm
          title="Are you sure to delete all activity logs?"
          onConfirm={onDeleteAll}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete All
          </Button>
        </Popconfirm>
      </div>
      <Table
        className="activity-log-table"
        columns={columns}
        dataSource={activities}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <CustomPagination
        currentPage={currentPage}
        setPage={setPage}
        totalElements={totalElements}
        pageSize={pageSize}
      />
      <Modal
        title="Activity Log Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <h3>Changes</h3>
            {renderChangeTable(selectedLog.beforeChange, selectedLog.afterChange)}
          </div>
        )}
      </Modal>
    </div>
  );
};

AdminActivityLog.propTypes = {
  activities: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDeleteAll: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalElements: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default AdminActivityLog;