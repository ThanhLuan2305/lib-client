import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const MaintenanceGuard = ({ children, maintenanceMode, pathname }) => {
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname.startsWith("/admin");

  if (
    maintenanceMode &&
    pathname !== "/maintenance" &&
    !isLoginPage &&
    !isAdminPage
  ) {
    return <Navigate to="/maintenance" replace />;
  }
  return children;
};

MaintenanceGuard.propTypes = {
  children: PropTypes.node.isRequired,
  maintenanceMode: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
};

export default MaintenanceGuard;
