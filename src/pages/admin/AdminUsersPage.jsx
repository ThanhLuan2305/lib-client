import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h2>Manage Users</h2>
      <Button type="primary" onClick={() => navigate("/admin/dashboard")}>
        Back to Dashboard
      </Button>
    </Card>
  );
};

export default AdminUsersPage;
