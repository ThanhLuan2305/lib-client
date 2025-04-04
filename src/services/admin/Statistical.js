import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

export const countBookActive = async () => {
	try {
		const response = await api.get("/admin/statistical/count-book-active");
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Count Book Active");
		throw error;
	}
};

export const countAllBorrowBook = async () => {
	try {
		const response = await api.get("/admin/statistical/count-all-borrow-book");
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Count All Borrow Book");
		throw error;
	}
};

export const countBorrowBookActive = async () => {
	try {
		const response = await api.get("/admin/statistical/count-borrow-book-active");
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Count Borrow Book Active");
		throw error;
	}
};

export const countUserActive = async () => {
	try {
		const response = await api.get("/admin/statistical/count-user-active");
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Count User Active");
		throw error;
	}
};

export const getRecentBooks = async (quantity) => {
	try {
		const response = await api.get(`/admin/statistical/get-book-recent?quantity=${quantity}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Get Recent Books");
		throw error;
	}
};

export const getBorrowTrend = async (year) => {
	try {
		const response = await api.get(`/admin/statistical/get-borrow-trend?year=${year}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "Get Borrow Trend");
		throw error;
	}
};