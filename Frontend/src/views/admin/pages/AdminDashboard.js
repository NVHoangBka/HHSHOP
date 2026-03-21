// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AdminDashboard = ({ adminController }) => {
  const [t] = useTranslation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    countSuccessOrders: 0,
    countPendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [pendingPaymentOrders, setPendingPaymentOrders] = useState([]);
  const [pendingPaymentOrdersNew, setPendingPaymentOrderNew] = useState({
    ordersId: "",
    totalAmount: 0,
    subTotal: 0,
    paymentMethod: "",
    paymentStatus: "",
    createdAt: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await adminController.getOrdersAllAdmin();
        if (result.success) {
          const orders = result.orders || [];
          setPendingOrders(
            orders.filter((order) =>
              ["pending", "confirmed", "preparing", "shipped"].includes(
                order.status,
              ),
            ),
          );
          handleSetStatsOrder(orders);
          handleSetPaymentOrder(orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchStats();
  }, [adminController]);

  const handleSetStatsOrder = (orders) => {
    const totalOrders = orders.length;
    const countSuccessOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;
    const countPendingOrders = orders.filter((o) =>
      ["pending", "confirmed", "preparing", "shipped"].includes(o.status),
    ).length;
    const today = new Date();
    const todayOrders = orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.subTotal, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.subTotal, 0);
    setStats({
      totalOrders,
      countSuccessOrders,
      countPendingOrders,
      todayOrders,
      totalRevenue,
    });
  };

  const handleSetPaymentOrder = (orders) => {
    const pending = orders.filter((o) => o.paymentStatus === "pending");
    setPendingPaymentOrders(pending);
    setPendingPaymentOrderNew({
      ordersId: pending.map((o) => o.orderId),
      totalAmount: pending
        .reduce((sum, o) => sum + o.totalAmount, 0)
        .toLocaleString("vi-VN"),
      subTotal: pending
        .reduce((sum, o) => sum + o.subTotal, 0)
        .toLocaleString("vi-VN"),
      paymentMethod: pending.map((o) => o.paymentMethod),
      paymentStatus: pending.map((o) => o.paymentStatus),
      createdAt: pending.map((o) => o.createdAt),
    });
  };

  const getStatusText = (status) => {
    const map = {
      pending: t("admin.orders.status.pending"),
      confirmed: t("admin.orders.status.confirmed"),
      preparing: t("admin.orders.status.preparing"),
      shipped: t("admin.orders.status.shipped"),
      delivered: t("admin.orders.status.delivered"),
      canceled: t("admin.orders.status.canceled"),
      returned: t("admin.orders.status.returned"),
    };
    return map[status] || "Không xác định";
  };

  const getStatusClass = (status) => {
    const map = {
      pending: "bg-warning-subtle",
      confirmed: "bg-info-subtle",
      preparing: "bg-primary-subtle",
      shipped: "bg-secondary-subtle",
      delivered: "bg-success-subtle",
      canceled: "bg-danger-subtle",
      returned: "bg-dark-subtle",
    };
    return map[status] || "bg-light text-dark-subtle";
  };

  const statCards = [
    {
      label: t("admin.orders.total"),
      value: stats.totalOrders,
      bg: "bg-success",
      suffix: "",
    },
    {
      label: t("admin.orders.status.delivered"),
      value: stats.countSuccessOrders,
      bg: "bg-success",
      suffix: "",
    },
    {
      label: t("admin.orders.status.pending"),
      value: stats.countPendingOrders,
      bg: "bg-warning",
      suffix: "",
    },
    {
      label: t("admin.orders.totalRevenue"),
      value: stats.totalRevenue.toLocaleString("vi-VN"),
      bg: "bg-primary",
      suffix: "₫",
    },
    {
      label: t("admin.orders.todayRevenue"),
      value: stats.todayOrders.toLocaleString("vi-VN"),
      bg: "bg-danger",
      suffix: "₫",
    },
  ];

  return (
    <div className="container-fluid py-3 py-md-4">
      <h2 className="mb-4 fw-bold text-success fs-4 fs-md-2">
        ADMIN PANEL - HHSHOP
      </h2>

      {/* ── Stat Cards ── */}
      <div className="row g-3">
        {statCards.map((card, i) => (
          <div key={i} className="col-6 col-sm-4 col-lg">
            <div
              className={`card border-0 shadow-sm text-white h-100 ${card.bg}`}
            >
              <div className="card-body p-3">
                <p className="card-title small mb-1 opacity-75 lh-sm">
                  {card.label}
                </p>
                <h4 className="fw-bold mb-0 text-truncate">
                  {card.value}
                  {card.suffix}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tables ── */}
      <div className="row g-3 mt-2 mt-md-4">
        {/* Pending Orders */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 text-uppercase fw-bold">
                {t("admin.orders.status.pending")}
              </h6>
            </div>
            <div className="card-body d-flex flex-column p-3">
              <p className="mb-3 small">
                <strong>{t("admin.orders.status.pendingCount")}: </strong>
                <span className="fst-italic">
                  {stats.countPendingOrders || 0}
                </span>
              </p>

              <p className="mb-2 fw-bold small">
                {t("admin.orders.status.pendingList")}
              </p>

              {/* Scrollable table wrapper on small screens */}
              <div className="table-responsive flex-grow-1 mb-3">
                <table className="table table-sm table-bordered align-middle mb-0">
                  <thead className="table-success">
                    <tr className="text-center small">
                      <th>{t("admin.orders.orderId")}</th>
                      <th>{t("admin.orders.status.title")}</th>
                      <th>{t("admin.orders.totalAmount")}</th>
                      <th>{t("admin.orders.createdAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.countPendingOrders > 0 ? (
                      pendingOrders.map((order) => (
                        <tr key={order._id} className="text-center small">
                          <td className="text-nowrap">{order.orderId}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${getStatusClass(order.status)} text-dark`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="text-nowrap">
                            {order.totalAmount.toLocaleString("vi-VN")}₫
                          </td>
                          <td className="text-nowrap">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-muted small py-3"
                        >
                          {t("admin.orders.noOrders")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Link
                to="/admin/orders"
                className="btn btn-outline-success btn-sm w-100 mt-auto"
              >
                {t("admin.orders.status.viewAllPendingOrders")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0 text-uppercase fw-bold">
                {t("admin.orders.paymentStatus.pendingPayment")}
              </h6>
            </div>
            <div className="card-body d-flex flex-column p-3">
              <p className="mb-1 small">
                <strong>
                  {t("admin.orders.paymentStatus.pendingCount")}:{" "}
                </strong>
                <span className="fst-italic">
                  {pendingPaymentOrders.length || 0}
                </span>
              </p>
              <p className="mb-3 small">
                <strong>
                  {t("admin.orders.paymentStatus.pendingTotal")}:{" "}
                </strong>
                <span className="fst-italic">
                  {pendingPaymentOrdersNew.totalAmount || 0} VNĐ
                </span>
              </p>

              <p className="mb-2 fw-bold small">
                {t("admin.orders.paymentStatus.pendingList")}
              </p>

              <div className="table-responsive flex-grow-1 mb-3">
                <table className="table table-sm table-bordered align-middle mb-0">
                  <thead className="table-success">
                    <tr className="small">
                      <th>{t("admin.orders.orderId")}</th>
                      <th>{t("admin.orders.paymentMethods.title")}</th>
                      <th>{t("admin.orders.totalAmount")}</th>
                      <th>{t("admin.orders.createdAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPaymentOrders.length > 0 ? (
                      pendingPaymentOrders.map((order) => (
                        <tr key={order._id} className="small">
                          <td className="text-nowrap">{order.orderId}</td>
                          <td>
                            {order.paymentMethod === "COD"
                              ? t("admin.orders.paymentMethods.cod")
                              : t("admin.orders.paymentMethods.bankTransfer")}
                          </td>
                          <td className="text-nowrap">
                            {order.totalAmount.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="text-nowrap">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-muted small py-3"
                        >
                          {t("admin.orders.noOrders")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Link
                to="/admin/payments"
                className="btn btn-outline-danger btn-sm w-100 mt-auto"
              >
                {t("admin.orders.paymentStatus.viewAllQRPayments")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
