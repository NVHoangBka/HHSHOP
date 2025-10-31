import ProductService from '../services/ProductService';

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts() {
    return this.productService.getAllProducts();
  }

  getProductsByTitle(titlePath) {
    return this.productService.getProductsByTitle(titlePath);
  }

  getProductsBySubTitle(subTitlePath) {
    return this.productService.getProductsBySubTitle(subTitlePath);
  }

  getProductsByTag(tag) {
    return this.productService.getProductsByTag(tag);
  }

  getProductsByType(type) {
    return this.productService.getProductsByType(type);
  }

  getProductById(id) {
    return this.productService.getProductById(id);
  }
  
}

export default ProductController;