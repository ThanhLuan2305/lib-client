import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

export const getUsersChattingWithAdmin = async () => {
	try {
		const response = await api.get(`/admin/chat/private/admin/all`);
		const messagesByUser = response.data.result || {};

		const userIds = Object.keys(messagesByUser)
			.filter((userId) => messagesByUser[userId].length > 0)
			.map((userId) => parseInt(userId))

		return userIds;
	} catch (error) {
		handleApiError(error, "fetching users chatting with admin");
		throw error; // Ném lỗi để component xử lý
	}
};