// src/services/adminAxiosInterceptor.js
import api from "./api.js";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setupAdminInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Chỉ xử lý 401 cho các route admin
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url.includes("/admin/")
      ) {
        if (isRefreshing) {
          // Đang refresh → xếp hàng chờ
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Gọi refresh – backend tự đọc cookie admin_rt
          const res = await api.post("/admin/refresh-token");
          const { accessToken } = res.data;

          // Cập nhật token mới vào localStorage
          localStorage.setItem("adminAccessToken", accessToken);

          // Cập nhật header cho tất cả request sau
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh thất bại → mới logout thật
          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("adminLoggedIn");
          window.location.href = "/admin/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
