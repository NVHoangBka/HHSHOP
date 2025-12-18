import api from "./api";
import AuthService from "./AuthService.js";

class OrderService {
  // === LẤY DANH SÁCH ĐƠN HÀNG ===
  async getOrders() {
    try {
      const response = await api.get("/orders");
      return response.data.orders;
    } catch (error) {
      return await this.handleAuthError(error, () => api.get("/orders"));
    }
  }

  // === TẠO ĐƠN HÀNG ===
  async createOrder(orderData) {
    try {
      const response = await api.post("/orders", orderData);
      return {
        success: true,
        order: response.data.order || response.data,
      };
    } catch (error) {
      return await this.handleAuthError(error, () =>
        api.post("/orders", orderData)
      );
    }
  }

  // === MỚI: TẠO QR THANH TOÁN (GỌI BACKEND → LƯU VÀO DB) ===
  async generatePaymentQR(orderId) {
    try {
      const response = await api.post("/payment/generate-qr", { orderId });

      if (!response.data.success) {
        throw new Error(response.data.message || "Không thể tạo QR");
      }

      return {
        success: true,
        qrImage: response.data.qrImage,
        bankInfo: response.data.bankInfo,
        expiredAt: response.data.expiredAt,
      };
    } catch (error) {
      return await this.handleAuthError(error, () =>
        api.post("/payment/generate-qr", { orderId })
      );
    }
  }

  // === Tìm kiếm đơn hàng theo người dùng ===
  async searchOrders(userId) {
    try {
      const response = await api.get("/orders/search", { params: { userId } });
      return response.data.orders;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
    }
  }

  // === HÀM XỬ LÝ LỖI 401 + TỰ ĐỘNG REFRESH TOKEN (DÙNG CHUNG) ===
  async handleAuthError(error, retryCallback) {
    const isAuthError =
      error.response?.status === 401 || error.response?.data?.expired;

    if (isAuthError) {
      const refreshResult = await AuthService.refreshToken();
      if (refreshResult.success) {
        try {
          const retryResponse = await retryCallback();
          return this.extractSuccessData(retryResponse);
        } catch (retryError) {
          AuthService.logout();
          window.location.href = "/login";
          return { success: false, message: "Phiên đăng nhập đã hết hạn" };
        }
      }
    }

    const msg = error.response?.data?.message || "Lỗi kết nối server";
    return { success: false, message: msg };
  }

  // === HÀM TRÍCH XUẤT DATA THÀNH CÔNG ===
  extractSuccessData(response) {
    if (response.data?.order) {
      return { success: true, order: response.data.order };
    }
    if (response.data?.qrImage) {
      return {
        success: true,
        qrImage: response.data.qrImage,
        bankInfo: response.data.bankInfo,
        expiredAt: response.data.expiredAt,
      };
    }
    return { success: true, ...response.data };
  }
}

export default OrderService;
