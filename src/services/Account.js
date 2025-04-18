import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const register = async (email, phoneNumber, password, fullName, birthDate) => {
	try {
		const response = await api.post("/account/register", {
			email,
			phoneNumber,
			password,
			fullName,
			birthDate,
		});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "registering");
		return error;
	}
};

export const verifyPhone = async (otp, phone) => {
	try {
		const response = await api.post(`/account/verify-phone?otp=${otp}&phone=${phone}`);
		return response.data;
	} catch (error) {
		handleApiError(error, "verifying phone");
		return error;
	}
};

export const verifyEmail = async (otp, email) => {
	try {
		const response = await api.get(`/account/verify-email?otp=${otp}&email=${email}`);
		return response.data;
	} catch (error) {
		handleApiError(error, "verifying email");
		return error;
	}
};
