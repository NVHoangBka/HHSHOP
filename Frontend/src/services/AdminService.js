import api from "./api.js";
import UserModel from "../models/UserModel.js";

class AdminService {
  constructor() {
    this.userModel = new UserModel();
  }

  async login(email, password) {
    try {
      const response = await api.post("/admin/login", { email, password });
      const { user } = response.data;
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
    }
  }

  async logout() {
    try {
      await api.post("/admin/logout", null);
      this.userModel.clearCurrentUser();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Đăng xuất thất bại" };
    }
  }

  isAuthenticated() {
    return !!this.userModel.getCurrentUser();
  }
}

export default AdminService;
