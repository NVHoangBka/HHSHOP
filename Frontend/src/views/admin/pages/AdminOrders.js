// src/admin/pages/Orders.jsx
import React, { useEffect, useState } from "react";

const AdminOrders = ({ adminController }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await adminController.getOrdersAllAdmin();
        if (result.success) {
          setOrders(result.orders);
        }
      } catch (error) {}
    };

    fetchOrder();
  }, [adminController]);

  const updatePaymentStatus = () => {};

  const updateStatus = () => {};

  return (
    <div className="order-admin py-4">
      <div className="order-admin_header">
        <h2 className="mb-4 fw-bold text-uppercase">Quản lý đơn hàng</h2>
      </div>
      <div className="order-admin_content table-responsive ">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-success align-middle">
            <tr className="text-center">
              <th>Mã đơn</th>
              <th>Tên khách hàng</th>
              <th>SDT</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Hình thức TT</th>
              <th>Trạng thái TT</th>
              <th>Trạng thái ĐH</th>
              {/* <th>QR</th> */}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center fs-7 align-middle">
                <td>
                  <strong>#{order.orderId}</strong>
                </td>
                <td>{order.shippingAddress.recipientName}</td>
                <td>{order.shippingAddress.phoneNumber}</td>
                <td>
                  {order.shippingAddress.ward}-{order.shippingAddress.district}-
                  {order.shippingAddress.city}
                </td>
                <td className="text-danger fw-bold">
                  {order.totalAmount.toLocaleString("vi-VN")} VNĐ
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
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Đang chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
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
                {/* <td>
                  {order.paymentMethod === "BANK" && order.paymentQR && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#qrModal${order._id}`}
                    >
                      Xem QR
                    </button>
                  )}
                </td> */}
                <td>
                  <button className="btn btn-sm btn-success mx-1">
                    Cập nhật
                  </button>
                  <button className="btn btn-sm btn-danger mx-1">Xoá</button>
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
