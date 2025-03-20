import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordAfterResetPage from "./pages/ChangePasswordAfterResetPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
      <Header onSearch={setSearchTerm} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <ProtectedRoute>
                <VerifyOTPPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password-after-reset"
            element={
              <ProtectedRoute>
                <ChangePasswordAfterResetPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
