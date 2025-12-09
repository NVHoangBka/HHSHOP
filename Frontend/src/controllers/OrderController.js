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
      // Bước 1: Tạo đơn hàng
      const orderResult = await this.orderService.createOrder(orderData);
      if (!orderResult.success) {
        return { success: false, message: orderResult.message };
      }

      const order = orderResult.order;

      // Bước 2: Gọi backend tạo QR (lưu vào DB luôn)
      if (orderData.paymentMethod === "BANK") {
        const qrResult = await this.orderService.generatePaymentQR(order._id);
        return {
          success: true,
          order,
          ...qrResult, // qrImage, bankInfo, expiredAt
        };
      }

      return { success: true, order };

      // if (!qrResult.success) {
      //   // Vẫn cho đặt hàng thành công, nhưng cảnh báo QR lỗi
      //   return {
      //     success: true,
      //     order,
      //     qrImage: null,
      //     bankInfo: null,
      //     warning: "Đơn hàng đã tạo nhưng không tạo được QR thanh toán",
      //   };
      // }

      // return {
      //   success: true,
      //   order,
      //   qrImage: qrResult.qrImage,
      //   bankInfo: qrResult.bankInfo,
      //   expiredAt: qrResult.expiredAt,
      //   message: "Đặt hàng thành công! Vui lòng thanh toán bằng QR",
      // };
    } catch (error) {
      console.error("OrderController.createOrder:", error);
      return {
        success: false,
        message: "Hệ thống đang lỗi, vui lòng thử lại sau ít phút",
      };
    }
  }

  async searchOrders(userId) {
    try {
      const orders = await this.orderService.searchOrders(userId);
      return { success: true, orders };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const orderController = new OrderController();
export default orderController;
