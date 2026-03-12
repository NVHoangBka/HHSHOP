import api from "./api.js";

class UploadService {
  async uploadSingle(file) {
    console.log(file);

    if (!file) throw new Error("Không có file");

    const formData = new FormData();
    formData.append("mainImage", file);

    const res = await api.post("/admin/upload", formData);

    if (!res.data.success)
      throw new Error(res.data.message || "Upload thất bại");
    return res.data.urls[0];
  }

  // Upload nhiều ảnh → trả về mảng URL
  async uploadMultiple(files) {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append("galleryImages", file));

    const res = await api.post("/admin/upload", formData);

    if (!res.data.success)
      throw new Error(res.data.message || "Upload thất bại");
    return res.data.urls;
  }
}

export default UploadService;
