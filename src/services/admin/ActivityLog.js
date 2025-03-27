import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

export const getActivityLogs = async (offset = 0, limit = 10) => {
  try {
    const response = await api.get(`/admin/activity-log?offset=${offset}&limit=${limit}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching activity logs");
    throw error;
  }
};

export const getActivityLog = async (id) => {
  try {
    const response = await api.get(`/admin/activity-log/${id}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching activity log");
    throw error;
  }
};

export const deleteActivityLog = async () => {
  try {
    const response = await api.delete("/admin/activity-log");
    return response.data.result;
  } catch (error) {
    handleApiError(error, "deleting activity log");
    throw error;
  }
};