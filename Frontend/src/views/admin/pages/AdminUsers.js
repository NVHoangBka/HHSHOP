// src/admin/pages/Users.jsx
import React, { useEffect, useState } from "react";

const AdminUsers = ({ adminController }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await adminController.getUsersAllAdmin();
        if (result.success) {
          setUsers(result.users);
        }
      } catch (error) {}
    };

    fetchUser();
  }, [adminController]);

  const updatePaymentStatus = () => {};

  const updateStatus = () => {};

  return (
    <div className="user-admin py-4">
      <div className="user-admin_header">
        <h2 className="mb-4 fw-bold text-uppercase">Quản lý người dùng</h2>
      </div>
      <div className="user-admin_content table-responsive ">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-success">
            <tr className="text-center align-middles">
              <th>STT</th>
              <th>Email</th>
              <th>Họ Tên</th>
              <th>SDT</th>
              <th>Địa chỉ</th>
              <th>Ngày đăng ký</th>
              <th>Tổng đơn</th>
              <th>Tổng chi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="text-center fs-7 align-middle">
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>

                <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>{user.orderCount || 0}</td>
                <td>{user.totalOrder.toLocaleString("vi-VN") || 0} VNĐ</td>
                <td>
                  <button className="btn btn-sm btn-success mx-1">
                    Cập nhật
                  </button>
                  <button className="btn btn-sm btn-danger mx-1">Xoá</button>
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
