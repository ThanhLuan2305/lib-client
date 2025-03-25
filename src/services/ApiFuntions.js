import axios from "axios";
import { notification } from "antd";



export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});

let accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

let isRefreshing = false;
let failedRequests = [];

const refreshToken = async () => {
  try {
    console.log("🔄 Refreshing token...");
    const response = await api.post("/auth/refresh", {}, { withCredentials: true });

    if (!response.data?.result?.accessToken) {
      throw new Error("No new access token received!");
    }

    const newAccessToken = response.data.result.accessToken;
    console.log("✅ Token refreshed:", newAccessToken);

    localStorage.setItem("accessToken", newAccessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("❌ Refresh token failed:", error.response?.data || error.message);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    removeAuthHeader();

    notification.error({
      message: "Session Expired",
      description: "Your session has expired. Please log in again.",
    });


    throw error;
  }
};

api.interceptors.request.use(function (config) {
  if (config.url !== "/auth/refresh") {
      const token = localStorage.getItem("accessToken");
      const auth = token ? `Bearer ${token}` : '';
      config.headers["Authorization"] = auth;
  }
  if (!config.headers.Accept && config.headers["Content-Type"]) {
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Interceptor xử lý lỗi và refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("❌ Network error:", error);
      return Promise.reject({ code: 9999, message: "Lỗi không xác định" });
    }

    const originalRequest = error.config;
    if (error.response?.status === 503) {
      // Chuyển hướng đến trang Maintenance Mode
      const fromTime = error.response.data?.result?.from || new Date().toISOString();
      window.location.href = "/maintenance";
      localStorage.setItem("maintenanceFromTime", fromTime);
    }
    // Nếu request /auth/refresh bị lỗi, không thử lại
    if (error.response.status === 401 && originalRequest.url.includes("/auth/refresh")) {
      console.error("❌ Refresh token request failed:", error.response.data);
      return Promise.reject(error.response.data);
    }
    // Nếu token hết hạn (401 Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request đã thử refresh

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
          console.error("❌ Failed to refresh token:", refreshError);
          window.location.href = "/login";
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

    console.error("❌ API error:", error.response.data);
    return Promise.reject(error.response.data);
  }
);

// Hàm xóa Authorization header
export const removeAuthHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
