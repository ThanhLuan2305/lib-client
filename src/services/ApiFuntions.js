import axios from "axios";
import { notification } from "antd";



export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});


let isRefreshing = false;
let failedRequests = [];

const refreshToken = async () => {
  try {
    console.log("🔄 Refreshing token...");
    const response = await axios.post("http://localhost:8080/auth/refresh", {}, { withCredentials: true });

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

    window.location.href = "/login";
    throw error;
  }
};

const skipAuthUrls = ["/auth/refresh", "/auth/login", "/book", "/book/search"];

api.interceptors.request.use(
  function (config) {
    if (!skipAuthUrls.includes(config.url)) {
      const token = localStorage.getItem("accessToken");
      const auth = token ? `Bearer ${token}` : '';
      config.headers["Authorization"] = auth;
    }

    if (!config.headers.Accept && config.headers["Content-Type"]) {
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    
    return config;
  },
  function (error) {
    // Xử lý lỗi request
    return Promise.reject(error);
  }
);

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
      const fromTime = error.response.data?.result?.from || new Date().toISOString();
      window.location.href = "/maintenance";
      localStorage.setItem("maintenanceFromTime", fromTime);
    }
    if (error.response.status === 401 && originalRequest.url.includes("/auth/refresh")) {
      console.error("❌ Refresh token request failed:", error.response.data);
      return Promise.reject(error.response.data);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
