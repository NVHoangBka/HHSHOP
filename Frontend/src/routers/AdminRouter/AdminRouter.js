// src/router/AdminRouter.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Pages
import AdminLayout from "../../views/admin/components/AdminLayout";

import AdminLogin from "../../views/admin/pages/AdminLogin";
import AdminDashboard from "../../views/admin/pages/AdminDashboard";
import AdminProducts from "../../views/admin/pages/AdminProducts";
import AdminOrders from "../../views/admin/pages/AdminOrders";
import AdminUsers from "../../views/admin/pages/AdminUsers";
import AdminSetting from "../../views/admin/pages/AdminSetting";

const AdminRouter = ({
  isAuthenticatedAdmin,
  onLoginAdmin,
  onLogoutAdmin,
  adminController,
}) => {
  if (isAuthenticatedAdmin) {
    // Nếu đã đăng nhập → hiển thị toàn bộ admin
    return (
      <Routes>
        {/* === CÁC TRANG ADMIN – BẮT BUỘC ĐĂNG NHẬP === */}
        <Route
          element={
            // <ProtectedAdminRoute>
            <AdminLayout
              onLogoutAdmin={onLogoutAdmin}
              adminController={adminController}
            />
            // </ProtectedAdminRoute>
          }
        >
          {/* Trang mặc định khi vào /admin */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products/*" element={<AdminProducts />} />
          <Route
            path="orders/*"
            element={<AdminOrders adminController={adminController} />}
          />
          <Route path="users/*" element={<AdminUsers />} />
          <Route path="setting" element={<AdminSetting />} />

          {/* Nếu cần thêm nested route cho products */}
          {/* Ví dụ: /admin/products/add, /admin/products/edit/:id → để trong AdminProducts */}
        </Route>

        {/* Redirect mọi đường dẫn sai về dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // Nếu chưa đăng nhập → chỉ cho vào login
  return (
    <Routes>
      {/* === ĐĂNG NHẬP ADMIN === */}
      <Route
        path="login"
        element={<AdminLogin onLoginAdmin={onLoginAdmin} />}
      />
    </Routes>
  );
};

export default AdminRouter;
