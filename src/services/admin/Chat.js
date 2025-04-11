import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

// Lấy danh sách tin nhắn private giữa hai user (GET /private/messages)
export const getPrivateMessages = async (senderId, receiverId) => {
	try {
		const response = await api.get(`/admin/chat/private/messages`, {
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
		const response = await api.post(`/admin/chat/private/send`, messageRequest);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "sending private message");
	}
};

export const getUsersChattingWithAdmin = async () => {
	try {
		const response = await api.get(`/admin/chat/private/all`);
		const messagesByUser = response.data.result || {};

		const userIds = Object.keys(messagesByUser)
			.filter((userId) => messagesByUser[userId].length > 0)
			.map((userId) => parseInt(userId))

		return userIds;
	} catch (error) {
		handleApiError(error, "fetching users chatting with admin");
		throw error;
	}
};

export const createTopic = async (topicName, description) => {
	try {
		const response = await api.post("/admin/chat/topics/create", null, {
			params: {
				topicName,
				description // Optional, will be sent if provided
			}
		});
		return response.data; // Returns the ApiResponse with the success message
	} catch (error) {
		handleApiError(error, "creating a new topic");
		throw error;
	}
};

export const getAllTopics = async () => {
	try {
		const response = await api.get("/admin/chat/topics");
		return response.data.result; // Returns the list of TopicResponse objects
	} catch (error) {
		handleApiError(error, "fetching all topics");
		throw error;
	}
};