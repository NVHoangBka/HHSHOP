import AdminService from "../services/AdminService";
import UploadService from "../services/UploadService";

class AdminController {
  constructor() {
    this.adminService = new AdminService();
    this.uploadService = new UploadService();
  }
  // =============   AUTH ADMIN  ==================
  async loginAdmin(email, password) {
    try {
      const result = await this.adminService.loginAdmin(email, password);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: "Đăng nhập thất bại", status: 500 };
    }
  }

  async logoutAdmin() {
    try {
      const result = await this.adminService.logoutAdmin();
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đăng xuất thất bại" };
    }
  }

  async isAuthenticatedAdmin() {
    try {
      return await this.adminService.isAuthenticatedAdmin();
    } catch (error) {
      return false;
    }
  }

  async getCurrentAdmin() {
    try {
      return await this.adminService.getCurrentAdmin();
    } catch (error) {
      return null;
    }
  }

  async getUsersAllAdmin() {
    try {
      const result = await this.adminService.getUsersAllAdmin();
      return result;
    } catch (error) {
      return { success: false, message: "Lấy người dùng thất bại" };
    }
  }

  // =============   ORDERS ADMIN  ==================

  async getOrdersAllAdmin() {
    try {
      const result = await this.adminService.getOrdersAllAdmin();
      return result;
    } catch (error) {
      return { success: false, message: "Lấy đơn hàng thất bại" };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const result = await this.adminService.updateOrderStatus(orderId, status);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy đơn hàng thất bại" };
    }
  }

  async updateOrderPaymentStatus(orderId, paymentStatus) {
    try {
      const result = await this.adminService.updateOrderPaymentStatus(
        orderId,
        paymentStatus
      );
      return result;
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật trạng thái thanh toán thất bại",
      };
    }
  }

  // =============   PRODUCTS ADMIN ==================
  async getProductsAllAdmin(pagination) {
    try {
      const result = await this.adminService.getProductsAllAdmin(pagination);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy sản phẩm thất bại" };
    }
  }

  async createProductAdmin(productData) {
    try {
      const result = await this.adminService.createProductAdmin(productData);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy sản phẩm thất bại" };
    }
  }

  async updateProductAdmin(productId, productData) {
    try {
      const result = await this.adminService.updateProductAdmin(
        productId,
        productData
      );
      return result;
    } catch (error) {
      return { success: false, message: "Lấy sản phẩm thất bại" };
    }
  }

  async deleteProductAdmin(productId) {
    try {
      const result = await this.adminService.deleteProductAdmin(productId);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy sản phẩm thất bại" };
    }
  }

  async uploadSingle(file) {
    try {
      const result = this.uploadService.uploadSingle(file);
      return result;
    } catch (error) {
      return { success: false, message: "Lỗi upload ảnh" };
    }
  }

  async uploadMultiple(files) {
    try {
      const result = this.uploadService.uploadMultiple(files);
      return result;
    } catch (error) {
      return { success: false, message: "Lỗi upload ảnh" };
    }
  }

  // =============   NEWS ADMIN ==================
  async getNewsAllAdmin(pagination) {
    try {
      const result = await this.adminService.getNewsAllAdmin(pagination);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tin tức thất bại" };
    }
  }

  async createNewAdmin(newData) {
    try {
      const result = await this.adminService.createNewAdmin(newData);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tin tức thất bại" };
    }
  }

  async updateNewAdmin(newId, newData) {
    try {
      const result = await this.adminService.updateNewAdmin(newId, newData);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tin tức thất bại" };
    }
  }

  async deleteNewAdmin(newId) {
    try {
      const result = await this.adminService.deleteNewAdmin(newId);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tin tức thất bại" };
    }
  }

  // =============   TAGS ADMIN ==================
  async getTagsAllAdmin(pagination) {
    try {
      const result = await this.adminService.getTagsAllAdmin(pagination);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tag thất bại" };
    }
  }

  async createTagAdmin(tagData) {
    try {
      const result = await this.adminService.createTagAdmin(tagData);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tag thất bại" };
    }
  }

  async updateTagAdmin(tagId, tagData) {
    try {
      const result = await this.adminService.updateTagAdmin(tagId, tagData);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tag thất bại" };
    }
  }

  async deleteTagAdmin(tagId) {
    try {
      const result = await this.adminService.deleteTagAdmin(tagId);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy tag thất bại" };
    }
  }

  // ============   CATEGORIES ADMIN ==================
  async getCategoriesAllAdmin(pagination) {
    try {
      const result = await this.adminService.getCategoriesAllAdmin(pagination);
      return result;
    } catch (error) {
      return { success: false, message: "Lấy danh mục thất bại" };
    }
  }

  async getSubCategoriesByCategory(categoryId) {
    try {
      const result = await this.adminService.getSubCategoriesByCategory(
        categoryId
      );
      return result;
    } catch (error) {
      return { success: false, message: "Lấy danh mục con thất bại" };
    }
  }

  // ================COLORS ADMIN =======================
  async getColorsAllAdmin() {
    try {
      const result = await this.adminService.getColorsAllAdmin();
      return result;
    } catch (error) {
      return { success: false, message: "Lấy màu sắc thất bại" };
    }
  }
}

export default AdminController;
