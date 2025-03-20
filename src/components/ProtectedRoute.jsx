import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "null");

  return userProfile ? <Navigate to="/" replace /> : children;
};

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
export default ProtectedRoute;
