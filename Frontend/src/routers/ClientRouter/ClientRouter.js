import { Routes, Route } from "react-router-dom";

// ===== Router Modules =====
import AuthRouter from "./AuthRouter";
import ProductRouter from "./ProductRouter";
import CartRouter from "./CartRouter";
import OrderRouter from "./OrderRouter";

// ===== Pages =====
import Home from "../../views/client/pages/HomePage/Home";
import Introduce from "../../views/client/pages/IntroducePage/Introduce";
import CheckOrder from "../../views/client/pages/CheckOrderPage/CheckOrder";

const ClientRouter = (props) => (
  <Routes>
    {/* trang chủ */}
    <Route
      path="/"
      element={
        <Home
          addToCart={props.addToCart}
          productController={props.productController}
          bannerController={props.bannerController}
          titleController={props.titleController}
        />
      }
    />

    {/* Giới thiệu */}
    <Route path="/introduce" element={<Introduce />} />

    {/* Kiểm tra đơn hàng */}
    <Route
      path="/check-order"
      element={
        <CheckOrder
          orderController={props.orderController}
          authController={props.authController}
        />
      }
    />

    {/* Auth */}
    <Route
      path="/account/*"
      element={
        <AuthRouter
          isAuthenticated={props.isAuthenticated}
          onLogin={props.onLogin}
          onRegister={props.onRegister}
          authController={props.authController}
          productController={props.productController}
          titleController={props.titleController}
          orderController={props.orderController}
          cartController={props.cartController}
        />
      }
    />
    {/* Product */}
    <Route
      path="/products/*"
      element={
        <ProductRouter
          isAuthenticated={props.isAuthenticated}
          addToCart={props.addToCart}
          productController={props.productController}
          titleController={props.titleController}
        />
      }
    />

    {/* Cart */}
    <Route
      path="/cart/*"
      element={
        <CartRouter
          isAuthenticated={props.isAuthenticated}
          cartItems={props.cartItems}
          removeFromCart={props.removeFromCart}
          onCartChange={props.onCartChange}
          cartController={props.cartController}
        />
      }
    />

    {/* Orders */}
    <Route
      path="/checkout/*"
      element={
        <OrderRouter
          cartController={props.cartController}
          orderController={props.orderController}
          authController={props.authController}
        />
      }
    />
  </Routes>
);

export default ClientRouter;
