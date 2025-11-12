// src/models/ProductModel.js
import api from "../services/api";

class Product {
  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.price = data.price;
    this.discountPrice = data.discountPrice || null;
    this.image = data.image;
    this.description = data.description;
    this.types = data.types || [];
    this.tag = data.tag || [];
    this.brands = data.brands || [];
    this.colors = data.colors || [];
    this.titles = data.titles || [];
    this.subTitles = data.subTitles || [];
    this.falseSale = data.falseSale || false;
  }
}

class ProductModel {
  async getAllProducts() {
    try {
      const res = await api.get("/products");
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      return [];
    }
  }

  async getProductsByTitle(titlePath) {
    try {
      const res = await api.get(`/products/title/${titlePath}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi lọc theo title:", error);
      return [];
    }
  }

  async getProductsBySubTitle(subTitlePath) {
    try {
      const res = await api.get(`/products/subtitle/${subTitlePath}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi lọc theo subtitle:", error);
      return [];
    }
  }

  async getProductsByTag(tag) {
    try {
      const res = await api.get(`/products/tag/${tag}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi lọc theo tag:", error);
      return [];
    }
  }

  async getProductsByType(type) {
    try {
      const res = await api.get(`/products/type/${type}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi lọc theo type:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      return new Product(res.data.product);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
      return null;
    }
  }

  // TÌM KIẾM - DÙNG api (Axios)
  async search(query, category = "all") {
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (category !== "all") params.append("category", category);

      const res = await api.get(`/products/search?${params}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      return [];
    }
  }

  // LIVE SEARCH - DÙNG api (Axios)
  async searchLive(query, category = "all") {
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (category !== "all") params.append("category", category);

      const res = await api.get(`/products/search/live?${params}`);
      return res.data.products.map((p) => new Product(p));
    } catch (error) {
      console.error("Lỗi live search:", error);
      return [];
    }
  }
}

export default ProductModel;
