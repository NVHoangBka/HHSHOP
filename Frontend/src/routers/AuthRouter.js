import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../views/pages/Auth/Login';
import Register from '../views/pages/Auth/Register';
import Account from '../views/pages/Auth/Account/Account'

const AuthRouter = ({ isAuthenticated, onLogin, onRegister,authController}) => {
  // Nếu đã đăng nhập → vào trang hồ sơ
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<Account authController={authController} />} />
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
        element={<Register onLogin={onLogin} onRegister={onRegister} authController={authController} />} 
      />
    </Routes>
  );
};

export default AuthRouter;