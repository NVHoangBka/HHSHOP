import api from "./api.js";
import AdminModel from "../models/AdminModel.js";

class AdminService {
  constructor() {
    this.adminModel = new AdminModel();
  }

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
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
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

  async getUsersAllAdmin() {
    try {
      const res = await api.get("/admin/users");

      return { success: true, res };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.res?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.res?.status || 500,
      };
    }
  }

  async getOrdersAllAdmin() {
    try {
      const res = await api.get("/admin/orders");

      return { success: true, res };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.res?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.res?.status || 500,
      };
    }
  }

  // async updateOrderStatus(orderId, status) {
  //   try {
  //     const res = await api.put(`/admin/orders/${orderId}/status`, status);

  //     return res.data.status;
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     return {
  //       success: false,
  //       message: error.res?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
  //       status: error.res?.status || 500,
  //     };
  //   }
  // }
}

export default AdminService;
