import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const getInfo = async () => {
  try {
    const response = await api.get(`/user/users/info`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "get info user");
    return error;
  }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    const response = await api.put(
      `/user/users/change-password`,
      {
        oldPassword,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "change password");
    return error;
  }
};

export const changeEmail = async (oldEmail, newEmail) => {
  try {
    const response = await api.put(
      `/user/users/change-mail`,
      {
        oldEmail,
        newEmail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "change email");
    return error;
  }
};

export const verifyChangeEmail = async (oldEmail, newEmail, otp) => {
  try {
    const response = await api.put(
      `/user/users/verify-change-mail`,
      {
        oldEmail,
        newEmail,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "verify change email");
    return error;
  }
};

export const changePhone = async (oldPhoneNumber, newPhoneNumber) => {
  try {
    const response = await api.put(
      `/user/users/change-phone`,
      {
        oldPhoneNumber,
        newPhoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "change phone");
    return error;
  }
};

export const verifyChangePhone = async (oldPhoneNumber, newPhoneNumber, otp) => {
  try {
    const response = await api.put(
      `/user/users/verify-change-phone`,
      {
        oldPhoneNumber,
        newPhoneNumber,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "verify change phone");
    return error;
  }
};