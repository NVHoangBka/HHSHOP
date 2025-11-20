// src/admin/AdminDashboard.jsx
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Chào mừng đến với Admin Panel</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>Tổng sản phẩm</h5>
              <h2>168</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Đơn hàng hôm nay</h5>
              <h2>23</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5>Doanh thu tháng</h5>
              <h2>89.000.000₫</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
