import { api } from "./ApiFuntions";
import { handleApiError } from "../utils/apiErrorHandler";

export const fetchBooks = async (page = 1, limit = 6) => {
  try {
    const response = await api.get(`/books`, {
      params: { offset: page - 1, limit },
    });
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching books");
  }
};

export const fetchBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching book by ID");
  }
};

export const searchBook = async (page = 1, limit = 6, title = "") => {
  try {
    const response = await api.get(`/books/search`, {
      params: {
        page: page - 1,
        size: limit,
        sort: "title,asc",
        "title.contains": title,
      },
    });
    return response.data.result;
  } catch (error) {
    handleApiError(error, "searching books");
  }
};

export const filterBook = async (page = 1, limit = 6, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page - 1,
    size: limit,
    sort: "title,asc",
  });
  console.log("🚀 ~ file: Common.js ~ line 90 ~ filterBook ~ queryParams", queryParams);

  // Duyệt qua từng field trong filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((val) => {
          queryParams.append(`${key}.contains`, val);
        });
      }
      else if (!Array.isArray(value)) {
        queryParams.append(`${key}.contains`, value);
      }
    }
  });

  try {
    const response = await api.get(`/books/search?${queryParams.toString()}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "filtering books");
  }
};


