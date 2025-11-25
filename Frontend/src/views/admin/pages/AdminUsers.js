// src/admin/pages/Users.jsx
import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Quản lý khách hàng</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-primary">
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Ngày đăng ký</th>
              <th>Tổng đơn</th>
              <th>Tổng chi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>{u.totalOrders || 0}</td>
                <td className="text-danger fw-bold">
                  {(u.totalSpent || 0).toLocaleString()}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
