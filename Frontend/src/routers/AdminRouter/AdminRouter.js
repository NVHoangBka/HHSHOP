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
import AdminNews from "../../views/admin/pages/AdminNews";
import AdminTags from "../../views/admin/pages/AdminTags";

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

          <Route
            path="dashboard"
            element={<AdminDashboard adminController={adminController} />}
          />
          <Route
            path="products/*"
            element={<AdminProducts adminController={adminController} />}
          />
          <Route
            path="orders/*"
            element={<AdminOrders adminController={adminController} />}
          />
          <Route
            path="users/*"
            element={<AdminUsers adminController={adminController} />}
          />
          <Route
            path="news/*"
            element={<AdminNews adminController={adminController} />}
          />

          <Route
            path="tags/*"
            element={<AdminTags adminController={adminController} />}
          />
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
