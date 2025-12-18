import React, { useState, useEffect } from "react";

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
  }, [orderController]);

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
              <th>Hình thức thanh toán</th>
              <th>TT thanh toán</th>
              <th>TT đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="text-center">
                <td colSpan={9}>Chưa đơn hàng nào.</td>
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
                  <td>{order.shippingAddress.recipientName}</td>
                  <td>{order.shippingAddress.phoneNumber}</td>
                  <td>
                    {order.shippingAddress
                      ? `${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city} ` ||
                        `${order.shippingAddress.addressList}`
                      : "Không có địa chỉ"}
                  </td>
                  <td>{order.totalAmount.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    {{
                      COD: "COD",
                      BANK: "Chuyển Khoản",
                    }[order.paymentMethod] || "Không xác định"}
                  </td>
                  <td>
                    {{
                      pending: "Đang chờ thanh toán",
                      paid: "Đã thanh toán",
                      failed: "Thanh toán thất bại",
                      canceled: "Đã hoàn tiền",
                    }[order.paymentStatus] || "Không xác định"}
                  </td>
                  <td>
                    {{
                      pending: "Chờ xác nhận",
                      confirmed: "Đã xác nhận",
                      preparing: "Đang đóng gói",
                      shipped: "Đã giao cho bên vận chuyển",
                      delivered: "Đã giao thành công",
                      canceled: "Đã huỷ",
                      returned: "Khách trả hàng",
                    }[order.status] || "Không xác định"}
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
