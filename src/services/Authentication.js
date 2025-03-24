import { api, removeAuthHeader } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";
import { notification } from "antd";


export const login = async (email, password) => {
	try {
		const response = await api.post("/auth/login", { email, password });
		const { accessToken } = response.data.result;

		if (accessToken) {
			api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			localStorage.setItem("accessToken", accessToken);
			console.log("Access token set:", accessToken);
		}

		notification.success({
			message: "Logged in",
			description: "You have successfully logged in.",
		});

		return response.data.result;
	} catch (error) {
		handleApiError(error, "logging in");
		return error;
	}
};


export const logout = async () => {
	try {
		await api.post("/auth/logout", {});
		removeAuthHeader();
		notification.success({ message: "Logged out", description: "You have successfully logged out." });
	} catch (error) {
		handleApiError(error, "logging out");
		return error;
	}
};

export const refreshToken = async () => {
	try {
		const response = await api.post("/auth/refresh", {});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "refreshing token");
		return error;
	}
};

export const getInfo = async () => {
	try {
		const response = await api.get(`/auth/info`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "get info user");
		return error;
	}
};