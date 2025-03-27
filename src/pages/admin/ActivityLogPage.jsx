import React, { useState, useEffect } from "react";
import { message } from "antd";
import AdminActivityLog from "../../components/admin/AdminActivityLog";
import {
  getActivityLogs,
  deleteActivityLog,
} from "../../services/admin/ActivityLog";

const ActivityLogPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Cho phép thay đổi pageSize

  const fetchActivityLog = async (offset = 0, limit = pageSize) => {
    setLoading(true);
    try {
      const result = await getActivityLogs(offset, limit);
      console.log("API Response:", result); // Debug dữ liệu trả về
      setActivities(result.content || []);
      setTotalElements(result.totalElements || 0);
      setCurrentPage(offset / limit + 1); // Đồng bộ currentPage với offset
    } catch (error) {
      message.error("Failed to load activity logs");
      setActivities([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await deleteActivityLog();
      message.success("All activity logs deleted successfully");
      fetchActivityLog(0, pageSize);
    } catch (error) {
      message.error("Failed to delete activity logs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, size) => {
    const newPageSize = size || pageSize;
    const offset = (page - 1); // Tính offset từ page
    setCurrentPage(page);
    setPageSize(newPageSize);
    fetchActivityLog(offset, newPageSize);
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
