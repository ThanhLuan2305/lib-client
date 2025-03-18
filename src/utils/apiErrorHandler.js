import { notification } from "antd";
import { getErrorMessage } from "./errorMapping";

export const handleApiError = (error, action) => {
  const errorMessage = getErrorMessage(error.code) || "An unknown error occurred";
  notification.error({
    message: `Error ${action}`,
    description: errorMessage,
  });
  throw new Error(errorMessage);
};
