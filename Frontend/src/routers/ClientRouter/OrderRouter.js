import React from "react";
import { Route, Routes } from "react-router-dom";
import CheckOut from "../../views/client/pages/CheckoutPage/CheckOut";
import OrderSuccess from "../../views/client/pages/OrderSuccessPage/OrderSuccess";

const OrderRouter = ({ cartController, orderController, authController }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CheckOut
            cartController={cartController}
            orderController={orderController}
            authController={authController}
          />
        }
      />

      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  );
};

export default OrderRouter;
