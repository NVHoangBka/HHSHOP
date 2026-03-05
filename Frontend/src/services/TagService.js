import api from "./api";

class TagService {
  // === LẤY DANH SÁCH ===
  async getAllTags() {
    try {
      const response = await api.get("/tags");
      return response.data.tags;
    } catch (error) {}
  }

  async getAllTypes() {
    try {
      const response = await api.get("/types");
      return response.data.types;
    } catch (error) {}
  }

  async getAllColors() {
    try {
      const response = await api.get("/colors");
      return response.data.colors;
    } catch (error) {}
  }

  async getAllBrands() {
    try {
      const response = await api.get("/brands");
      return response.data.brands;
    } catch (error) {}
  }
}

export default TagService;
