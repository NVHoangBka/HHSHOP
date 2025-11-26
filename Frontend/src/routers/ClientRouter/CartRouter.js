import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import Cart from "../../views/client/pages/CartPage/Cart";

const CartRouter = ({
  isAuthenticated,
  cartItems,
  removeFromCart,
  cartController,
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
          />
        }
      />
    </Routes>
  );
};

export default CartRouter;
