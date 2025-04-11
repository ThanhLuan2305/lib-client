import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

// Lấy danh sách tin nhắn private giữa hai user (GET /private/messages)
export const getPrivateMessages = async (senderId, receiverId) => {
	try {
		const response = await api.get(`/user/chat/private/messages`, {
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
		const response = await api.post(`/user/chat/private/send`, messageRequest);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "sending private message");
	}
};


export const subscribeToTopic = async (topic) => {
	try {
		const response = await api.post(`/user/chat/topics/subscribe`, null, {
			params: { topic },
		});
		return response.data;
	} catch (error) {
		handleApiError(error, "subscribing to topic");
		throw error;
	}
};

// Unsubscribe from topic (POST /chat/topics/unsubscribe)
export const unsubscribeFromTopic = async (topic) => {
	try {
		const response = await api.post(`/user/chat/topics/unsubscribe`, null, {
			params: { topic },
		});
		return response.data;
	} catch (error) {
		handleApiError(error, "unsubscribing from topic");
		throw error;
	}
};

export const getAllTopics = async () => {
	try {
		const response = await api.get("/user/chat/topics");
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching all topics");
		throw error;
	}
};

export const sendGroupMessage = async (senderId, topic, content) => {
	try {
		const response = await api.post(`/user/chat/group/send`, null, {
			params: { senderId, topic, content },
		});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "sending group message");
		throw error;
	}
};

export const getSubscribedTopics = async (userId) => {
	try {
		const response = await api.get(`/user/chat/topics/subscribed`, {
			params: { userId },
		});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching subscribed topics");
		throw error;
	}
};

export const getMessagesInTopic = async (topic) => {
	try {
		const response = await api.get(`/user/chat/topics/${topic}/messages`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching messages in topic");
		throw error;
	}
};