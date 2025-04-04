import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const requestPasswordReset = async (email) => {
	try {
		const response = await api.put(`/password/forget-password?email=${encodeURIComponent(email)}`);
		return response.data;
	} catch (error) {
		handleApiError(error, "Request password reset");
		throw error;
	}
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
	try {
		const response = await api.put(`/password/reset-password`, {
			token,
			newPassword,
			confirmPassword,
		});
		return response.data;
	} catch (error) {
		handleApiError(error, "Reset password");
		throw error;
	}
};