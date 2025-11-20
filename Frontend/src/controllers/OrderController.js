import AuthService from "../services/AuthService";

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

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const result = await this.authService.createOrder(orderData);

      if (result.success) {
        return {
          success: true,
          order: result.order,
          message: "Đặt hàng thành công!",
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("OrderController.createOrder:", error);
      return {
        success: false,
        message: "Hệ thống đang bận, vui lòng thử lại sau ít phút",
      };
    }
  }
}

export default OrderController;
