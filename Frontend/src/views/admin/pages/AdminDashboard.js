// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = ({ adminController }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [pendingPaymentOrders, setPendingPaymentOrders] = useState([]);

  const [pendingPaymentOrders1, setPendingPaymentOrder1] = useState({
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

          const totalOrders = orders.length;
          const pendingOrders = orders.filter(
            (order) => order.status === "pending"
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

          const totalRevenue = orders.reduce(
            (sum, order) => sum + order.subTotal,
            0
          );

          setStats({
            totalOrders,
            pendingOrders,
            totalRevenue,
            todayOrders,
          });

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

          setPendingPaymentOrder1({
            ordersId: pendingPaymentOrders.map((order) => order.orderId),
            totalAmount: totalAmountPendingPayment,
            subTotal: subTotalPendingPayment,
            paymentMethod: pendingPaymentOrders.map(
              (order) => order.paymentMethod
            ),
            paymentStatus: pendingPaymentOrders.map(
              (order) => order.paymentStatus
            ),
            createdAt: pendingPaymentOrders.map((order) => order.createdAt),
          });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchStats();
  }, [adminController]);

  console.log("Pending Payment Orders:", pendingPaymentOrders1);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 fw-bold text-success">ADMIN PANEL - HHSHOP</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-lg text-white bg-success">
            <div className="card-body">
              <h5>Tổng đơn hàng</h5>
              <h2 className="fw-bold">{stats.totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-lg text-white bg-warning">
            <div className="card-body">
              <h5>Đơn chờ xử lý</h5>
              <h2 className="fw-bold">{stats.pendingOrders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-lg text-white bg-danger">
            <div className="card-body">
              <h5>Doanh thu hôm nay</h5>
              <h2 className="fw-bold">
                {stats.todayOrders.toLocaleString("vi-VN")}₫
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-lg text-white bg-primary">
            <div className="card-body">
              <h5>Tổng doanh thu</h5>
              <h2 className="fw-bold">
                {stats.totalRevenue.toLocaleString("vi-VN")}₫
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">ĐƠN HÀNG MỚI NHẤT</h5>
            </div>
            <div className="card-body">
              <Link
                to="/admin/orders"
                className="btn btn-outline-success w-100"
              >
                Xem tất cả đơn hàng →
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">THANH TOÁN CHỜ XÁC NHẬN</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Số đơn chờ thanh toán:</strong>
                {pendingPaymentOrders.length || 0}
              </div>
              <div className="mb-2">
                <strong>Tổng số tiền chờ thanh toán:</strong>
                {pendingPaymentOrders1.subTotal || 0}₫
              </div>
              <div className="mb-5">
                <p className="mb-2 fw-bold">
                  Danh sách đơn hàng chưa thanh toán
                </p>
                <table className="table ">
                  <thead className="table-success">
                    <tr>
                      <th>Đơn hàng</th>
                      <th>Phương thức TT</th>
                      <th>Số tiền</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPaymentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>
                          {order.paymentMethod === "COD"
                            ? "Thanh toán khi nhận hàng"
                            : "Chuyển khoản"}
                        </td>
                        <td>{order.subTotal.toLocaleString("vi-VN")}₫</td>
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
                Xem QR chờ xác nhận →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
