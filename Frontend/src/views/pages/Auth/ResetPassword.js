// src/pages/account/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = ({ authController }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải ít nhất 8 ký tự!");
      return;
    }

    const result = await authController.resetPassword(token, password);
    if (result.success) {
      setMessage("Đặt lại mật khẩu thành công! Đang chuyển về đăng nhập...");
      setTimeout(() => {
        window.location.href = "/account/login";
      }, 2000);
    } else {
      setError(result.message || "Link đã hết hạn hoặc không hợp lệ!");
    }
  };

  return (
    <div className=" bg-success-subtle d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg p-5 rounded-4 border-0 ">
              <h2 className="text-center mb-4 fw-bold fst-italic fs-3 mb-5">
                Đặt lại mật khẩu
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg fs-6 py-2"
                    placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg fs-6 py-2"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-success w-50 btn-lg rounded-pill mt-5 text-white fw-bold fs-6 text-uppercase text-center d-block mx-auto"
                  type="submit"
                >
                  Xác nhận
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
