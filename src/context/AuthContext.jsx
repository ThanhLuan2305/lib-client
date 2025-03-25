import React, { createContext, useState, useEffect, useMemo } from "react";
import { removeAuthHeader } from "../services/ApiFuntions";
import {
  login as loginAPI,
  logout as logoutAPI,
  getInfo,
} from "../services/Authentication";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Lấy role từ storedUser
      const userRole = parsedUser?.roles?.[0]?.name || null;
      setRole(userRole);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("userProfile"));
      setUser(storedUser);
      const userRole = storedUser?.roles?.[0]?.name || null;
      setRole(userRole);
    } catch (error) {
      console.error("⚠️ Lỗi khi lấy thông tin user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log("🔄 Đang gọi API đăng nhập...");
      const token = await loginAPI(email, password);
      localStorage.setItem("accessToken", JSON.stringify(token.accessToken));
      const userInfo = await getInfo();
      setUser(userInfo);
      const userRole = userInfo?.roles?.[0]?.name || null;
      setRole(userRole);
      localStorage.setItem("userProfile", JSON.stringify(userInfo));
      console.log("✅ API login thành công!");
      await fetchUserProfile();
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
      setUser(null);removeAuthHeader();
      setRole(null);
      removeAuthHeader();
    } catch (error) {
      console.error("❌ Lỗi khi logout:", error);
    }
  };

  const contextValue = useMemo(() => {
    return { user, role, login, logout, loading };
  }, [user, role, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => React.useContext(AuthContext);