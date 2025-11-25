import TitleService from "../services/TitleService.js";

class TitleController {
  constructor() {
    this.titleService = new TitleService();
  }

  async getAllTitles() {
    try {
      const titles = await this.titleService.getAllTitles();
      if (!titles || !Array.isArray(titles)) {
        throw new Error("Danh sách tiêu đề không hợp lệ");
      }
      return titles;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tiêu đề:", error);
      return [];
    }
  }

  getTitleById(id) {
    try {
      const title = this.titleService.getTitleById(id);
      if (!title) {
        throw new Error("Tiêu đề không tồn tại");
      }
      return title;
    } catch (error) {
      console.error("Lỗi khi lấy tiêu đề theo ID:", error);
      return null;
    }
  }

  async getTitlesByType(type) {
    return await this.titleService.getTitlesByType(type);
  }
  async getTitlesByPath(path) {
    return await this.titleService.getTitlesByPath(path);
  }
  async getSubTitlesByPath(path, value) {
    return await this.titleService.getSubTitlesByPath(path, value);
  }

  async getAllSubTitles() {
    return await this.titleService.getAllSubTitles();
  }
}

const titleController = new TitleController();

export default titleController;
