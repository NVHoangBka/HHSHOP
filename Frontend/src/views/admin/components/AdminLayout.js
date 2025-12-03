import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ onLoginAdmin, onLogoutAdmin, adminController }) => {
  const handleLogout = (e) => {
    e.preventDefault();
    onLogoutAdmin();
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">MINIMART – QUẢN TRỊ</span>
          <button onClick={handleLogout} className="btn btn-outline-light">
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-2 bg-white shadow-sm  p-0">
            <div className="list-group list-group-flush">
              <Link
                to="/admin/dashboard"
                className="list-group-item list-group-item-action py-3"
              >
                Tổng quan
              </Link>
              <Link
                to="/admin/products"
                className="list-group-item list-group-item-action py-3"
              >
                Sản phẩm
              </Link>
              <Link
                to="/admin/orders"
                className="list-group-item list-group-item-action py-3 "
              >
                Đơn hàng
              </Link>
              <Link
                to="/admin/users"
                className="list-group-item list-group-item-action py-3 "
              >
                Người dùng
              </Link>
              <Link
                to="/admin/setting"
                className="list-group-item list-group-item-action py-3 "
              >
                Cài đặt
              </Link>
            </div>
          </div>

          <div className="col-10 p-4 bg-success-subtle">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
