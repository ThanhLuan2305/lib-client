import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBookById } from "../services/Common";
import { borrowBook } from "../services/User";
import { Button, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../styles/bookDetail.css";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBook = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchBookById(id);
      setBook(data || null);
    } catch (err) {
      console.error("Error fetching book:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  const handleBorrow = async () => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) {
      notification.warning({
        message: "Login Required",
        description: "Please log in to borrow this book.",
      });
      navigate("/login");
      return;
    }

    try {
      const result = await borrowBook(id);
      notification.success({
        message: "Borrow Success",
        description: `You have successfully borrowed "${result.book.title}"!`,
      });
      await getBook();
    } catch (error) {
      console.error("Failed to borrow book:", error);
      notification.error({
        message: "Borrow Failed",
        description: error.message || "Failed to borrow the book.",
      });
    }
  };

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;
  if (error) return <h2 className="text-center text-danger mt-5">{error}</h2>;
  if (!book)
    return <h2 className="text-center text-danger mt-5">Book not found!</h2>;

  return (
    <div className="book-detail-container">
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        size="large"
        className="back-button mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="book-detail-card">
        <div className="row">
          <div className="col-md-5 book-cover">
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-7 book-info">
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Category:</strong> {book.bookType.name}
            </p>
            <p>
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p>
              <strong>Published Date:</strong>{" "}
              {new Date(book.publishedDate).toDateString()}
            </p>
            <p>
              <strong>Location:</strong> {book.location}
            </p>
            <p>
              <strong>Max Borrow Days:</strong> {book.maxBorrowDays} days
            </p>
            <p
              className={`availability ${
                book.stock > 0 ? "text-success" : "text-danger"
              }`}
            >
              {book.stock > 0 ? `Available: ${book.stock}` : "Out of Stock"}
            </p>

            <Button
              type="primary"
              size="large"
              disabled={book.stock <= 0}
              onClick={handleBorrow}
              style={{ marginTop: "20px" }}
            >
              Borrow Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
