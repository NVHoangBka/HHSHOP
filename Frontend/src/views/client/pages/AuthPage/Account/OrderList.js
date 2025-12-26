import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const OrderList = ({ orderController }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

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
    return <div className="text-center">{t("account.orders.loading")}</div>;
  }

  return (
    <div className="px-xl-2 pt-xl-1">
      <h1 className="fs-3 fw-semibold mb-3">{t("account.orders.title")}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="text-center border-bottom align-middle">
              <th>{t("account.orders.order-id")}</th>
              <th>{t("account.orders.date")}</th>
              <th>{t("account.orders.name")}</th>
              <th>{t("account.orders.phone")}</th>
              <th>{t("account.orders.address")}</th>
              <th>{t("account.orders.order-total")}</th>
              <th>{t("account.orders.payment-method")}</th>
              <th>{t("account.orders.payment-status")}</th>
              <th>{t("account.orders.order-status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="text-center">
                <td colSpan={9}>{t("account.orders.no-order")}</td>
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
                  <td>{order.totalAmount.toLocaleString("vi-VN")} đ</td>
                  <td>
                    {{
                      COD: "COD",
                      BANK: "BANK",
                    }[order.paymentMethod] || "Không xác định"}
                  </td>
                  <td>
                    {t(
                      `account.orders.payment-status-values.${order.paymentStatus}`,
                      {
                        defaultValue: t("account.orders.unknown"),
                      }
                    )}
                  </td>
                  <td>
                    {t(`account.orders.order-status-values.${order.status}`, {
                      defaultValue: t("account.orders.unknown"),
                    })}
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
