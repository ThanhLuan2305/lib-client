import React from "react";
import { Table, Button, Popconfirm, Space, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "../../styles/bookTable.css";

const BookTable = ({ books, onView, onEdit, onDelete, loading }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Book Type",
      dataIndex: "bookType",
      key: "bookType",
      width: 150,
      render: (bookType) => bookType?.name || "N/A",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      width: 150,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Max Borrow Days",
      dataIndex: "maxBorrowDays",
      key: "maxBorrowDays",
      width: 150,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Deleted",
      dataIndex: "deleted",
      key: "deleted",
      width: 100,
      render: (deleted) => (
        <Tag color={deleted ? "red" : "green"}>{deleted ? "Yes" : "No"}</Tag>
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
            title="Are you sure to delete this book?"
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
      className="book-table"
      columns={columns}
      dataSource={books}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

BookTable.propTypes = {
  books: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BookTable;