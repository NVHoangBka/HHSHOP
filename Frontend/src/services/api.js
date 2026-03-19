import axios from "axios";

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// INTERCEPTOR THÔNG MINH – TỰ ĐỘNG CHỌN TOKEN ĐÚNG!
api.interceptors.request.use((config) => {
  // ƯU TIÊN CAO NHẤT: Nếu đang ở trang /admin → dùng admin token
  const path = window.location.pathname;

  const token = path.startsWith("/admin")
    ? localStorage.getItem("adminAccessToken")
    : localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
