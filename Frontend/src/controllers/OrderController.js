import AuthService from '../services/AuthService';

class OrderController {
  constructor() {
      this.authService = new AuthService();
  }
  async getAddressCount(userId) {
    try {
      const count = await this.authService.getAddressCount(userId);
      return { success: true, count };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getOrders() {
    try {
      const orders = await this.authService.getOrders();
      return { success: true, orders };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default OrderController;