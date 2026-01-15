// src/services/CategoryService.js
import api from "./api";

class CategoryService {
  // ========= CATEGORY ==============
  async getCategories() {
    try {
      const res = await api.get("/categories");
      const categories = res.data.categories;
      return { success: true, categories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  /**
   * LẤY TẤT CẢ DANH MỤC CON (không theo cha cụ thể)
   */
  async getSubCategories() {
    try {
      const res = await api.get("/categories/subcategories");
      const subCategories = res.data.subCategories;
      return { success: true, subCategories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  /**
   * TÌM DANH MỤC THEO VALUE (nếu cần dùng sau này)
   */
  async getCategoriesByValue(value) {
    try {
      const res = await api.get(`/categories/by-value/${value}`);
      return {
        success: true,
        category: res.data.category,
      };
    } catch (error) {
      console.error("Lỗi getCategoryByValue:", error);
      return this.handleError(error);
    }
  }

  /**
   * LẤY DANH MỤC CON THEO DANH MỤC CHA
   */
  async getSubCategoriesByCategory(categoryId) {
    try {
      const res = await api.get(`/categories/subcategories/${categoryId}`);
      const subCategories = res.data.subCategories;

      return { success: true, subCategories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }
}

export default CategoryService;
