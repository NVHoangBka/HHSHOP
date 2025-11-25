import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
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
          <div className="col-md-2 bg-white shadow-sm min-vh-100 p-0">
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

          <div className="col-md-10 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
