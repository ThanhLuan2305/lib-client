import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { user, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/change-password-after-reset",
  ];

  const userRoutes = ["/", "/book/:id", "/profile", "/history"];

  const isPublicRoute = publicRoutes.includes(location.pathname);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const isUserRoute = userRoutes.some((route) => {
    if (route.includes(":id")) {
      const baseRoute = route.split(":")[0];
      return location.pathname.startsWith(baseRoute);
    }
    return location.pathname === route;
  });

  if (!user) {
    if (isPublicRoute) {
      return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === "ADMIN") {
    if (isUserRoute) {
      notification.error({
        message: "Access Denied",
        description: "Admins are not allowed to access user pages.",
      });
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (!isAdminRoute) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
  } else if (role === "USER") {
    if (isAdminRoute) {
      notification.error({
        message: "Access Denied",
        description: "You do not have permission to access admin pages.",
      });
      return <Navigate to="/" replace />;
    }
    return children;
  }

  return <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
