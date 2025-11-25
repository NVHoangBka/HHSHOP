// src/admin/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin, adminController }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await adminController.login(email, password);

      if (result.success) {
        onLogin(email, password);
        // Chuyển vào dashboard
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h1
              className="fw-bold text-success mb-3"
              style={{ fontSize: "2.5rem" }}
            >
              HHSHOP
            </h1>
            <h4 className="text-dark fw-semibold">ĐĂNG NHẬP ADMIN</h4>
            <p className="text-muted small">Quản lý cửa hàng</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="admin@hhshop.vn"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Mật khẩu</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <button
              type="button"
              disabled={loading}
              className="btn btn-success btn-lg w-100 fw-bold"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "ĐĂNG NHẬP ADMIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
