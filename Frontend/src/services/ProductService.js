// src/services/ProductService.js
import ProductModel from "../models/ProductModel";

class ProductService {
  constructor() {
    this.productModel = new ProductModel();
  }

  getAllProducts() {
    return this.productModel.getAllProducts();
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

  filterProducts(criteria) {
    let products = this.getAllProducts();
    if (criteria.titlePath) {
      products = this.getProductsByTitle(criteria.titlePath);
    }
    if (criteria.subTitlePath) {
      products = this.getProductsBySubTitle(criteria.subTitlePath);
    }
    return products;
  }
}

export default ProductService;
