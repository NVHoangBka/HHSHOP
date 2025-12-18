import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// INTERCEPTOR THÔNG MINH – TỰ ĐỘNG CHỌN TOKEN ĐÚNG!
api.interceptors.request.use((config) => {
  // ƯU TIÊN CAO NHẤT: Nếu đang ở trang /admin → dùng admin token
  if (window.location.pathname.startsWith("/admin")) {
    const adminToken = localStorage.getItem("adminAccessToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // Nếu không phải admin → dùng token user bình thường
    const userToken = localStorage.getItem("accessToken");
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }

  return config;
});

export default api;
