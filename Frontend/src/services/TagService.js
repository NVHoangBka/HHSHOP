import api from "./api";

class TagService {
  constructor() {}

  // === LẤY DANH SÁCH ===
  async getAllTags() {
    try {
      const response = await api.get("/tags");
      return response.data.tags;
    } catch (error) {}
  }
}

export default TagService;
