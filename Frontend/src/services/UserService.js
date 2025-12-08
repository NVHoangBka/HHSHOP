import api from "./api.js";

class UserService {
  constructor() {}

  async getAllUsers(userData) {
    try {
      console.log(userData);
      const response = await api.get("/users/all", userData);
      console.log(response);
      const result = response.data;
      return { success: true, result };
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
