import React from "react";
import { Table, Button, Popconfirm, Space, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "../styles/userTable.css";

const UserTable = ({ users, onView, onEdit, onDelete, loading }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Verification Status",
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      width: 150,
      render: (status) => (
        <Tag color={status === "FULLY_VERIFIED" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      width: 150,
      render: (roles) =>
        roles ? (
          <Space>
            {roles.map((role) => (
              <Tag
                key={role.name}
                color={role.name === "ADMIN" ? "blue" : "default"}
              >
                {role.name}
              </Tag>
            ))}
          </Space>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            type="primary"
            ghost
            size="small"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="primary"
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="user-table"
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserTable;
