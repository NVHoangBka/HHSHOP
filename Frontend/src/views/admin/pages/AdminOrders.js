// src/admin/pages/Orders.jsx
import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders));
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Quản lý đơn hàng</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-success">
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>PTTT</th>
              <th>Trạng thái</th>
              <th>QR</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>#{order.orderId}</strong>
                </td>
                <td>
                  {order.address.recipientName}
                  <br />
                  <small>{order.address.phoneNumber}</small>
                </td>
                <td className="text-danger fw-bold">
                  {order.total.toLocaleString()}₫
                </td>
                <td>
                  <span
                    className={`badge ${
                      order.paymentMethod === "BANK"
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {order.paymentMethod === "BANK" ? "Chuyển khoản" : "COD"}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="shipped">Đã giao</option>
                    <option value="delivered">Hoàn thành</option>
                    <option value="canceled">Hủy</option>
                  </select>
                </td>
                <td>
                  {order.paymentMethod === "BANK" && order.paymentQR && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#qrModal${order._id}`}
                    >
                      Xem QR
                    </button>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-success">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
