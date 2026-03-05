import TagService from "../services/TagService";

class TagController {
  constructor() {
    this.tagService = new TagService();
  }
  // ================TAGS=======================
  async getAllTags() {
    try {
      const tags = await this.tagService.getAllTags();
      return { success: true, tags };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ================TYPES=======================
  async getAllTypes() {
    try {
      const types = await this.tagService.getAllTypes();
      return { success: true, types };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ================COLORS=======================
  async getAllColors() {
    try {
      const colors = await this.tagService.getAllColors();
      return { success: true, colors };
    } catch (error) {
      return { success: false, message: "Lấy màu sắc thất bại" };
    }
  }

  // ================BRANDS=======================
  async getAllBrands() {
    try {
      const brands = await this.tagService.getAllBrands();
      return { success: true, brands };
    } catch (error) {
      return { success: false, message: "Lấy thương hiệu thất bại" };
    }
  }
}

const tagController = new TagController();
export default tagController;
