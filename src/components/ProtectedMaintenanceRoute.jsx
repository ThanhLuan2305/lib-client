import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedMaintenanceRoute = ({ element }) => {
  const { user } = useAuth();
  const role = user?.role || null;

  const maintenanceMode =
    JSON.parse(localStorage.getItem("maintenanceMode")) || false;
  const fromTime = localStorage.getItem("maintenanceFromTime") || null;

  if (role === "ADMIN") {
    return element;
  }

  if (maintenanceMode) {
    return <Navigate to="/maintenance" state={{ fromTime }} replace />;
  }

  return element;
};

ProtectedMaintenanceRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedMaintenanceRoute;
