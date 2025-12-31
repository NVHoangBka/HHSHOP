// src/admin/pages/AdminLogin.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLoginAdmin }) => {
  const [t] = useTranslation();
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
      const result = await onLoginAdmin(email, password);

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
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
              {t("admin.login.title")}
            </h1>
            <h4 className="text-dark fw-semibold">
              {t("admin.login.description")}
            </h4>
            <p className="text-muted small">{t("admin.login.description")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                {t("admin.login.email")}
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="admin@hhshop.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                {t("admin.login.password")}
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-success btn-lg w-100 fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {t("admin.login.loading")}
                </>
              ) : (
                t("admin.login.loginButton")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
