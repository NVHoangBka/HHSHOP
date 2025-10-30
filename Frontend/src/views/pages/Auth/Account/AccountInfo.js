import React from 'react';

const AccountInfo = ({ currentUser }) => (
  <div>
    <h1 className="fs-3 fw-semibold mb-3">Thông tin tài khoản</h1>
    <div className="form-signup name-account m992 ps-4">
      <p className="fs-6">
        <span className="fw-semibold">Họ tên:</span> {currentUser.firstName} {currentUser.lastName}
      </p>
      <p className="fs-6">
        <span className="fw-semibold">Email:</span> {currentUser.email}
      </p>
      <p className="fs-6">
        <span className="fw-semibold">Số điện thoại:</span> {currentUser.phoneNumber || 'Chưa cung cấp'}
      </p>
    </div>
  </div>
);

export default AccountInfo;