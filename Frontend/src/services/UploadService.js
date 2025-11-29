import api from "./api.js";

class UploadService {
  static async uploadSingle(file) {
    if (!file) throw new Error("Không có file");

    const formData = new FormData();
    formData.append("images", file);

    const res = await api.post("/upload", formData);

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Upload thất bại");
    }

    return data.urls[0];
  }

  // Upload nhiều ảnh → trả về mảng URL
  static async uploadMultiple(files) {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await api.post("/upload", formData);

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Upload thất bại");
    }

    return data.urls;
  }
}

export default UploadService;
