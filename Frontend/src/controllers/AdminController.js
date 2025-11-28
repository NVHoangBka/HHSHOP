import AdminService from "../services/AdminService";

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

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

  // =============   ORDERS  ==================

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

  // =============   PRODUCTS  ==================
  async getProductsAllAdmin() {
    try {
      const result = await this.adminService.getProductsAllAdmin();
      return result;
    } catch (error) {
      return { success: false, message: "Lấy đơn hàng thất bại" };
    }
  }
}

export default AdminController;
