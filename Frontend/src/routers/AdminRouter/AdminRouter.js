// src/router/AdminRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import AdminLogin from "../../views/admin/pages/AdminLogin";
import AdminLayout from "../../views/admin/pages/AdminLayout";
import AdminDashboard from "../../views/admin/pages/AdminDashboard";

const AdminRouter = (prop) => {
  return (
    <Routes>
      {/* Trang đăng nhập admin */}
      <Route
        path="/login"
        element={
          <AdminLogin
            adminController={prop.adminController}
            onLogin={prop.onLogin}
          />
        }
      />

      {/* Các trang trong admin – phải đăng nhập */}
      <Route path="/" element={<AdminLayout />}>
        {/* Trang chủ admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* Quản lý sản phẩm */}
        {/* <Route path="products" element={<ProductList />} /> */}
        {/* <Route path="products/new" element={<ProductForm />} /> */}
        {/* <Route path="products/edit/:id" element={<ProductForm />} /> */}

        {/* Có thể thêm sau */}
        {/* <Route path="orders" element={<OrderList />} /> */}
        {/* <Route path="stats" element={<StatsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRouter;
