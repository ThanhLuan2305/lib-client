import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

// Lấy danh sách người dùng (GET /admin/users)
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/admin/users?offset=${page - 1}&limit=${limit}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching users");
  }
};

// Tìm kiếm người dùng (GET /admin/users/search)
export const searchUsers = async (criteria, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page: page - 1,
    size: limit,
  });

  // Thêm các tiêu chí tìm kiếm vào query params
  if (criteria.email) queryParams.append("email.contains", criteria.email);
  if (criteria.phoneNumber) queryParams.append("phoneNumber.contains", criteria.phoneNumber);
  if (criteria.birthDateFrom) queryParams.append("birthDate.greaterThanOrEqual", criteria.birthDateFrom);
  if (criteria.birthDateTo) queryParams.append("birthDate.lessThanOrEqual", criteria.birthDateTo);

  try {
    const response = await api.get(`/admin/users/search?${queryParams.toString()}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "searching users");
  }
};

// Lấy thông tin một người dùng (GET /admin/users/{userId})
export const getUser = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching user details");
  }
};

// Tạo người dùng mới (POST /admin/users)
export const createUser = async (userData) => {
  try {
    const response = await api.post("/admin/users", userData);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "creating user");
  }
};

// Cập nhật người dùng (PUT /admin/users/{id})
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "updating user");
  }
};

// Xóa người dùng (DELETE /admin/users/{id})
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "deleting user");
  }
};