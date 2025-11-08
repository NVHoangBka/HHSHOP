import api from "../services/api";

export class Title {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.type = data.type;
    this.path = data.path;
    this.subTitles = data.subTitles || [];
  }
}

export class TitleModel {
  constructor() {
    this.titles = [];
  }

  async load() {
    if (this.loaded) return;
    try {
      const res = await api.get("/titles");
      this.titles = res.data.titles.map((t) => new Title(t));
      this.loaded = true;
    } catch (error) {
      console.error("Lỗi load titles:", error);
    }
  }

  // Lấy tất cả tiêu đề
  async getAllTitles() {
    await this.load();
    return [...this.titles];
  }

  // Lấy tiêu đề theo ID
  getTitleById(id) {
    return this.titles.find((t) => t.id === id) || null;
  }

  // Lấy tiêu đề theo type
  async getTitlesByType(type) {
    await this.load();
    return this.titles.filter((t) => t.type === type);
  }

  // Lấy tiêu đề theo path
  async getTitlesByPath(path) {
    await this.load();
    return this.titles.filter((t) => t.path === path);
  }
  // Lấy subTitle theo path và value
  async getSubTitlesByPath(path, value) {
    await this.load();
    const title = this.titles.find((t) => t.path === path);
    return title?.subTitles.find((s) => s.value === value) || null;
  }
}

export default TitleModel;
