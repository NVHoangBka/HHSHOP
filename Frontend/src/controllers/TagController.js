import TagService from "../services/TagService";

class TagController {
  constructor() {
    this.tagService = new TagService();
  }

  async getAllTags() {
    try {
      const tags = await this.tagService.getAllTags();
      return { success: true, tags };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const tagController = new TagController();
export default tagController;
