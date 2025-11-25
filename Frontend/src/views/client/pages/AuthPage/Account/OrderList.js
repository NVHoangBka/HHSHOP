import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderList = ({ orderController }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const result = await orderController.getOrders();
        if (result.success) {
          setOrders(result.orders);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("OrderList fetchOrders error:", error);
        setError(error.message || "Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center">Đang tải đơn hàng...</div>;
  }

  return (
    <div className="px-2 pt-1">
      <h1 className="fs-3 fw-semibold mb-3">Đơn hàng của bạn</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="text-center border-bottom align-middle">
              <th>Mã đơn hàng</th>
              <th>Ngày</th>
              <th>Tên</th>
              <th>SDT</th>
              <th>Địa chỉ</th>
              <th>Giá trị đơn hàng</th>
              <th>TT thanh toán</th>
              <th>Xem chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="fs-7 text-center">
                <td colSpan={6}>Không đơn hàng nào.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="fs-7 text-center align-middle"
                >
                  <td>{order.orderId}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{order.address.recipientName}</td>
                  <td>{order.address.phoneNumber}</td>
                  <td>
                    {order.address
                      ? `${order.address.ward}, ${order.address.district}, ${order.address.city} ` ||
                        `${order.address.addressList}`
                      : "Không có địa chỉ"}
                  </td>
                  <td>{order.total.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    {{
                      pending: "Đang xử lý",
                      shipped: "Đã giao",
                      canceled: "Đã hủy",
                    }[order.status] || "Không xác định"}
                  </td>
                  <td>
                    <Link
                      to={`/account/orders/${order.orderId}`}
                      className="text-primary"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
