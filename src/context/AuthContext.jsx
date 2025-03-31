import React, { createContext, useState, useEffect, useMemo } from "react";
import { api } from "../services/ApiFuntions";
import {
  login as loginAPI,
  logout as logoutAPI,
} from "../services/Authentication";
import { getInfo } from "../services/User";
import { getRole } from "../services/Common";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const normalizeRole = (role) => {
  return role?.startsWith("ROLE_") ? role.replace("ROLE_", "") : role;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Thêm trạng thái khởi tạo

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("userProfile");
      const storedRole = localStorage.getItem("userRole");
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedRole) {
        setRole(storedRole);
      }

      setIsInitializing(false); // Hoàn tất khởi tạo
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log("🔄 Đang gọi API đăng nhập...");
      const token = await loginAPI(email, password);
      const accessToken = token.accessToken;

      if (accessToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        localStorage.setItem("accessToken", accessToken);
      }

      const roles = await getRole();
      const normalizedRole = roles?.[0] ? normalizeRole(roles[0]) : null;
      setRole(normalizedRole);
      localStorage.setItem("userRole", normalizedRole);

      if (normalizedRole === "USER") {
        const userInfo = await getInfo();
        setUser(userInfo);
        localStorage.setItem("userProfile", JSON.stringify(userInfo));
      } else {
        setUser(null);
        localStorage.removeItem("userProfile");
      }

      console.log("✅ API login thành công!");
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
      localStorage.removeItem("userRole");
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("❌ Lỗi khi logout:", error);
    }
  };

  const contextValue = useMemo(() => {
    return { user, role, login, logout, loading, isInitializing };
  }, [user, role, login, logout, loading, isInitializing]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => React.useContext(AuthContext);
