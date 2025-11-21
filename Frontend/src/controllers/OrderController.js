import OrderService from "../services/OrderService";

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  async getOrders() {
    try {
      const orders = await this.orderService.getOrders();
      return { success: true, orders };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const result = await this.orderService.createOrder(orderData);

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
