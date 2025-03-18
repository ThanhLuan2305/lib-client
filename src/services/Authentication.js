import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";
import { notification } from "antd";
import Cookies from "js-cookie";


export const login = async (email, password) => {
	try {
	  const response = await api.post("/auth/login", { email, password });
		return response.data.result;
	} catch (error) {
		console.log(error);
	  handleApiError(error, "logging in");
	}
  };
  
  export const logout = async () => {
	try {
	  const token = Cookies.get("accessToken");
	  if (!token) throw new Error("No access token found");
	  await api.post("/auth/logout", { token });
	  notification.success({ message: "Logged out", description: "You have successfully logged out." });
	} catch (error) {
	  handleApiError(error, "logging out");
	}
  };
  
  export const refreshToken = async () => {
	try {
	  const refreshToken = Cookies.get("refreshToken");
	  if (!refreshToken) throw new Error("No refresh token found");
	  const response = await api.post("/auth/refresh", { token: refreshToken });
	  return response.data.result;
	} catch (error) {
	  handleApiError(error, "refreshing token");
	}
  };
  
  