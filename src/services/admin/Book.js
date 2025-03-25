import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

// Lấy danh sách sách (GET /books)
export const getBooks = async (page = 1, limit = 10) => {
	try {
		const response = await api.get(`/books?offset=${page - 1}&limit=${limit}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching books");
	}
};

// Tìm kiếm sách (GET /admin/books)
export const searchBooks = async (criteria, page = 1, limit = 10) => {
	const queryParams = new URLSearchParams({
		offset: page - 1,
		limit: limit,
	});

	// Thêm các tiêu chí tìm kiếm vào query params
	if (criteria.isbn) queryParams.append("isbn.contains", criteria.isbn);
	if (criteria.title) queryParams.append("title.contains", criteria.title);
	if (criteria.author) queryParams.append("author.contains", criteria.author);
	if (criteria.typeName) queryParams.append("typeName.contains", criteria.typeName);
	if (criteria.stockFrom) queryParams.append("stock.greaterThanOrEqual", criteria.stockFrom);
	if (criteria.stockTo) queryParams.append("stock.lessThanOrEqual", criteria.stockTo);
	if (criteria.publisher) queryParams.append("publisher.contains", criteria.publisher);
	if (criteria.publishedDateFrom)
		queryParams.append("publishedDate.greaterThanOrEqual", criteria.publishedDateFrom);
	if (criteria.publishedDateTo)
		queryParams.append("publishedDate.lessThanOrEqual", criteria.publishedDateTo);
	if (criteria.maxBorrowDaysFrom)
		queryParams.append("maxBorrowDays.greaterThanOrEqual", criteria.maxBorrowDaysFrom);
	if (criteria.maxBorrowDaysTo)
		queryParams.append("maxBorrowDays.lessThanOrEqual", criteria.maxBorrowDaysTo);
	if (criteria.location) queryParams.append("location.contains", criteria.location);

	try {
		const response = await api.get(`/books/search?${queryParams.toString()}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "searching books");
	}
};

// Lấy thông tin một cuốn sách (GET /admin/books/{id})
export const getBook = async (id) => {
	try {
		const response = await api.get(`/books/${id}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "fetching book details");
	}
};

// Tạo sách mới (POST /admin/books)
export const createBook = async (bookData) => {
	try {
		const response = await api.post("/admin/books", bookData);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "creating book");
	}
};

// Cập nhật sách (PUT /admin/books/{id})
export const updateBook = async (id, bookData) => {
	try {
		const response = await api.put(`/admin/books/${id}`, bookData);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "updating book");
	}
};

// Xóa sách (DELETE /admin/books/{id})
export const deleteBook = async (id) => {
	try {
		const response = await api.delete(`/admin/books/${id}`);
		return response.data.result;
	} catch (error) {
		handleApiError(error, "deleting book");
	}
};

// Import sách (POST /admin/books/import)
export const importBooks = async (file) => {
	const formData = new FormData();
	formData.append("file", file);
	try {
		const response = await api.post(`/admin/books/import`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.result;
	} catch (error) {
		handleApiError(error, "importing books");
	}
};