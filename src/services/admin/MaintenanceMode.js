import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

export const setMaintenanceMode = async (status) => {
  try {
    const response = await api.post(`/admin/config/maintenance/${status}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "setting maintenance mode");
  }
};

export const getMaintenanceMode = async () => {
  try {
    const response = await api.get("/admin/config/maintenance/status");
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching maintenance mode status");
  }
};