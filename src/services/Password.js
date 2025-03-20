import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const requestPasswordReset = async (contactInfo, isPhone) => {
	try {
		const response = await api.put(
			`/password/forget-password?contactInfo=${encodeURIComponent(contactInfo)}&isPhone=${isPhone}`
		);
		console.log(response);
		return response.data;
	} catch (error) {
		handleApiError(error, "Request password reset");
		return error;
	}
};

export const resetPassword = async (otp, contactInfo, isPhone) => {
	try {
		const response = await api.put(
			`/password/reset-password?otp=${otp}&contactInfo=${encodeURIComponent(contactInfo)}&isPhone=${isPhone}`
		);
		console.log(response);
		return response.data;
	} catch (error) {
		handleApiError(error, "Reset password");
		return error;
	}
};

export const changePasswordAfterReset = async (email, oldPassword, newPassword, confirmPassword) => {
	try {
		const response = await api.put(
			"/password/change-password-after-reset",
			{
				email,
				oldPassword,
				newPassword,
				confirmPassword,
			}
		);
		console.log("change pass ",response);
		return response.data;
	} catch (error) {
		handleApiError(error, "Reset password");
		return error;
	}
};