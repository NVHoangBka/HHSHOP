import api from "./api.js";
import UserModel from "../models/UserModel.js";

class AuthService {
  constructor() {
    this.userModel = new UserModel();
  }

  async register(newUser) {
    try {
      const response = await api.post("/auth/register", newUser);
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", "user"); // ← ĐÁNH DẤU LÀ USER
      this.userModel.setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
    }
  }

  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", "user"); // ← ĐÁNH DẤU LÀ USER
      this.userModel.setCurrentUser(user);
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

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return { success: false, message: "Không có refresh token" };
      }
      const response = await api.post("/auth/refresh-token", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
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

  async logout() {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await api.post("/auth/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.userModel.clearCurrentUser();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Đăng xuất thất bại" };
    }
  }

  async getCurrentUser() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.user;
      this.userModel.setCurrentUser(user);
      return user;
    } catch (error) {
      if (error.response?.data?.expired) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          return await this.getCurrentUser(); // Thử lại với token mới
        }
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.userModel.clearCurrentUser();
      return null;
    }
  }

  isAuthenticated() {
    return !!this.userModel.getCurrentUser();
  }

  async recoverPassword(email) {
    try {
      const response = await api.post("/auth/recover-password", {
        email: email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Recover password error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại",
      };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Link không hợp lệ hoặc đã hết hạn",
      };
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đổi mật khẩu thất bại",
      };
    }
  }

  async getAddressCount() {
    try {
      const response = await api.get("/addresses");
      return response.data.addresses.length;
    } catch (error) {
      console.error(
        "Lỗi lấy số địa chỉ:",
        error.response?.data || error.message
      );
      return 0;
    }
  }

  async getAddressAll() {
    try {
      const response = await api.get("/addresses");
      return response.data.addresses;
    } catch (error) {
      console.error(
        "Lỗi lấy số địa chỉ:",
        error.response?.data || error.message
      );
      return 0;
    }
  }

  async addAddress(address) {
    try {
      const response = await api.post("/addresses", address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.address;
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error.response?.data || error.message);
      throw new Error("Không thể thêm địa chỉ.");
    }
  }

  async updateAddress(addressId, address) {
    try {
      const response = await api.put(`/addresses/${addressId}`, address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.address;
    } catch (error) {
      console.error(
        "Lỗi cập nhật địa chỉ:",
        error.response?.data || error.message
      );
      throw new Error("Không thể cập nhật địa chỉ.");
    }
  }

  async deleteAddress(addressId) {
    try {
      await api.delete(`/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error.response?.data || error.message);
      throw new Error("Không thể xóa địa chỉ.");
    }
  }
}

export default AuthService;
