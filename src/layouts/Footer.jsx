import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer
      className="text-white text-center py-3 mt-4"
      style={{
        backgroundColor: "#049DD9",
      }}
    >
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} Library Management</p>
        <p className="small">
          Designed with <FontAwesomeIcon icon={faHeart} className="text-danger" /> by{" "}
          <a
            href="https://www.facebook.com/ntl.2305/"
            className="text-light fw-bold"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            Nguyen Thanh Luan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
