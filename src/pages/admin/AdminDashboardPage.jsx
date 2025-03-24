import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h2>Admin Dashboard</h2>
      <Button type="primary" onClick={() => navigate("/admin/users")}>
        Manage Users
      </Button>
    </Card>
  );
};

export default AdminDashboardPage;