import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#049DD9", marginBottom: "10px" }}
    >
      <div className="container">
        <a className="navbar-brand fw-bold text-white" href="/">
          <FontAwesomeIcon icon={["fas", "book"]} className="me-2" />
          Library
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form className="d-flex ms-auto me-3 w-50" onSubmit={handleSearch}>
            <input
              className="form-control"
              type="text"
              placeholder="Search books..."
              value={searchInput}
              onChange={handleInputChange}
            />
            {searchInput && (
              <button
                type="button"
                className="btn btn-outline-light ms-2"
                onClick={handleClear}
              >
                <FontAwesomeIcon icon={["fas", "times"]} />
              </button>
            )}
            <button className="btn btn-outline-light ms-2" type="submit">
              <FontAwesomeIcon icon={["fas", "search"]} />
            </button>
          </form>

          <div className="d-flex">
            <button href="#" className="btn btn-outline-light me-2">
              <FontAwesomeIcon
                icon={["fas", "shopping-cart"]}
                className="me-1"
              />
              Cart
            </button>
            <button href="#" className="btn btn-light">
              <FontAwesomeIcon icon={["fas", "user"]} className="me-1" />
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Header;
