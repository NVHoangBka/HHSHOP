import StoreService from "../services/StoreService";

class StoreController {
  constructor() {
    this.storeService = new StoreService();
  }
  // ================TAGS=======================
  async getAllStores() {
    try {
      const stores = await this.storeService.getAllStores();
      return { success: true, stores };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const storeController = new StoreController();
export default storeController;
