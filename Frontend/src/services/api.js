import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// INTERCEPTOR THÔNG MINH – TỰ ĐỘNG CHỌN TOKEN ĐÚNG!
api.interceptors.request.use((config) => {
  // ƯU TIÊN 1: Admin đang đăng nhập → dùng adminToken
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
    return config;
  }

  // ƯU TIÊN 2: Client đang đăng nhập → dùng accessToken
  const clientToken = localStorage.getItem("accessToken");
  if (clientToken) {
    config.headers.Authorization = `Bearer ${clientToken}`;
  }

  return config;
});

export default api;
