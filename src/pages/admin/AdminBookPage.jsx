import React, { useState, useEffect } from "react";
import { Button, Pagination, Space, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import BookTable from "../../components/admin/BookTable";
import BookSearch from "../../components/admin/BookSearch";
import BookModal from "../../components/admin/BookModal";
import BookViewModal from "../../components/admin/BookViewModal";
import {
  getBooks,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
  getBook,
  importBooks,
} from "../../services/admin/Book";
import "../../styles/AdminBooksPage.css";

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    loadBooks();
  }, [page, searchCriteria]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      let data;
      const hasCriteria = Object.values(searchCriteria).some((value) => value);
      if (hasCriteria) {
        data = await searchBooks(searchCriteria, page, pageSize);
      } else {
        data = await getBooks(page, pageSize);
      }
      setBooks(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      setBooks([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setPage(1);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleViewBook = async (book) => {
    try {
      const bookDetails = await getBook(book.id);
      setSelectedBook(bookDetails);
      setViewModalVisible(true);
    } catch (error) {
      // Lỗi đã được xử lý trong service
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      loadBooks();
      message.success("Book delete successfully");
    } catch (error) {
      // Lỗi đã được xử lý trong service
    }
  };

  const handleModalOk = async (values) => {
    try {
      if (isEdit) {
        await updateBook(selectedBook.id, values);
        message.success("Book updated successfully");
      } else {
        console.log("Value create: ", values);
        await createBook(values);
        message.success("Book created successfully");
      }
      setModalVisible(false);
      loadBooks();
    } catch (error) {
      console.error("error ok modal", error.message);
    }
  };

  const handleImportBooks = async (file) => {
    try {
      await importBooks(file);
      message.success("Books imported successfully");
      loadBooks();
    } catch (error) {
      console.error("error import book", error.message);
    }
    return false; // Ngăn upload mặc định
  };

  return (
    <div className="admin-books-page">
      <h1>Manage Books</h1>
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBook}
          >
            Add Book
          </Button>
          <Upload
            beforeUpload={handleImportBooks}
            accept=".csv"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Import Books</Button>
          </Upload>
        </Space>
        <BookSearch onSearch={handleSearch} />
      </Space>
      <BookTable
        books={books}
        onView={handleViewBook}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        loading={loading}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalElements}
        onChange={(newPage) => setPage(newPage)}
        style={{ marginTop: "20px", textAlign: "right" }}
      />
      <BookModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        initialValues={selectedBook}
        isEdit={isEdit}
      />
      <BookViewModal
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default AdminBooksPage;
