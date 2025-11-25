// src/router/AdminRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../../views/admin/components/AdminLayout";
// Admin Pages
import AdminLogin from "../../views/admin/pages/AdminLogin";
import AdminDashboard from "../../views/admin/pages/AdminDashboard";
import AdminProducts from "../../views/admin/pages/AdminProducts";
import AdminOrders from "../../views/admin/pages/AdminOrders";
import AdminUsers from "../../views/admin/pages/AdminUsers";
import AdminSetting from "../../views/admin/pages/AdminSetting";

const AdminRouter = (prop) => {
  return (
    <Routes>
      {/* Trang đăng nhập admin */}
      if(!prop.isAuthenticatedAdmin)
      {
        <Route
          path="/login"
          element={
            <AdminLogin
              adminController={prop.adminController}
              onLogin={prop.onLogin}
            />
          }
        />
      }
      else
      {
        /* Các trang trong admin – phải đăng nhập */
        <Route path="/" element={<AdminLayout />}>
          {/* Trang chủ admin */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Quản lý sản phẩm */}
          <Route path="products" element={<AdminProducts />} />
          {/* <Route path="products/add" element={<ProductForm />} /> */}
          {/* <Route path="products/edit/:id" element={<ProductForm />} /> */}

          {/* Có thể thêm sau */}
          <Route path="orders" element={<AdminOrders />} />
          {/* <Route path="stats" element={<StatsPage />} /> */}

          <Route path="users" element={<AdminUsers />} />

          <Route path="setting" element={<AdminSetting />} />
        </Route>
      }
    </Routes>
  );
};

export default AdminRouter;
