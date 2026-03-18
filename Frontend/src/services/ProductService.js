import api from "./api";
import ProductModel from "../models/ProductModel";

class ProductService {
  constructor() {
    this.productModel = new ProductModel();
    this.allProducts = null;
  }

  // ====================== LẤY TẤT CẢ ======================
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

  // async getProductsByTitle(titlePath) {
  //   const res = await api.get(`/products/title/${titlePath}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // async getProductsBySubTitle(subTitlePath) {
  //   const res = await api.get(`/products/subtitle/${subTitlePath}`);
  //   return this.productModel.mapProducts(res.data.products);
  // }

  // ====================== LẤY THEO TAG / TYPE ======================
  async getProductsByTag(tag) {
    try {
      const res = await api.get(`/products/tag/${tag}`);
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("getProductsByTag error:", error);
      return [];
    }
  }

  async getProductsByType(type) {
    try {
      const res = await api.get(`/products/type/${type}`);
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("getProductsByType error:", error);
      return [];
    }
  }
  // ====================== LẤY THEO ID ======================
  async getProductById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      return this.productModel.mapProduct(res.data.product);
    } catch (error) {
      console.error("getProductById error:", error);
      return null;
    }
  }

  // ====================== LẤY THEO CATEGORY ======================
  async getProductsByCategory(categoryId) {
    try {
      const res = await api.get(`/products/category/${categoryId}`);
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("getProductsByCategory error:", error);
      return [];
    }
  }

  async getProductsBySubCategory(subCategoryId) {
    try {
      const res = await api.get(`/products/subcategory/${subCategoryId}`);
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("getProductsBySubCategory error:", error);
      return [];
    }
  }

  // ====================== LẤY THEO SLUG ======================
  async getProductBySlug(slug) {
    try {
      const res = await api.get(`/products/slug/${slug}`);
      return this.productModel.mapProduct(res.data.products);
    } catch (error) {
      console.error("getProductBySlug error:", error);
      return null;
    }
  }

  async search(query, category, lang) {
    if (!query?.trim()) return [];

    try {
      const params = { q: query, lang };
      if (category !== "all") params.category = category;
      const res = await api.get("/products/search/live", { params });
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("search error:", error);
      return [];
    }
  }

  // ====================== TỪ KHOÁ ======================
  async saveKeyword(keyword, lang) {
    try {
      await api.post("/products/search/keyword", { keyword, lang });
    } catch (error) {
      // Không throw — lỗi keyword không ảnh hưởng UX
      console.warn("saveKeyword error:", error);
    }
  }
  async getPopularKeywords(lang) {
    try {
      const res = await api.get("/products/keywords/popular", {
        params: { lang },
      });
      return res.data.success ? res.data.keywords : [];
    } catch (error) {
      console.error("getPopularKeywords error:", error);
      return [];
    }
  }

  // ====================== SẢN PHẨM NỔI BẬT ======================
  async getFeaturedProducts(limit = 12) {
    try {
      const res = await api.get(`/products?sort=-createdAt&limit=${limit}`);
      return this.productModel.mapProducts(res.data.products);
    } catch (error) {
      console.error("getFeaturedProducts error:", error);
      return [];
    }
  }

  // ====================== INVALIDATE CACHE ======================
  // Gọi khi cần làm mới danh sách sản phẩm (ví dụ sau khi thêm vào giỏ)
  clearCache() {
    this.allProducts = null;
  }
}

export default ProductService;
