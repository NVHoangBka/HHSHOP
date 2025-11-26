import api from "./api.js";
import AdminModel from "../models/AdminModel.js";

class AdminService {
  constructor() {
    this.adminModel = new AdminModel();
  }

  async loginAdmin(email, password) {
    try {
      const response = await api.post("/admin/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;

      // LƯU TOKEN VÀO LOCALSTORAGE
      localStorage.setItem("adminToken", accessToken);
      if (refreshToken) localStorage.setItem("adminRefreshToken", refreshToken);
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

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (!refreshToken) {
        return { success: false, message: "Không có refresh token" };
      }
      const response = await api.post("/admin/refresh-token", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("adminAccessToken", accessToken);
      localStorage.setItem("adminRefreshToken", newRefreshToken);
      return { success: true, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Refresh token error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể làm mới token",
        status: error.response?.status || 500,
      };
    }
  }

  // === ĐĂNG XUẤT ===
  async logoutAdmin() {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await api.post("/admin/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      this.adminModel.clearCurrentAdmin();
      return { success: true };
    } catch (error) {
      console.error("Logout API error:", error);
    }
  }
  // === LẤY ADMIN HIỆN TẠI (nếu cần) ===
  async getCurrentAdmin() {
    const token = localStorage.getItem("adminToken");
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.adminModel.clearCurrentAdmin();
      return null;
    }
  }

  // === KIỂM TRA ĐĂNG NHẬP – DÙNG TOKEN TỪ LOCALSTORAGE ===
  async isAuthenticatedAdmin() {
    return !!this.adminModel.getCurrentAdmin();
  }

  async getAllOrders() {
    try {
      const res = await api.get("/admin/orders");

      console.log(res);
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
