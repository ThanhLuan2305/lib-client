import React, { useState, useEffect } from "react";
import { filterBook, searchBook, fetchBooks } from "../services/Common";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import CustomCarousel from "../components/Carousel";
import Pagination from "../components/Pagination";
import BookFilter from "../components/BookFilter";
import PropTypes from "prop-types";
import { MessageOutlined } from "@ant-design/icons";
import "../styles/home.css";

const HomePage = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, [page, searchTerm, filters]);

  const loadBooks = async () => {
    setError("");
    try {
      let data;
      if (searchTerm) {
        data = await searchBook(page, pageSize, searchTerm);
      } else if (Object.keys(filters).length > 0) {
        data = await filterBook(page, pageSize, filters);
      } else {
        data = await fetchBooks(page, pageSize);
      }

      if (data) {
        setBooks(data.content);
        setTotalElements(data.totalElements);
      } else {
        setBooks([]);
        setTotalElements(0);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Callback để cập nhật stock sau khi mượn thành công
  const handleBorrowSuccess = (bookId, newStock) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, stock: newStock } : book
      )
    );
  };

  const handleOpenChat = () => {
    navigate("/chat");
  };

  return (
    <div className="container mt-4 text-center">
      <CustomCarousel />
      <h2 className="mb-4 display-4 fw-bold text-primary text-uppercase mt-4">
        Library Books
      </h2>

      <BookFilter setFilters={setFilters} />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row d-flex flex-wrap justify-content-center">
        {books.map((book) => (
          <div
            className="col-md-4 d-flex justify-content-center book-card-container"
            key={book.id}
          >
            <BookCard book={book} onBorrowSuccess={handleBorrowSuccess} />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={page}
          setPage={setPage}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      </div>

      <button className="chat-button" onClick={handleOpenChat}>
        <MessageOutlined style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
};

HomePage.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

export default HomePage;
