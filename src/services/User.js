import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const getInfo = async () => {
  try {
    const response = await api.get(`user/users/info`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "get info user");
    return error;
  }
};
// Thay đổi mật khẩu
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

// Thay đổi email (gửi OTP)
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

// Xác thực OTP để thay đổi email
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

// Thay đổi số điện thoại (gửi OTP)
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

// Xác thực OTP để thay đổi số điện thoại
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

// Mượn sách
export const borrowBook = async (bookId) => {
  try {
    const response = await api.post(`/user/books/borrow/${bookId}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "borrow book");
    throw error.response?.data || { message: "Failed to borrow book" };
  }
};

// Lấy danh sách sách đang mượn
export const getBorrowedBooks = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/user/books/books-borrow`, {
      params: {
        page,
        size,
      },
    });
    return response.data.result;
  } catch (error) {
    handleApiError(error, "get borrowed books");
    throw error.response?.data || { message: "Failed to get borrowed books" };
  }
};

// Trả sách
export const returnBook = async (bookId) => {
  try {
    const response = await api.post(`/user/books/return/${bookId}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "return book");
    throw error.response?.data || { message: "Failed to return book" };
  }
};

// Lấy danh sách sách đã trả
export const getReturnedBooks = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/user/books/books-return`, {
      params: {
        page,
        size,
      },
    });
    return response.data.result;
  } catch (error) {
    handleApiError(error, "get returned books");
    throw error.response?.data || { message: "Failed to get returned books" };
  }
};