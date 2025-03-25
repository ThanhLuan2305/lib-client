import React from "react";
import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Image } from "antd";
import dayjs from "dayjs";
import "../../styles/bookViewModal.css";

const BookViewModal = ({ open, onCancel, book }) => {
  if (!book) return null;

  return (
    <Modal
      className="book-view-modal mt-5"
      title="Book Details"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      getContainer={() => document.body}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{book.id}</Descriptions.Item>
        <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
        <Descriptions.Item label="Title">{book.title}</Descriptions.Item>
        <Descriptions.Item label="Author">{book.author}</Descriptions.Item>
        <Descriptions.Item label="Book Type">{book.bookType?.name || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Stock">{book.stock}</Descriptions.Item>
        <Descriptions.Item label="Publisher">{book.publisher}</Descriptions.Item>
        <Descriptions.Item label="Published Date">
          {book.publishedDate ? dayjs(book.publishedDate).format("DD/MM/YYYY") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Max Borrow Days">{book.maxBorrowDays}</Descriptions.Item>
        <Descriptions.Item label="Location">{book.location}</Descriptions.Item>
        <Descriptions.Item label="Cover Image">
          {book.coverImageUrl ? (
            <Image src={book.coverImageUrl} alt="Cover Image" width={200} />
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Deleted">
          <Tag color={book.deleted ? "red" : "green"}>{book.deleted ? "Yes" : "No"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {book.createdAt ? dayjs(book.createdAt).format("DD/MM/YYYY HH:mm:ss") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {book.updatedAt ? dayjs(book.updatedAt).format("DD/MM/YYYY HH:mm:ss") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">{book.createdBy || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Updated By">{book.updatedBy || "N/A"}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

BookViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  book: PropTypes.object,
};

export default BookViewModal;