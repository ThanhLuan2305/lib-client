import React, { useState, useEffect } from "react";
import { Card, List, Button, notification, Spin } from "antd";
import { getReturnedBooks } from "../services/User";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CustomPagination from "./Pagination";

const ReturnedBooks = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchReturnedBooks = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getReturnedBooks(page - 1, pageSize);
      setReturnedBooks(result.content || []);
      setTotalElements(result.totalElements || 0);
      setPageSize(result.pageable.pageSize || 10);
      setCurrentPage(page);
    } catch (error) {
      notification.error({
        message: "Fetch Returned Books Failed",
        description: error.message || "Failed to fetch returned books.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedBooks(currentPage);
  }, [refreshKey, currentPage]);

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

        if (returnedBooks.length === 0) {
          return <p className="empty-message">You have no returned books.</p>;
        }

        return (
          <>
            <List
              itemLayout="horizontal"
              dataSource={returnedBooks}
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
                          <strong>Return Date:</strong>{" "}
                          {new Date(borrow.returnDate).toLocaleDateString()}
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

ReturnedBooks.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

export default ReturnedBooks;
