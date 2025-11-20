// src/router/AdminRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import AdminLogin from "../views/admin/AdminLogin";
import AdminLayout from "../views/admin/AdminLayout";
import AdminDashboard from "../views/admin/AdminDashboard";
import ProductList from "../views/admin/ProductList";
import ProductForm from "../views/admin/ProductForm";

// Protected Route – Chỉ admin mới vào được
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Public Route – Nếu đã login rồi thì không cho vào login nữa
const PublicAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? <Navigate to="/admin" replace /> : children;
};

const AdminRouter = () => {
  return (
    <Routes>
      {/* Trang đăng nhập admin */}
      <Route
        path="/admin/login"
        element={
          <PublicAdminRoute>
            <AdminLogin />
          </PublicAdminRoute>
        }
      />

      {/* Các trang trong admin – phải đăng nhập */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* Trang chủ admin */}
        <Route index element={<AdminDashboard />} />

        {/* Quản lý sản phẩm */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />

        {/* Có thể thêm sau */}
        {/* <Route path="orders" element={<OrderList />} /> */}
        {/* <Route path="stats" element={<StatsPage />} /> */}
      </Route>

      {/* Redirect nếu gõ sai đường dẫn admin */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRouter;
