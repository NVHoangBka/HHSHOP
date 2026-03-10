import api from "./api";

class StoreService {
  // === LẤY DANH SÁCH ===
  async getAllStores() {
    try {
      const response = await api.get("/stores");
      return response.data.stores;
    } catch (error) {}
  }
}

export default StoreService;
