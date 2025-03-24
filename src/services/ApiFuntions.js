import axios from "axios";
import { logout } from "./Authentication";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequests = [];

const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

const refreshToken = async () => {
  try {
    console.log("🔄 Refreshing token...");
    const response = await api.post("/auth/refresh");
    const newAccessToken = response.data.result.accessToken;
    console.log("✅ Token refreshed:", newAccessToken);
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setUser(null);
    setRole(null);
    await logout();
    console.error("❌ Refresh token failed:", error);
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        code: 9999,
        message: "Lỗi không xác định",
      });
    }

    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshToken();
          isRefreshing = false;

          failedRequests.forEach((callback) => callback(newAccessToken));
          failedRequests = [];

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          failedRequests = [];
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        failedRequests.push((newAccessToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error.response.data);
  }
);

export const removeAuthHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};


export default api;