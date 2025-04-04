import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BookDetailPage from "../pages/BookDetailPage";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import AdminLayout from "../layouts/AdminLayout.jsx";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyOTPPage from "../pages/VerifyOTPPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import HistoryPage from "../pages/HistoryPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminBookPage from "../pages/admin/AdminBookPage";
import MaintenanceModePage from "../pages/admin/MaintenanceModePage";
import ActivityLogPage from "../pages/admin/ActivityLogPage";
import ProtectedRoute from "./ProtectedRoute";
import MaintenanceMode from "../pages/MaintenanceMode";
import MaintenanceGuard from "./MaintenanceGuard";
import PropTypes from "prop-types";

const AppContent = ({ searchTerm, setSearchTerm, maintenanceMode, pathname }) => {
  return (
    <>
      {maintenanceMode &&
      pathname !== "/maintenance" &&
      pathname !== "/login" &&
      !pathname.startsWith("/admin") ? (
        <Navigate to="/maintenance" replace />
      ) : (
        <Routes>
          {/* Route cho user */}
          <Route
            element={
              <MaintenanceGuard maintenanceMode={maintenanceMode} pathname={pathname}>
                <>
                  <Header onSearch={setSearchTerm} />
                  <main className="container">
                    <Outlet />
                  </main>
                  <Footer />
                </>
              </MaintenanceGuard>
            }
          >
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />}
            />
          </Route>

          {/* Route cho admin */}
          <Route
            element={
              <MaintenanceGuard maintenanceMode={maintenanceMode} pathname={pathname}>
                <AdminLayout />
              </MaintenanceGuard>
            }
          >
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

          {/* Route cho trang maintenance */}
          <Route path="/maintenance" element={<MaintenanceMode />} />
        </Routes>
      )}
    </>
  );
};

AppContent.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  maintenanceMode: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
};

export default AppContent;