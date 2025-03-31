import { api, removeAuthHeader } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";
import { notification } from "antd";


export const login = async (email, password) => {
	try {
		const response = await api.post("/auth/login", { email, password });

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
		//notification.success({ message: "Logged out", description: "You have successfully logged out." });
	} catch (error) {
		handleApiError(error, "logging out");
		return error;
	}
};