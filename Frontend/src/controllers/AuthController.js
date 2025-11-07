import AuthService from "../services/AuthService.js";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(newUser) {
    try {
      const result = await this.authService.register(newUser);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: "Đăng ký thất bại", status: 500 };
    }
  }

  async login(email, password) {
    try {
      const result = await this.authService.login(email, password);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: "Đăng nhập thất bại", status: 500 };
    }
  }

  async logout() {
    try {
      const result = await this.authService.logout();
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đăng xuất thất bại" };
    }
  }

  async isAuthenticated() {
    try {
      return await this.authService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser() {
    try {
      return await this.authService.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  async recoverPassword(email) {
    try {
      const result = await this.authService.recoverPassword(email);
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Yêu cầu đặt lại mật khẩu thất bại" };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const result = await this.authService.resetPassword(token, newPassword);
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đặt lại mật khẩu thất bại" };
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const result = await this.authService.changePassword(
        oldPassword,
        newPassword
      );
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đổi mật khẩu thất bại" };
    }
  }

  async getAddressCount(userId) {
    try {
      const count = await this.authService.getAddressCount(userId);
      return { success: true, count };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAddressAll(userId) {
    try {
      const addresses = await this.authService.getAddressAll(userId);
      return { success: true, addresses };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async addAddress(userId, addressData) {
    try {
      const newAddress = await this.authService.addAddress(userId, addressData);
      return { success: true, address: newAddress };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateAddress(userId, addressId, addressData) {
    try {
      const updatedAddress = await this.authService.updateAddress(
        userId,
        addressId,
        addressData
      );
      return { success: true, address: updatedAddress };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteAddress(userId, addressId) {
    try {
      await this.authService.deleteAddress(userId, addressId);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default AuthController;
