import TitleModel from "../models/TitleModel.js";

class TitleService {
  constructor() {
    this.titleModel = new TitleModel();
  }

  async getAllTitles() {
    return await this.titleModel.getAllTitles();
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
}

export default TitleService;
