import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

// Hàm lấy danh sách activity log
export const getActivityLog = async (page = 0, size = 10) => {
	try {
	  const response = await api.get(`/admin/activity-log?ofset=${page}&limit=${size}`);
	  return response.data.result;
	} catch (error) {
	  handleApiError(error, "fetching activity log");
	}
  };

// Hàm xóa activity log
export const deleteActivityLog = async () => {
  try {
    const response = await api.delete("/admin/activity-log");
    return response.data.result;
  } catch (error) {
    handleApiError(error, "deleting activity log");
  }
};