import React from "react";
import { Route, Routes } from "react-router-dom";
import Cart from "../../views/client/pages/CartPage/Cart";

const CartRouter = ({
  isAuthenticated,
  cart,
  removeFromCart,
  updateQuantity,
  cartController,
  onCartChange,
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Cart
            isAuthenticated={isAuthenticated}
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            cartController={cartController}
            onCartChange={onCartChange}
          />
        }
      />
    </Routes>
  );
};

export default CartRouter;
