import React, { useState, useEffect } from "react";
import { Card, List, Button, notification, Spin } from "antd";
import { getBorrowedBooks, returnBook } from "../services/User";
import { useNavigate } from "react-router-dom";
import CustomPagination from "./Pagination";
import PropTypes from "prop-types";

const BorrowedBooks = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Lấy danh sách sách đang mượn
  const fetchBorrowedBooks = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getBorrowedBooks(page - 1, pageSize);
      setBorrowedBooks(result.content || []);
      setTotalElements(result.totalElements || 0);
      setPageSize(result.pageable.pageSize || 10);
      setCurrentPage(page);
    } catch (error) {
      notification.error({
        message: "Fetch Borrowed Books Failed",
        description: error.message || "Failed to fetch borrowed books.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks(currentPage);
  }, [currentPage]);

  // Xử lý trả sách
  const handleReturnBook = async (bookId) => {
    setLoadingReturn((prev) => ({ ...prev, [bookId]: true }));
    try {
      const result = await returnBook(bookId);
      notification.success({
        message: "Return Success",
        description: `You have successfully returned "${result.book.title}"!`,
      });
      await fetchBorrowedBooks(currentPage);
      if (onRefresh) onRefresh();
    } catch (error) {
      notification.error({
        message: "Return Failed",
        description: error.message || "Failed to return the book.",
      });
    } finally {
      setLoadingReturn((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  return (
    <Card>
      {(() => {
        if (loading) {
          return (
            <div className="loading-spinner">
              <Spin size="large" />
            </div>
          );
        }

        if (borrowedBooks.length === 0) {
          return <p className="empty-message">You have no borrowed books.</p>;
        }

        return (
          <>
            <List
              itemLayout="horizontal"
              dataSource={borrowedBooks}
              renderItem={(borrow) => (
                <List.Item
                  actions={[
                    <Button
                      key="view-details" // Thêm key cho button
                      type="primary"
                      onClick={() => navigate(`/book/${borrow.book.id}`)}
                      size="large"
                    >
                      View Details
                    </Button>,
                    <Button
                      key="return-book" // Thêm key cho button
                      type="danger"
                      onClick={() => handleReturnBook(borrow.book.id)}
                      loading={loadingReturn[borrow.book.id] || false}
                      size="large"
                    >
                      Return Book
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <img
                        src={borrow.book.coverImageUrl}
                        alt={borrow.book.title}
                        className="book-image"
                      />
                    }
                    title={
                      <span className="book-title">{borrow.book.title}</span>
                    }
                    description={
                      <div>
                        <p>
                          <strong>Author:</strong> {borrow.book.author}
                        </p>
                        <p>
                          <strong>Category:</strong> {borrow.book.bookType.name}
                        </p>
                        <p>
                          <strong>Borrow Date:</strong>{" "}
                          {new Date(borrow.borrowDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Due Date:</strong>{" "}
                          {new Date(borrow.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <CustomPagination
              currentPage={currentPage}
              setPage={setCurrentPage}
              totalElements={totalElements}
              pageSize={pageSize}
            />
          </>
        );
      })()}
    </Card>
  );
};

BorrowedBooks.propTypes = {
  onRefresh: PropTypes.func,
};

export default BorrowedBooks;
