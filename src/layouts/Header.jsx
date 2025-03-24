import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Dropdown, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/header.css";
import "antd/dist/reset.css";

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => setSearchInput(e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };
  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items với icon và style đẹp hơn
  const menuItems = [
    {
      key: "1",
      label: (
        <Link to="/profile" className="dropdown-item">
          <FontAwesomeIcon icon={["fas", "user"]} className="menu-icon" />
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/history" className="dropdown-item">
          <FontAwesomeIcon icon={["fas", "history"]} className="menu-icon" />
          History
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <button onClick={handleLogout} className="dropdown-button">
          <FontAwesomeIcon
            icon={["fas", "sign-out-alt"]}
            className="menu-icon"
          />
          Logout
        </button>
      ),
    },
  ];

  return (
    <nav className="navbar navbar-expand-lg header">
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

          <div className="d-flex align-items-center">

            {user ? (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Avatar className="user-avatar" size={40}>
                  {user.fullName ? user.fullName[0] : "U"}
                </Avatar>
              </Dropdown>
            ) : (
              <Link to="/login" className="btn btn-light">
                Sign In
              </Link>
            )}
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
