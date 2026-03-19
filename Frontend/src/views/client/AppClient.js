import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import ToastMessage from "./components/ToastMessage/ToastMessage";
import FloatingButtons from "./components/FloatingButtons";
import PromotionModal from "./components/PromotionModal";

import ClientRouter from "../../routers/ClientRouter/ClientRouter";

import titleController from "../../controllers/TitleController";
import AuthController from "../../controllers/AuthController";
import ProductController from "../../controllers/ProductController";
import CartController from "../../controllers/CartController";
import bannerController from "../../controllers/BannerController";
import orderController from "../../controllers/OrderController";
import categoryController from "../../controllers/CategoryController";

const AppClient = () => {
  const navigate = useNavigate();

  const cartController = useRef(new CartController()).current;
  const authController = useRef(new AuthController()).current;
  const productController = useRef(new ProductController()).current;

  const [cart, setCart] = useState(cartController.getCart());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // ====================== TOAST ======================
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // ====================== KIỂM TRA AUTH KHI MOUNT ======================
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authController.getCurrentUser();
      setIsAuthenticated(!!user);
      if (user) {
        setIsAuthenticated(true);
        // Thông báo CartService biết user đã đăng nhập → sync giỏ từ server
        const updatedCart = await cartController.setAuthenticated(true);
        if (updatedCart) setCart(updatedCart);
      }
    };
    checkAuth();
  }, []);

  // ====================== GIỎ HÀNG ======================
  const addToCart = async (
    productId,
    variantValue = "default",
    quantity = 1,
    productData = null,
  ) => {
    try {
      const updatedCart = await cartController.addToCart(
        productId,
        variantValue,
        quantity,
        productData,
      );
      setCart(updatedCart);
      showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const removeFromCart = async (productId, variantValue = "default") => {
    try {
      const updatedCart = await cartController.removeFromCart(
        productId,
        variantValue,
      );
      setCart(updatedCart);
    } catch (error) {
      showToast(error.message || "Xóa sản phẩm thất bại", "danger");
    }
  };

  const updateQuantity = async (
    productId,
    variantValue = "default",
    quantity,
  ) => {
    try {
      const updatedCart = await cartController.updateQuantity(
        productId,
        variantValue,
        quantity,
      );
      setCart(updatedCart);
    } catch (error) {
      showToast(error.message || "Cập nhật thất bại", "danger");
    }
  };

  const onCartChange = (updatedCart) => {
    setCart(updatedCart);
  };

  // ====================== AUTH ======================
  const onLogin = async (email, password) => {
    const result = await authController.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      // Sync giỏ hàng sau khi đăng nhập (merge local → server)
      const updatedCart = await cartController.setAuthenticated(true);
      if (updatedCart) setCart(updatedCart);

      showToast("Đăng nhập thành công", "success");
      return true;
    } else {
      setIsAuthenticated(false);
      showToast(result.message, "danger");
      return false;
    }
  };

  const onRegister = async (newUser) => {
    const result = await authController.register(newUser);
    if (result.success) {
      setIsAuthenticated(true);
      const updatedCart = await cartController.setAuthenticated(true);
      if (updatedCart) setCart(updatedCart);

      showToast("Đăng ký thành công", "success");
      navigate("/account/info");
      return true;
    } else {
      setIsAuthenticated(false);
      showToast(result.message, "danger");
      return false;
    }
  };

  const onLogout = async () => {
    const result = await authController.logout();
    if (result.success) {
      setIsAuthenticated(false);

      cartController.setAuthenticated(false);
      await cartController.clearCart();
      setCart(cartController.getCart());

      // showToast("Đăng xuất thành công", "success");
      showToast("Đăng xuất thành công", "success");
    } else {
      showToast(result.message, "danger");
    }
  };

  return (
    <>
      <Header
        cartController={cartController}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        cart={cart}
        onCartChange={onCartChange}
        authController={authController}
        productController={productController}
        titleController={titleController}
        categoryController={categoryController}
      />
      <div>
        <ClientRouter
          isAuthenticated={isAuthenticated}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onLogin={onLogin}
          onRegister={onRegister}
          onCartChange={onCartChange}
          updateQuantity={updateQuantity}
          authController={authController}
          productController={productController}
          cartController={cartController}
          titleController={titleController}
          bannerController={bannerController}
          orderController={orderController}
          categoryController={categoryController}
        />
      </div>
      <PromotionModal />
      <FloatingButtons />
      <Footer />
      <MobileBottomBar cartCount={cart.totalQuantity} />
      <div className="toast-container position-fixed bottom-0 top-0 end-0">
        <ToastMessage
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </>
  );
};

export default AppClient;
