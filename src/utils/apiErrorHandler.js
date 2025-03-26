import { notification } from "antd";
import { getErrorMessage } from "./errorMapping";

export const handleApiError = (error, action) => {
  const errorMessage = getErrorMessage(error);
  notification.error({
    message: `Error ${action}`,
    description: errorMessage,
  });
  throw error;
};
