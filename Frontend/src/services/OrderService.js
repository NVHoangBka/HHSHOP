import api from "./api";
import AuthService from "./AuthService.js";

class OrderService {
  constructor() {}

  async getOrders() {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.orders;
    } catch (error) {
      if (error.response?.data?.expired) {
        const refreshResult = await AuthService.refreshToken();
        if (refreshResult.success) {
          const retryResponse = await api.get("/orders", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          return retryResponse.data.orders;
        }
        throw new Error("Phiên đăng nhập hết hạn.");
      }
      throw new Error(
        error.response?.data?.message || "Không thể tải đơn hàng."
      );
    }
  }

  async createOrder(orderData) {
    try {
      const response = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return {
        success: true,
        order: response.data.order || response.data, // backend trả gì thì nhận
      };
    } catch (error) {
      // Xử lý token hết hạn → tự động refresh
      if (error.response?.status === 401 || error.response?.data?.expired) {
        const refreshResult = await AuthService.refreshToken();
        if (refreshResult.success) {
          // Thử lại lần nữa với token mới
          try {
            const retryResponse = await api.post("/orders", orderData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });
            return {
              success: true,
              order: retryResponse.data.order || retryResponse.data,
            };
          } catch (retryError) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn" };
          }
        }
      }

      const msg = error.response?.data?.message || "Không thể tạo đơn hàng";
      return { success: false, message: msg };
    }
  }
}

export default OrderService;
