import api from "./api";

class NewService {
  constructor() {}

  // === LẤY DANH SÁCH tin tức ===
  async getNews() {
    try {
      const response = await api.get("/news");
      console.log(response);
      return response.data.news;
    } catch (error) {}
  }
}

export default NewService;
