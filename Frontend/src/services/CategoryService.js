// src/services/CategoryService.js
import api from "./api";

class CategoryService {
  async getCategoryFeatured() {
    const res = await api.get("/categories/featured");
    return res.data.categories;
  }

  async getCategoryAll() {
    const res = await api.get("/categories");
    return res.data.categories;
  }
}

export default CategoryService();
