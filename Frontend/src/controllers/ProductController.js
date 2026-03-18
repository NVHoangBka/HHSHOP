import ProductService from "../services/ProductService";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts() {
    const result = await this.productService.getAllProducts();
    return result;
  }

  async getProductsByTitle(titlePath) {
    const result = await this.productService.getProductsByTitle(titlePath);
    return result;
  }

  async getProductsBySubTitle(subTitlePath) {
    const result =
      await this.productService.getProductsBySubTitle(subTitlePath);
    return result;
  }

  async getProductsByTag(tag) {
    const result = await this.productService.getProductsByTag(tag);
    return result;
  }

  async getProductsByType(type) {
    const result = await this.productService.getProductsByType(type);
    return result;
  }

  async getProductById(id) {
    const result = await this.productService.getProductById(id);
    return result;
  }

  async getProductsByCategory(categoryId) {
    const result = await this.productService.getProductsByCategory(categoryId);
    return result;
  }

  async getProductsBySubCategory(subCategoryId) {
    const result =
      await this.productService.getProductsBySubCategory(subCategoryId);
    return result;
  }

  async search(query, category, lang) {
    const result = await this.productService.search(query, category, lang);
    return result;
  }

  async saveKeyword(keyword, lang) {
    const result = await this.productService.saveKeyword(keyword, lang);
    return result;
  }

  async getPopularKeywords(lang) {
    const result = await this.productService.getPopularKeywords(lang);
    return result;
  }

  async getProductBySlug(slug) {
    const result = await this.productService.getProductBySlug(slug);
    return result;
  }

  async getFeaturedProducts(limit = 12) {
    return await this.productService.getFeaturedProducts(limit);
  }

  clearCache() {
    this.productService.clearCache();
  }
}

export default ProductController;
