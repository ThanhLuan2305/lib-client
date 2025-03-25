import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom"; // Thêm useLocation
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordAfterResetPage from "./pages/ChangePasswordAfterResetPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminBookPage from "./pages/admin/AdminBookPage";
import MaintenanceModePage from "./pages/admin/MaintenanceModePage";
import ActivityLogPage from "./pages/admin/ActivityLogPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceMode from "./pages/MaintenanceMode";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
      <Routes>
        <Route
          element={
            <>
              <Header onSearch={setSearchTerm} />
              <main className="container">
                <Outlet />
              </main>
              <Footer />
            </>
          }
        >
          {/* Các route cho USER */}
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Các route không yêu cầu đăng nhập */}
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
        </Route>

        {/* Các route cho ADMIN (sử dụng AdminLayout, không có Header, <main>, và Footer) */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute>
                <AdminBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-log"
            element={
              <ProtectedRoute>
                <ActivityLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintenance-mode"
            element={
              <ProtectedRoute>
                <MaintenanceModePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/maintenance" element={<MaintenanceMode />} />
      </Routes>
    </AuthProvider>
  );
}
export default App;
