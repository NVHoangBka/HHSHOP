import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ToastMessage from "./components/ToastMessage/ToastMessage";

import titleController from "../../controllers/TitleController";
import AuthController from "../../controllers/AuthController";
import ProductController from "../../controllers/ProductController";
import CartController from "../../controllers/CartController";
import bannerController from "../../controllers/BannerController";
import orderController from "../../controllers/OrderController";
import categoryController from "../../controllers/CategoryController";

import ClientRouter from "../../routers/ClientRouter/ClientRouter";

const AppClient = () => {
  const navigate = useNavigate();
  const cartController = useRef(new CartController()).current;
  const authController = useRef(new AuthController()).current;
  const productController = useRef(new ProductController()).current;
  const [cartItems, setCartItems] = useState(cartController.getCartItems());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Toast helper với auto hide
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authController.getCurrentUser();
      setIsAuthenticated(!!user);
      const storedCart = cartController.getCartItems();
      if (
        storedCart.length > 0 &&
        JSON.stringify(storedCart) !== JSON.stringify(cartItems)
      ) {
        setCartItems(storedCart);
      }
    };
    checkAuth();
  }, [cartItems, authController, cartController]);

  const addToCart = (product) => {
    try {
      const updatedCart = cartController.addToCart(product);
      setCartItems([...updatedCart]);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng`, "success");
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const removeFromCart = (productId) => {
    try {
      const updatedCart = cartController.removeFromCart(productId);
      setCartItems([...updatedCart]);
    } catch (error) {
      showToast(error.message, "danger");
    }
  };

  const onLogin = async (email, password) => {
    const result = await authController.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
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
      showToast("Đăng xuất thành công", "success");
    } else {
      showToast(result.message, "danger");
    }
  };

  const onCartChange = (updatedCart) => {
    setCartItems([...updatedCart]);
  };

  return (
    <>
      <Header
        cartController={cartController}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        cartItems={cartItems}
        onCartChange={onCartChange}
        authController={authController}
        productController={productController}
        titleController={titleController}
        categoryController={categoryController}
      />
      <div>
        <ClientRouter
          isAuthenticated={isAuthenticated}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onLogin={onLogin}
          onRegister={onRegister}
          onCartChange={onCartChange}
          authController={authController}
          productController={productController}
          cartController={cartController}
          titleController={titleController}
          bannerController={bannerController}
          orderController={orderController}
          categoryController={categoryController}
        />
      </div>
      <Footer />
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
