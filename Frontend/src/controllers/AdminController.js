import AdminService from "../services/AdminService";

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  async login(email, password) {
    try {
      const result = await this.adminService.login(email, password);
      return result; // { success, user, message, status }
    } catch (error) {
      return { success: false, message: "Đăng nhập thất bại", status: 500 };
    }
  }

  async logout() {
    try {
      const result = await this.adminService.logout();
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đăng xuất thất bại" };
    }
  }

  async isAuthenticated() {
    try {
      return await this.adminService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
  async recoverPassword(email) {
    try {
      const result = await this.adminService.recoverPassword(email);
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Yêu cầu đặt lại mật khẩu thất bại" };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const result = await this.adminService.resetPassword(token, newPassword);
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đặt lại mật khẩu thất bại" };
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const result = await this.adminService.changePassword(
        oldPassword,
        newPassword
      );
      return result; // { success, message }
    } catch (error) {
      return { success: false, message: "Đổi mật khẩu thất bại" };
    }
  }
}

export default AdminController;
