import { api, removeAuthHeader } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

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
	} catch (error) {
		handleApiError(error, "logging out");
		return error;
	}
};