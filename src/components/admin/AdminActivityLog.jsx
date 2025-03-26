import React from "react";
import { Table, Button, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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
  ];

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
        pagination={false} // Tắt phân trang mặc định
        scroll={{ x: "max-content" }}
      />
      <CustomPagination
        currentPage={currentPage}
        setPage={setPage}
        totalElements={totalElements}
        pageSize={pageSize}
      />
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
