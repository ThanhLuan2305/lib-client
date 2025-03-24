import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/bookCard.css";
import { Button, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { borrowBook } from "../services/User";
import PropTypes from "prop-types";
import {
  faPenNib,
  faBook,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

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
      const result = await borrowBook(book.id);
      notification.success({
        message: "Borrow Success",
        description: `You have successfully borrowed "${result.book.title}"!`,
      });
    } catch (error) {
      console.error("Failed to borrow book:", error);
    }
  };
  return (
    <div>
      <a
        className="card shadow-sm border-0 rounded p-2 m-2 text-center book-card"
        style={{ width: "21rem", minHeight: "450px", textDecoration: "none" }}
        href={`/book/${book.id}`}
      >
        <div className="book-card-img">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="card-img-top rounded"
          />
        </div>

        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title fw-bold book-title">{book.title}</h5>
            <p className="card-text text-muted m-0">
              <FontAwesomeIcon icon={faPenNib} className="me-1" /> {book.author}
            </p>
            <p className="card-text text-primary">
              <FontAwesomeIcon icon={faBook} className="me-1" />{" "}
              {book.bookType.name}
            </p>
          </div>

          <p
            className={`card-text fw-bold ${
              book.stock > 0 ? "text-success" : "text-danger"
            }`}
          >
            <FontAwesomeIcon
              icon={book.stock > 0 ? faCheckCircle : faTimesCircle}
              className="me-1"
            />
            {book.stock > 0 ? ` Available: ${book.stock}` : " Out of Stock"}
          </p>
        </div>
      </a>
      <Button
        type="primary"
        block
        disabled={book.stock <= 0}
        onClick={handleBorrow}
        style={{ marginTop: "10px" }}
      >
        Borrow Book
      </Button>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
};

export default BookCard;
