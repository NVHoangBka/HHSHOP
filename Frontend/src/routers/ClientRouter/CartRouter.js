import React from "react";
import { Route, Navigate } from "react-router-dom";
import Cart from "../../views/client/components/Header/Cart/Cart";
import CartController from "../../controllers/CartController";

const cartController = new CartController();

const CartRouter = ({ isAuthenticated, cartItems, removeFromCart }) => {
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            cartController={cartController}
          />
        </ProtectedRoute>
      }
    />
  );
};

export default CartRouter;
