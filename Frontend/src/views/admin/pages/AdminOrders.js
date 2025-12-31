// src/admin/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminOrders = ({ adminController }) => {
  const [t, i18n] = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [orderStatus, setOrderStatus] = useState({});

  // TÌM KIẾM: CHỈ BẤM ENTER MỚI LỌC
  const [searchInput, setSearchInput] = useState(""); // ô nhập liệu
  const [searchTerm, setSearchTerm] = useState(""); // từ khoá tìm kiế

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await adminController.getOrdersAllAdmin();
        if (result.success) {
          setOrders(result.orders);

          // Khởi tạo giá trị ban đầu cho các select
          const paymentMap = {};
          const statusMap = {};
          result.orders.forEach((order) => {
            paymentMap[order._id] = order.paymentStatus;
            statusMap[order._id] = order.status;
          });

          setPaymentStatus(paymentMap);
          setOrderStatus(statusMap);
        }
      } catch (error) {}
    };

    fetchOrder();
  }, [adminController]);

  const handlePaymentChange = (orderId, paymentStatus) => {
    setPaymentStatus((prev) => ({ ...prev, [orderId]: paymentStatus }));
  };

  const handleOrderStatusChange = (orderId, orderStatus) => {
    setOrderStatus((prev) => ({ ...prev, [orderId]: orderStatus }));
  };

  const handleUpdateOrder = async (orderId) => {
    const newPaymentStatus = paymentStatus[orderId];
    const newOrderStatus = orderStatus[orderId];

    try {
      await adminController.updateOrderPaymentStatus(orderId, newPaymentStatus);
      await adminController.updateOrderStatus(orderId, newOrderStatus);

      alert(t("admin.orders.updateSuccess"));
    } catch (error) {
      console.error(t("admin.orders.updateFailed"), error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    // Xử lý xoá đơn hàng
    try {
      await adminController.deleteOrder(orderId);
      // Cập nhật lại danh sách đơn hàng sau khi xoá
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {}
  };

  // === LỌC KHI BẤM ENTER ===
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(searchInput.trim());
    }
    if (e.key === "Escape") {
      setSearchInput("");
      setSearchTerm("");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // Lọc chỉ theo mã đơn hàng (không phân biệt hoa thường)
  const filteredOrders = orders.filter(
    (order) =>
      searchTerm === "" ||
      order.orderId
        .toLowerCase()
        .includes(searchTerm.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-admin py-4">
      <div className="order-admin_header d-flex justify-content-between mb-4 align-items-center">
        <h2 className="fw-bold text-uppercase text-success">
          {t("admin.orders.title")}
        </h2>
        <div
          className="me-3 position-relative border rounded-pill py-1 bg-white py-2"
          style={{ width: "300px" }}
        >
          <input
            type="text"
            className="input-group border-0 mx-1 px-3 fs-6 outline-0 no-focus"
            placeholder={t("admin.orders.searchPlaceholder")}
            value={searchInput}
            style={{ maxWidth: "230px" }}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <i className="bi bi-search position-absolute top-50 end-0 translate-middle fs-5"></i>

          {searchInput && (
            <button
              type="button"
              className="btn-close position-absolute top-50 end-0 translate-middle-y py-0 px-3 me-4 fs-7"
              onClick={clearSearch}
            ></button>
          )}
        </div>
      </div>
      <div className="order-admin_content table-responsive ">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-primary  align-middle">
            <tr className="text-center">
              <th>{t("admin.orders.table.stt")}</th>
              <th>{t("admin.orders.table.orderId")}</th>
              <th>{t("admin.orders.table.customer")}</th>
              <th>{t("admin.orders.table.phone")}</th>
              <th>{t("admin.orders.table.address")}</th>
              <th>{t("admin.orders.table.totalAmount")}</th>
              <th>{t("admin.orders.table.paymentMethod")}</th>
              <th>{t("admin.orders.table.paymentStatus")}</th>
              <th>{t("admin.orders.table.orderStatus")}</th>
              <th>{t("admin.orders.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="text-center fs-7 align-middle">
                <td>{index + 1}</td>
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
                  {order.totalAmount.toLocaleString("vi-VN")} đ
                </td>
                <td>
                  <span
                    className={`badge ${
                      order.paymentMethod === "BANK"
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={paymentStatus[order._id]}
                    onChange={(e) => {
                      handlePaymentChange(order._id, e.target.value);
                    }}
                  >
                    <option value="pending">
                      {t("admin.orders.paymentStatus.pending")}
                    </option>
                    <option value="paid">
                      {t("admin.orders.paymentStatus.paid")}
                    </option>
                    <option value="failed">
                      {t("admin.orders.paymentStatus.failed")}
                    </option>
                    <option value="refunded">
                      {t("admin.orders.paymentStatus.canceled")}
                    </option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={orderStatus[order._id]}
                    onChange={(e) =>
                      handleOrderStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="pending">
                      {t("admin.orders.status.pending")}
                    </option>
                    <option value="confirmed">
                      {t("admin.orders.status.confirmed")}
                    </option>
                    <option value="preparing">
                      {t("admin.orders.status.preparing")}
                    </option>
                    <option value="shipped">
                      {t("admin.orders.status.shipped")}
                    </option>
                    <option value="delivered">
                      {t("admin.orders.status.delivered")}
                    </option>
                    <option value="canceled">
                      {t("admin.orders.status.canceled")}
                    </option>
                    <option value="returned">
                      {t("admin.orders.status.returned")}
                    </option>
                  </select>
                </td>

                <td className="d-flex align-items-center">
                  <button
                    className="btn btn-success mx-1"
                    onClick={() => handleUpdateOrder(order._id)}
                  >
                    <i className="bi bi-floppy"></i>
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
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
