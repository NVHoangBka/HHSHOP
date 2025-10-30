import TitleService from '../services/TitleService.js';

class TitleController {
  constructor() {
    this.titleService = new TitleService();
  }

  getAllTitles() {
    try {
      const titles = this.titleService.getAllTitles();
      if (!titles || !Array.isArray(titles)) {
        throw new Error('Danh sách tiêu đề không hợp lệ');
      }
      return titles;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tiêu đề:', error);
      return [];
    }
  }

  getTitleById(id) {
    try {
      const title = this.titleService.getTitleById(id);
      if (!title) {
        throw new Error('Tiêu đề không tồn tại');
      }
      return title;
    } catch (error) {
      console.error('Lỗi khi lấy tiêu đề theo ID:', error);
      return null;
    }
  }

  getTitlesByType(type) {
    try {
      const titles = this.titleService.getTitlesByType(type);
      if (!titles || !Array.isArray(titles)) {
        throw new Error('Danh sách tiêu đề theo loại không hợp lệ');
      }
      return titles;
    } catch (error) {
      console.error('Lỗi khi lấy tiêu đề theo loại:', error);
      return [];
    }
  }

  getTitlesByPath(path) {
    try {
      const titles = this.titleService.getTitlesByPath(path);
      if (!titles || !Array.isArray(titles)) {
        throw new Error('Danh sách tiêu đề theo path không hợp lệ');
      }
      return titles;
    } catch (error) {
      console.error('Lỗi khi lấy tiêu đề theo path:', error);
      return [];
    }
  }

  getSubTitlesByPath(path, value) {
    try {
      const subTitle = this.titleService.getSubTitlesByPath(path, value);
      if (!subTitle) {
        throw new Error('SubTitle không tồn tại');
      }
      return subTitle;
    } catch (error) {
      console.error('Lỗi khi lấy subTitle theo path:', error);
      return null;
    }
  }
}

export default TitleController;