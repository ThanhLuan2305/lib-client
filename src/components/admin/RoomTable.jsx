import React from "react";
import { Table, Button } from "antd";
import {
  MessageOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

const RoomTable = ({
  rooms,
  loading,
  currentPage,
  pageSize,
  totalRooms,
  onPageChange,
  onViewMessages,
  onAddUser,
  onRemoveUser,
}) => {
  const columns = [
    {
      title: "Room ID",
      dataIndex: "roomId",
      key: "roomId",
    },
    {
      title: "Room Name",
      dataIndex: "name", // Sửa từ roomName thành name
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "roomType", // Đã đúng
      key: "roomType",
      render: (roomType) => roomType.toLowerCase(), // Hiển thị chữ thường
    },
    {
      title: "Users",
      dataIndex: "userIds",
      key: "userIds",
      render: (userIds) => userIds?.length || 0, // Hiển thị số lượng người dùng
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<MessageOutlined />}
            onClick={() => onViewMessages(record.roomId)}
          >
            View Messages
          </Button>
          <Button
            type="link"
            icon={<UserAddOutlined />}
            onClick={() => onAddUser(record.roomId)}
          >
            Add User
          </Button>
          <Button
            type="link"
            icon={<UserDeleteOutlined />}
            onClick={() => onRemoveUser(record.roomId)}
          >
            Remove User
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rooms}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalRooms,
        onChange: onPageChange,
      }}
      rowKey="roomId"
    />
  );
};

export default RoomTable;
