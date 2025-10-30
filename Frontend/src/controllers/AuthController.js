import AuthService from '../services/AuthService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(newUser) {
    try {
      const result = await this.authService.register(newUser);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: 'Đăng ký thất bại', status: 500 };
    }
  }

  async login(email, password) {
    try {
      const result = await this.authService.login(email, password);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: 'Đăng nhập thất bại', status: 500 };
    }
  }

  async logout() {
    try {
      const result = await this.authService.logout();
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: 'Đăng xuất thất bại' };
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

  async getAddressCount(userId) {
    try {
      const count = await this.authService.getAddressCount(userId);
      return { success: true, count };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default AuthController;