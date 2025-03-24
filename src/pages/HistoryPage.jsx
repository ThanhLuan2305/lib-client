import React, { useEffect, useState } from "react";
import { Tabs, notification } from "antd";
import { useNavigate } from "react-router-dom";
import BorrowedBooks from "../components/BorrowedBooks";
import ReturnedBooks from "../components/ReturnedBooks";
import "../styles/historyPage.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // State để làm mới tab "Returned Books"

  // Kiểm tra đăng nhập khi trang được tải
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) {
      notification.warning({
        message: "Login Required",
        description: "Please log in to view your borrowing history.",
      });
      navigate("/login");
    }
  }, [navigate]);

  // Hàm làm mới tab "Returned Books" khi trả sách thành công
  const handleRefreshReturnedBooks = () => {
    setRefreshKey((prev) => prev + 1); // Tăng refreshKey để làm mới tab "Returned Books"
  };

  // Định nghĩa các tab bằng thuộc tính items
  const tabItems = [
    {
      key: "borrowed",
      label: "Borrowed Books",
      children: <BorrowedBooks onRefresh={handleRefreshReturnedBooks} />,
    },
    {
      key: "returned",
      label: "Returned Books",
      children: <ReturnedBooks refreshKey={refreshKey} />,
    },
  ];

  return (
    <div className="history-page-container">
      <h2 className="history-title">Borrowing History</h2>
      <Tabs defaultActiveKey="borrowed" type="card" items={tabItems} />
    </div>
  );
};

export default HistoryPage;
