import api from "./api.js";
import AdminModel from "../models/AdminModel.js";

class AdminService {
  constructor() {
    this.adminModel = new AdminModel();
  }

  // =============   AUTH ADMIN  ==================
  async loginAdmin(email, password) {
    try {
      const response = await api.post("/admin/login", { email, password });
      const { accessToken, user } = response.data;

      // DÙNG KEY RIÊNG – KHÔNG BAO GIỜ TRÙNG VỚI USER
      localStorage.setItem("adminAccessToken", accessToken);
      localStorage.setItem("adminLoggedIn", "true"); // để check nhanh

      this.adminModel.setCurrentAdmin(user);
      return { success: true, user, accessToken };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  // === ĐĂNG XUẤT ===
  async logoutAdmin() {
    try {
      const token = localStorage.getItem("adminAccessToken");
      if (token) {
        await api.post("/admin/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // XÓA SẠCH KEY RIÊNG
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminLoggedIn");
      this.adminModel.clearCurrentAdmin();
      return { success: true };
    } catch (error) {
      console.error("Logout API error:", error);
    }
  }

  // === LẤY ADMIN HIỆN TẠI (nếu cần) ===
  async getCurrentAdmin() {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) return null;
    try {
      const response = await api.get("/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.user;
      this.adminModel.setCurrentAdmin(user);

      return { success: true };
    } catch (error) {
      if (error.response?.data?.expired) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          return await this.getCurrentAdmin();
        }
      }
      // XÓA SẠCH KEY RIÊNG
      // localStorage.removeItem("adminAccessToken");
      // localStorage.removeItem("adminLoggedIn");
      // this.adminModel.clearCurrentAdmin();
      return null;
    }
  }

  // === KIỂM TRA ĐĂNG NHẬP – DÙNG TOKEN TỪ LOCALSTORAGE ===
  async isAuthenticatedAdmin() {
    return !!this.adminModel.getCurrentAdmin();
  }

  // =============   USERS ADMIN  ==================
  async getUsersAllAdmin() {
    try {
      const res = await api.get("/admin/users");
      const users = res.data.users;
      return { success: true, users };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  // =============   ORDERS ADMIN  ==================
  async getOrdersAllAdmin() {
    try {
      const res = await api.get("/admin/orders");
      const orders = res.data.orders;
      return { success: true, orders };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }
  async updateOrderStatus(orderId, status) {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status });
      const order = res.data.order;
      return { success: true, order };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async updateOrderPaymentStatus(orderId, paymentStatus) {
    try {
      const res = await api.put(`/admin/orders/${orderId}/payment-status`, {
        paymentStatus,
      });
      const order = res.data.order;
      return { success: true, order };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  // =============   PRODUCT ADMIN  ==================
  async getProductsAllAdmin(pagination) {
    try {
      const res = await api.get("/admin/products", { params: pagination });
      const products = res.data.products;
      const paginationData = res.data.pagination;
      return { success: true, products, paginationData };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async createProductAdmin(productData) {
    try {
      const res = await api.post("/admin/products", productData);
      const products = res.data.products;
      return { success: true, products };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async updateProductAdmin(productId, productData) {
    try {
      const res = await api.put(`/admin/products/${productId}`, productData);
      const products = res.data.products;
      return { success: true, products };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // XÓA SẢN PHẨM
  async deleteProductAdmin(productId) {
    try {
      const res = await api.delete(`/admin/products/${productId}`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // =============   NEWS ADMIN  ==================
  async getNewsAllAdmin(pagination) {
    try {
      const res = await api.get("/admin/news", { params: pagination });
      const news = res.data.news;
      const paginationData = res.data.pagination;
      return { success: true, news, paginationData };
    } catch (error) {}
  }

  async createNewAdmin(newData) {
    try {
      const res = await api.post("/admin/news", newData);
      const news = res.data.news;
      return { success: true, news };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async updateNewAdmin(newId, newData) {
    try {
      const res = await api.put(`/admin/news/${newId}`, newData);
      const news = res.data.news;
      return { success: true, news };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteNewAdmin(newId) {
    try {
      const res = await api.delete(`/admin/news/${newId}`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // =============   TAGS ADMIN  ==================

  async getTagsAllAdmin(pagination) {
    try {
      const res = await api.get("/admin/tags", { params: pagination });
      const tags = res.data.tags;
      const paginationData = res.data.pagination;
      return { success: true, tags, paginationData };
    } catch (error) {}
  }

  async createTagAdmin(tagData) {
    try {
      const res = await api.post("/admin/tags", tagData);
      const tags = res.data.tags;
      return { success: true, tags };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  async updateTagAdmin(tagId, tagData) {
    try {
      const res = await api.put(`/admin/tags/${tagId}`, tagData);
      const tags = res.data.tags;
      return { success: true, tags };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTagAdmin(tagId) {
    try {
      const res = await api.delete(`/admin/tags/${tagId}`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ========= CATEGORY ADMIN ==============
  async getCategoriesAllAdmin() {
    try {
      const res = await api.get("/categories");
      const categories = res.data.categories;
      return { success: true, categories };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

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

  // === COLORS ADMIN=====
  async getColorsAllAdmin() {
    try {
      const res = await api.get("/colors");
      const colors = res.data.colors;
      return { success: true, colors };
    } catch (error) {
      console.error("Login error:", error);
      return this.handleError(error);
    }
  }

  // === XỬ LÝ LỖI CHUNG ===
  handleError(error) {
    const message = error.response?.data?.message || "Lỗi hệ thống";
    const status = error.response?.status;
    console.log(message);
    return { success: false, message, status };
  }
}

export default AdminService;
