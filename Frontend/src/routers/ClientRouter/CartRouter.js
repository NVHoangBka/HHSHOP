import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import Cart from "../../views/client/pages/CartPage/Cart";

const CartRouter = ({
  isAuthenticated,
  cartItems,
  removeFromCart,
  cartController,
  onCartChange,
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            cartController={cartController}
            onCartChange={onCartChange}
          />
        }
      />
    </Routes>
  );
};

export default CartRouter;
