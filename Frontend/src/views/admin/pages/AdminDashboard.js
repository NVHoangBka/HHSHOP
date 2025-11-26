// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });

  useEffect(() => {
    // Gọi API thống kê
  }, []);

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
              <h2 className="fw-bold">{stats.todayOrders.toLocaleString()}₫</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-lg text-white bg-primary">
            <div className="card-body">
              <h5>Tổng doanh thu</h5>
              <h2 className="fw-bold">
                {stats.totalRevenue.toLocaleString()}₫
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
