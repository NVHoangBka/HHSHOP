// src/admin/pages/Settings.jsx
import React from "react";

const AdminSetting = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Cài đặt cửa hàng</h2>
      <div className="card shadow-lg">
        <div className="card-body">
          <h5>Thông tin ngân hàng nhận tiền</h5>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Ngân hàng:</strong> MB Bank
            </li>
            <li className="list-group-item">
              <strong>Chủ tài khoản:</strong> NGUYỄN VĂN HOÀNG
            </li>
            <li className="list-group-item">
              <strong>Số tài khoản:</strong> 0385427179
            </li>
          </ul>
          <hr />
          <h5>Thông tin liên hệ</h5>
          <p>
            Hotline/Zalo: <strong>0385427179</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetting;
