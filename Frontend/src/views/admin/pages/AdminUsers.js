// src/admin/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminUsers = ({ adminController }) => {
  const [t, i18n] = useTranslation();
  const [users, setUsers] = useState([]);

  // TÌM KIẾM: CHỈ BẤM ENTER MỚI LỌC
  const [searchInput, setSearchInput] = useState(""); // ô nhập liệu
  const [searchTerm, setSearchTerm] = useState(""); // từ khoá tìm kiếm chính thức

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

  const openModal = () => {
    // Mở modal thêm người dùng
  };
  // === LỌC KHI BẤM ENTER ===
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(searchInput.trim());
    }
    if (e.key === "Escape") {
      setSearchInput("");
      setSearchTerm("");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // Lọc chỉ theo tên sản phẩm (không phân biệt hoa thường)
  const filteredUsers = users.filter(
    (user) =>
      searchTerm === "" ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-admin py-4">
      <div className="user-admin_header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-success">
            {t("admin.users.title")}
          </h2>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div
            className="me-3 position-relative border rounded-pill py-1 bg-white py-2"
            style={{ width: "300px" }}
          >
            <input
              type="text"
              className="input-group border-0 mx-1 px-3 fs-6 outline-0 no-focus"
              placeholder={t("admin.users.searchPlaceholder")}
              value={searchInput}
              style={{ maxWidth: "230px" }}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <i className="bi bi-search position-absolute top-50 end-0 translate-middle fs-5"></i>

            {searchInput && (
              <button
                type="button"
                className="btn-close position-absolute top-50 end-0 translate-middle-y py-0 px-3 me-4 fs-7"
                onClick={clearSearch}
              ></button>
            )}
          </div>
          <button
            className="btn btn-success shadow "
            onClick={() => openModal()}
          >
            + {t("admin.users.addUser")}
          </button>
        </div>
      </div>
      <div className="user-admin_content table-responsive">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr className="text-center align-middle">
              <th>{t("admin.users.table.stt")}</th>
              <th>{t("admin.users.table.email")}</th>
              <th>{t("admin.users.table.name")}</th>
              <th>{t("admin.users.table.phone")}</th>
              <th>{t("admin.users.table.address")}</th>
              <th>{t("admin.users.table.registeredAt")}</th>
              <th>{t("admin.users.table.totalOrders")}</th>
              <th>{t("admin.users.table.totalSpent")}</th>
              <th>{t("admin.users.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
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
                    {t("btn.update")}
                  </button>
                  <button className="btn btn-sm btn-danger mx-1">
                    {t("btn.delete")}
                  </button>
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
