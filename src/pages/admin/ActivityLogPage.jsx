import React, { useState, useEffect } from "react";
import { message } from "antd";
import AdminActivityLog from "../../components/admin/AdminActivityLog";
import {
  getActivityLog,
  deleteActivityLog,
} from "../../services/admin/ActivityLog";

const ActivityLogPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Dùng 1-based cho CustomPagination
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10); // Có thể thêm state để thay đổi pageSize nếu cần

  const fetchActivityLog = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const result = await getActivityLog(page, size);
      setActivities(result.content || []);
      setTotalElements(result.totalElements);
      setCurrentPage(page + 1); // Chuyển từ 0-based (API) sang 1-based (Pagination)
    } catch (error) {
      message.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await deleteActivityLog();
      message.success("All activity logs deleted successfully");
      fetchActivityLog(0, pageSize); // Tải lại trang đầu tiên
    } catch (error) {
      message.error("Failed to delete activity logs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchActivityLog(page - 1, pageSize); // Chuyển sang 0-based cho API
  };

  useEffect(() => {
    fetchActivityLog(0, pageSize);
  }, []);

  return (
    <div>
      <h1>Activity Log</h1>
      <AdminActivityLog
        activities={activities}
        loading={loading}
        onDeleteAll={handleDeleteAll}
        currentPage={currentPage}
        setPage={handlePageChange}
        totalElements={totalElements}
        pageSize={pageSize}
      />
    </div>
  );
};

export default ActivityLogPage;
