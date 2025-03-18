import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div id="root">
      <Header onSearch={setSearchTerm} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
