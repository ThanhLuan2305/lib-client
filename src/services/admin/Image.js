import api from "../ApiFuntions";
import { handleApiError } from "../../utils/apiErrorHandler";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post("/admin/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const imageUrl = response.data.result;
    return imageUrl;
  } catch (error) {
    handleApiError(error, "uploading image");
    throw error;
  }
};

export const deleteImage = async (fileName) => {
  try {
    const response = await api.delete(`/admin/images/${fileName}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "deleting image");
  }
};

export const updateImage = async (oldFileName, newFile) => {
  const formData = new FormData();
  formData.append("oldFileName", oldFileName);
  formData.append("file", newFile);
  try {
    const response = await api.put("/admin/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.result;
  } catch (error) {
    handleApiError(error, "updating image");
  }
};

// Lấy URL preview của ảnh (GET /admin/images/preview/{fileName})
export const getPreviewUrl = async (fileName) => {
  try {
    const response = await api.get(`/admin/images/preview/${fileName}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error, "fetching image preview URL");
  }
};