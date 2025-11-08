import AuthService from "../services/AuthService";

class OrderModel {
  async getOrders() {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        return result.orders;
      } else if (result.expired) {
        const refreshResult = await AuthService.refreshToken();
        if (refreshResult.success) {
          // Thử lại với token mới
          const retryResponse = await fetch(
            "http://localhost:5000/api/orders",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const retryResult = await retryResponse.json();
          if (retryResult.success) {
            return retryResult.orders;
          }
          throw new Error(retryResult.message || "Không thể tải đơn hàng.");
        }
        throw new Error("Phiên đăng nhập hết hạn.");
      }
      throw new Error(result.message || "Không thể tải đơn hàng.");
    } catch (error) {
      console.error("OrderModel getOrders error:", error);
      throw error;
    }
  }

  async getAddressCount(userId) {
    try {
      const response = await fetch("http://localhost:5000/api/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        return result.addresses.length;
      } else if (result.expired) {
        const refreshResult = await AuthService.refreshToken();
        if (refreshResult.success) {
          const retryResponse = await fetch(
            "http://localhost:5000/api/addresses",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const retryResult = await retryResponse.json();
          if (retryResult.success) {
            return retryResult.addresses.length;
          }
          throw new Error(
            retryResult.message || "Không thể tải danh sách địa chỉ."
          );
        }
        throw new Error("Phiên đăng nhập hết hạn.");
      }
      throw new Error(result.message || "Không thể tải danh sách địa chỉ.");
    } catch (error) {
      console.error("OrderModel getAddressCount error:", error);
      throw error;
    }
  }
}

export default OrderModel;
