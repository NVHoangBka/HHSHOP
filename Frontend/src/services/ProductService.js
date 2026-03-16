import ProductModel from "../models/ProductModel";
import api from "./api";
class ProductService {
  constructor() {
    this.productModel = new ProductModel();
    this.allProducts = null;
  }

  async getAllProducts() {
    if (this.allProducts) {
      return this.allProducts;
    }

    try {
      const res = await api.get("/products");

      this.allProducts = this.productModel.mapProducts(res.data.products);

      return this.allProducts;
    } catch (error) {
      console.error("getAllProducts error:", error);
      return [];
    }
  }

  async getProductsByTitle(titlePath) {
    const res = await api.get(`/products/title/${titlePath}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductsBySubTitle(subTitlePath) {
    const res = await api.get(`/products/subtitle/${subTitlePath}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductsByTag(tag) {
    const res = await api.get(`/products/tag/${tag}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductsByType(type) {
    const res = await api.get(`/products/type/${type}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return this.productModel.mapProduct(res.data.products);
  }

  async getProductsByCategory(categoryId) {
    const res = await api.get(`/products/category/${categoryId}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductsBySubCategory(subCategoryId) {
    const res = await api.get(`/products/subcategory/${subCategoryId}`);
    return this.productModel.mapProducts(res.data.products);
  }

  async getProductBySlug(slug) {
    const res = await api.get(`/products/slug/${slug}`);
    return this.productModel.mapProduct(res.data.products);
  }

  async search(query, category, lang) {
    if (!query?.trim()) return [];
    const params = { q: query, lang };
    if (category !== "all") params.category = category;

    const res = await api.get("/products/search/live", { params });
    return this.productModel.mapProducts(res.data.products);
  }

  async saveKeyword(keyword, lang) {
    await api.post("/products/search/keyword", {
      keyword,
      lang,
    });
  }

  async getPopularKeywords(lang) {
    const params = { lang };
    const res = await api.get("/products/keywords/popular", { params });
    if (res.data.success) {
      return res.data.keywords;
    }
    return [];
  }

  // Bonus: Lấy sản phẩm nổi bật, mới nhất, v.v.
  async getFeaturedProducts(limit = 12) {
    const res = await api.get("/products?sort=-createdAt&limit=" + limit);
    return this.productModel.mapProducts(res.data.products);
  }
}

export default ProductService;
