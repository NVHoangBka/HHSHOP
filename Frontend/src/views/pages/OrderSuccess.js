// src/views/pages/OrderSuccess.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, total, createdAt } = location.state || {};

  return (
    <div className="container py-5 text-center">
      <div className="my-5">
        <i
          className="bi bi-check-circle-fill text-success"
          style={{ fontSize: "5rem" }}
        ></i>
        <h1 className="mt-4 text-success fw-bold">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="lead">Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi</p>
      </div>

      {orderId && (
        <div
          className="bg-light p-4 rounded mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <h5>
            Mã đơn hàng: <strong className="text-success">{orderId}</strong>
          </h5>
          <p>
            Tổng tiền:{" "}
            <strong className="text-danger">{total?.toLocaleString()}₫</strong>
          </p>
          <small className="text-muted">
            Thời gian: {new Date(createdAt).toLocaleString("vi-VN")}
          </small>
        </div>
      )}

      <div className="mt-5">
        <Link to="/products/all" className="btn btn-success btn-lg me-3">
          Tiếp tục mua sắm
        </Link>
        <Link to="/account/orders" className="btn btn-outline-success btn-lg">
          Xem đơn hàng của tôi
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
