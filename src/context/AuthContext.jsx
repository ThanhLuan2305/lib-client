import { createContext, useState, useEffect } from "react";
import {
  login as loginAPI,
  logout as logoutAPI,
} from "../services/Authentication";
import { getInfo } from "../services/User";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setUser(JSON.parse(localStorage.getItem("userProfile")));
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
      const response = await loginAPI(email, password);
      const userInfo = await getInfo();
      setUser(userInfo);
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
      console.log("👋 Đang gọi API logout...");
      await logoutAPI();
      console.log("✅ API logout thành công!");

      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      setUser(null);
    } catch (error) {
      console.error("❌ Lỗi khi logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
