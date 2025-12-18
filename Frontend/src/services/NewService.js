import api from "./api";

class NewService {
  // === LẤY DANH SÁCH tin tức ===
  async getNews() {
    try {
      const response = await api.get("/news");
      return response.data.news;
    } catch (error) {}
  }
}

export default NewService;
