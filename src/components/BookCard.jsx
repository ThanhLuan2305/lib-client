import React from "react";
import "../styles/bookCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {
  faPenNib,
  faBook,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const BookCard = ({ book }) => {
  return (
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
  );
};

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
};

export default BookCard;
