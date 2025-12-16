import NewService from "../services/NewService";

class NewController {
  constructor() {
    this.newService = new NewService();
  }

  async getNews() {
    try {
      const news = await this.newService.getNews();
      return { success: true, news };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const newController = new NewController();
export default newController;
