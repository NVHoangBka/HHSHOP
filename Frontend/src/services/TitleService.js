import api from "./api.js";
import TitleModel from "../models/TitleModel.js";

class TitleService {
  constructor() {
    this.titleModel = new TitleModel();
  }

  // === LẤY DANH SÁCH ===
  async getAllTitles() {
    try {
      const response = await api.get("/titles");
      return response.data.titles;
    } catch (error) {}
  }

  async getTitleById(id) {
    return await this.titleModel.getTitleById(id);
  }

  async getTitlesByType(type) {
    return await this.titleModel.getTitlesByType(type);
  }
  async getTitlesByPath(path) {
    return await this.titleModel.getTitlesByPath(path);
  }
  async getSubTitlesByPath(path, value) {
    return await this.titleModel.getSubTitlesByPath(path, value);
  }

  async getAllSubTitles() {
    return await this.titleModel.getAllSubTitles();
  }
}

export default TitleService;
