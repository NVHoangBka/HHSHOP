// src/services/ProductService.js
import ProductModel from "../models/ProductModel";

class ProductService {
  constructor() {
    this.productModel = new ProductModel();
    this.allProducts = null;
  }

  async getAllProducts() {
    if (!this.allProducts) {
      this.allProducts = await this.productModel.getAllProducts();
    }
    return this.allProducts;
  }

  getProductsByTitle(titlePath) {
    return this.productModel.getProductsByTitle(titlePath);
  }

  getProductsBySubTitle(subTitlePath) {
    return this.productModel.getProductsBySubTitle(subTitlePath);
  }

  getProductsByTag(tag) {
    return this.productModel.getProductsByTag(tag);
  }

  getProductsByType(type) {
    return this.productModel.getProductsByType(type);
  }

  getProductById(id) {
    return this.productModel.getProductById(id);
  }

  async filterProducts(criteria) {
    let products = await this.getAllProducts();

    if (criteria.titlePath) {
      products = await this.getProductsByTitle(criteria.titlePath);
    }
    if (criteria.subTitlePath) {
      products = await this.getProductsBySubTitle(criteria.subTitlePath);
    }
    return products;
  }

  // SỬA: async + await
  async search(query, category = "all") {
    if (!query) return [];
    const params = new URLSearchParams();
    params.append("q", query);
    if (category !== "all") params.append("category", category);
    else params.append("category", "all");

    return await this.productModel.search(params);
  }

  // SỬA: await
  async searchLive(query, category = "all") {
    if (!query || query.trim().length < 1) return [];

    const params = new URLSearchParams();
    params.append("q", query);
    if (category !== "all") params.append("category", category);
    else params.append("category", "all");

    return await this.productModel.searchLive(params);
  }
}

export default ProductService;
