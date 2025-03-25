import React, { useContext } from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import "../styles/adminHeader.css";

const { Header } = Layout;

const AdminHeader = () => {
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };

  return (
    <Header className="admin-header">
      <h1 className="admin-header-title">Admin Manage</h1>
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="admin-header-logout-btn"
      >
        Logout
      </Button>
    </Header>
  );
};

export default AdminHeader;
