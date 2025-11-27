import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../views/client/pages/AuthPage/Login";
import Register from "../../views/client/pages/AuthPage/Register";
import Account from "../../views/client/pages/AuthPage/Account/Account";
import ResetPassword from "../../views/client/pages/AuthPage/Account/ChangePassword";

const AuthRouter = ({
  isAuthenticated,
  onLogin,
  onRegister,
  authController,
  productController,
  orderController,
}) => {
  // Nếu đã đăng nhập → vào trang hồ sơ
  if (isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/*"
          element={
            <Account
              authController={authController}
              orderController={orderController}
              productController={productController}
            />
          }
        />
      </Routes>
    );
  }
  // Nếu chưa đăng nhập → chỉ cho phép login/register
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={onLogin} authController={authController} />}
      />
      <Route
        path="/register"
        element={
          <Register
            onLogin={onLogin}
            onRegister={onRegister}
            authController={authController}
          />
        }
      />

      <Route
        path="/reset-password/*"
        element={<ResetPassword authController={authController} />}
      />
    </Routes>
  );
};

export default AuthRouter;
