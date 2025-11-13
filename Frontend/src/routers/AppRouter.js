import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthRouter from "./AuthRouter";
import ProductRouter from "./ProductRouter";
import CartRouter from "./CartRouter";
import Home from "../views/pages/Home";
import ProductController from "../controllers/ProductController"; // Giả định export instance
import AdminDashboard from "../views/admin/AdminDashboard";

const productController = new ProductController();

const AppRouter = ({
  isAuthenticated,
  cartItems,
  addToCart,
  removeFromCart,
  onLogin,
  onRegister,
  onCartChange,
  authController,
}) => {
  return (
    <Routes>
      {/* trang chủ */}
      <Route
        path="/"
        element={
          <Home addToCart={addToCart} productController={productController} />
        }
      />
      {/* Auth */}
      <Route
        path="/account/*"
        element={
          <AuthRouter
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
            onRegister={onRegister}
            authController={authController}
          />
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminDashboard
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
            authController={authController}
          />
        }
      />

      {/* Product */}
      <Route
        path="/products/*"
        element={
          <ProductRouter
            isAuthenticated={isAuthenticated}
            addToCart={addToCart}
            productController={productController}
          />
        }
      />

      {/* Cart */}
      <Route
        path="/cart/*"
        element={
          <CartRouter
            isAuthenticated={isAuthenticated}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            onCartChange={onCartChange}
          />
        }
      />
    </Routes>
  );
};

export default AppRouter;
