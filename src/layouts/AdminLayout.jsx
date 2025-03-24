import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="admin-layout" style={{ display: "flex" }}>
      <AdminSidebar />

      {/* Nội dung chính bên phải */}
      <div
        style={{
          marginLeft: 200, // Khoảng cách để không bị che bởi sidebar (bằng chiều rộng của sidebar)
          padding: "20px",
          width: "100%",
          minHeight: "100vh", // Đảm bảo nội dung chiếm toàn bộ chiều cao
        }}
      >
        <Outlet /> {/* Render các trang con của ADMIN */}
      </div>
    </div>
  );
};

export default AdminLayout;