import TitleModel from '../models/TitleModel.js';

class TitleService {
  constructor() {
    this.titleModel = new TitleModel();
  }

  getAllTitles() {
    return this.titleModel.getAllTitles();
  }

  getTitleById(id) {
    return this.titleModel.getTitleById(id);
  }

  getTitlesByType(type) {
    return this.titleModel.getTitlesByType(type);
  }

  getTitlesByPath(path) {
    return this.titleModel.getTitlesByPath(path);
  }

  getSubTitlesByPath(path, value) {
    return this.titleModel.getSubTitlesByPath(path, value);
  }
}

export default TitleService;