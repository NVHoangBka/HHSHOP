import CategoryService from "../services/CategoryService";

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  async getCategories() {
    try {
      const result = await this.categoryService.getCategories();
      return result;
    } catch (error) {}
  }

  async getSubCategories() {
    try {
      const result = await this.categoryService.getSubCategories();
      return result;
    } catch (error) {}
  }

  async getCategoriesByValue(value) {
    try {
      const result = await this.categoryService.getCategoriesByValue(value);
      return result;
    } catch (error) {}
  }

  async getSubCategoriesByCategory(categoryId) {
    try {
      const subCategories =
        await this.categoryService.getSubCategoriesByCategory(categoryId);
      return subCategories;
    } catch (error) {}
  }
}

const categoryController = new CategoryController();
export default categoryController;
