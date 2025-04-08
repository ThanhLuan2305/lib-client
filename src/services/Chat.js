import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

// Lấy danh sách tin nhắn private giữa hai user (GET /private/messages)
export const getPrivateMessages = async (senderId, receiverId) => {
	try {
		const response = await api.get(`/chat/private/messages`, {
			params: { senderId, receiverId },
		});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching private messages");
	}
};

// Gửi tin nhắn private (POST /private/send)
export const sendPrivateMessage = async (messageRequest) => {
	try {
		const response = await api.post(`/chat/private/send`, messageRequest);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "sending private message");
	}
};

// Xóa tin nhắn private (DELETE /private/message/{id})
export const deletePrivateMessage = async (id) => {
	try {
		const response = await api.delete(`/chat/private/message/${id}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "deleting private message");
	}
};