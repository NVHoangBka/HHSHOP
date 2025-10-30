import { titles } from '../data/titles.js';

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
    this.titles = titles.map(data => new Title(data)) || []; 
  }

  // Lấy tất cả tiêu đề
  getAllTitles() {
    return [...this.titles];
  }

  // Lấy tiêu đề theo ID
  getTitleById(id) {
    return this.titles.find((title) => title.id === parseInt(id)) || null;
  }

  // Lấy tiêu đề theo type
  getTitlesByType(type) {
    return this.titles.filter((title) => title.type === type);
  }

  // Lấy tiêu đề theo path
  getTitlesByPath(path) {
    return this.titles.filter((title) => title.path === path);
  }

  // Lấy subTitle theo path và value
  getSubTitlesByPath(path, value) {
    const title = this.titles.find((title) => title.path === path);
    if (title) {
      return title.subTitles.find((sub) => sub.value === value) || null;
    }
    return null;
  }
}

export default TitleModel; // Xuất instance mặc định