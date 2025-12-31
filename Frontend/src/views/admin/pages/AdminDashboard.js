// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AdminDashboard = ({ adminController }) => {
  const [t, i18n] = useTranslation();
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
            orders.filter(
              (order) =>
                order.status === "pending" ||
                order.status === "confirmed" ||
                order.status === "preparing" ||
                order.status === "shipped"
            )
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
      (order) => order.status === "delivered"
    ).length;
    const countPendingOrders = orders.filter(
      (order) =>
        order.status === "pending" ||
        order.status === "confirmed" ||
        order.status === "preparing" ||
        order.status === "shipped"
    ).length;
    const todayOrders = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, order) => sum + order.subTotal, 0);

    const totalRevenue = orders.reduce((sum, order) => sum + order.subTotal, 0);

    setStats({
      totalOrders,
      countSuccessOrders: countSuccessOrders || 0,
      countPendingOrders: countPendingOrders || 0,
      todayOrders,
      totalRevenue,
    });
  };

  const handleSetPaymentOrder = (orders) => {
    const pendingPaymentOrders = orders.filter(
      (order) => order.paymentStatus === "pending"
    );

    setPendingPaymentOrders(pendingPaymentOrders);

    const subTotalPendingPayment = pendingPaymentOrders
      .reduce((sum, order) => sum + order.subTotal, 0)
      .toLocaleString("vi-VN");

    const totalAmountPendingPayment = pendingPaymentOrders
      .reduce((sum, order) => sum + order.totalAmount, 0)
      .toLocaleString("vi-VN");

    setPendingPaymentOrderNew({
      ordersId: pendingPaymentOrders.map((order) => order.orderId),
      totalAmount: totalAmountPendingPayment,
      subTotal: subTotalPendingPayment,
      paymentMethod: pendingPaymentOrders.map((order) => order.paymentMethod),
      paymentStatus: pendingPaymentOrders.map((order) => order.paymentStatus),
      createdAt: pendingPaymentOrders.map((order) => order.createdAt),
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return t("admin.orders.status.pending");
      case "confirmed":
        return t("admin.orders.status.confirmed");
      case "preparing":
        return t("admin.orders.status.preparing");
      case "shipped":
        return t("admin.orders.status.shipped");
      case "delivered":
        return t("admin.orders.status.delivered");
      case "canceled":
        return t("admin.orders.status.canceled");
      case "returned":
        return t("admin.orders.status.returned");
      default:
        return "Không xác định";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "btn-smail bg-warning-subtle";
      case "confirmed":
        return "btn-smail bg-info-subtle";
      case "preparing":
        return "btn-smail bg-primary-subtle";
      case "shipped":
        return "btn-smail bg-secondary-subtle";
      case "delivered":
        return "btn-smail bg-success-subtle";
      case "canceled":
        return "btn-smail bg-danger-subtle";
      case "returned":
        return "btn-smail bg-dark-subtle";
      default:
        return "btn-smail bg-light text-dark-subtle";
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 fw-bold text-success">ADMIN PANEL - HHSHOP</h2>

      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col">
              <div className="card border-0 shadow-lg text-white bg-success">
                <div className="card-body">
                  <h5>{t("admin.orders.total")}</h5>
                  <h2 className="fw-bold">{stats.totalOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 shadow-lg text-white bg-success">
                <div className="card-body">
                  <h5>{t("admin.orders.status.delivered")}</h5>
                  <h2 className="fw-bold">{stats.countSuccessOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 shadow-lg text-white bg-warning">
                <div className="card-body">
                  <h5>{t("admin.orders.status.pending")}</h5>
                  <h2 className="fw-bold">{stats.countPendingOrders}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col">
              <div className="card border-0 shadow-lg text-white bg-primary">
                <div className="card-body">
                  <h5>{t("admin.orders.totalRevenue")}</h5>
                  <h2 className="fw-bold">
                    {stats.totalRevenue.toLocaleString("vi-VN")}₫
                  </h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 shadow-lg text-white bg-danger">
                <div className="card-body">
                  <h5>{t("admin.orders.todayRevenue")}</h5>
                  <h2 className="fw-bold">
                    {stats.todayOrders.toLocaleString("vi-VN")}₫
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0 text-uppercase">
                {t("admin.orders.status.pending")}
              </h5>
            </div>
            <div
              className="card-body d-flex justify-content-between flex-column"
              style={{ minHeight: "350px" }}
            >
              <div className="mb-2">
                <strong>{t("admin.orders.status.pendingCount")}: </strong>
                <b className="fst-italic">{stats.countPendingOrders || 0}</b>
              </div>
              <div className="mb-5">
                <p className="mb-2 fw-bold">
                  {t("admin.orders.status.pendingList")}
                </p>
                <table className="table border">
                  <thead className="table-success ">
                    <tr className="text-center">
                      <th>{t("admin.orders.orderId")}</th>
                      <th>{t("admin.orders.status.title")}</th>
                      <th>{t("admin.orders.totalAmount")}</th>
                      <th>{t("admin.orders.createdAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.countPendingOrders > 0 ? (
                      pendingOrders.map((order) => {
                        return (
                          <tr key={order._id} className="text-center">
                            <td>{order.orderId}</td>
                            <td className={getStatusClass(order.status)}>
                              {getStatusText(order.status)}
                            </td>
                            <td>
                              {order.totalAmount.toLocaleString("vi-VN")}₫
                            </td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          {t("admin.orders.noOrders")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Link
                to="/admin/orders"
                className="btn btn-outline-success w-100"
              >
                {t("admin.orders.status.viewAllPendingOrders")} →
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0 text-uppercase">
                {t("admin.orders.paymentStatus.pendingPayment")}
              </h5>
            </div>
            <div
              className="card-body d-flex justify-content-between flex-column"
              style={{ minHeight: "350px" }}
            >
              <div className="mb-2">
                <strong>
                  {t("admin.orders.paymentStatus.pendingCount")}:{" "}
                </strong>
                <b className="fst-italic">{pendingPaymentOrders.length || 0}</b>
              </div>
              <div className="mb-2">
                <strong>
                  {t("admin.orders.paymentStatus.pendingTotal")}:{" "}
                </strong>
                <b className="fst-italic">
                  {pendingPaymentOrdersNew.totalAmount || 0} VNĐ
                </b>
              </div>
              <div className="mb-5">
                <p className="mb-2 fw-bold">
                  {t("admin.orders.paymentStatus.pendingList")}
                </p>
                <table className="table ">
                  <thead className="table-success">
                    <tr>
                      <th>{t("admin.orders.orderId")}</th>
                      <th>{t("admin.orders.paymentMethods.title")}</th>
                      <th>{t("admin.orders.totalAmount")}</th>
                      <th>{t("admin.orders.createdAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPaymentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>
                          {order.paymentMethod === "COD"
                            ? t("admin.orders.paymentMethods.cod")
                            : t("admin.orders.paymentMethods.bankTransfer")}
                        </td>
                        <td>{order.totalAmount.toLocaleString("vi-VN")} ₫</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                to="/admin/payments"
                className="btn btn-outline-danger w-100"
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
