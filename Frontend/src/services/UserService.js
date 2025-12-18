import api from "./api.js";

class UserService {
  async getAllUsers(userData) {
    try {
      const response = await api.get("/users/all", {
        params: userData,
      });
      const result = response.data;
      return result;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại.",
        status: error.response?.status || 500,
      };
    }
  }
}

export default UserService;
