// src/admin/pages/AdminLogin.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLoginAdmin }) => {
  const [t, i18n] = useTranslation();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: lưu vào localStorage để nhớ lần sau
    localStorage.setItem("i18n_lang_admin", lng);
  };

  const currentLang = i18n.language || "vi";

  const languages = (i18n.options.supportedLngs || ["vi", "en", "cz"]).filter(
    (lng) => lng !== "cimode",
  );

  const languageNames = {
    vi: t("language.vi"),
    en: t("language.en"),
    cz: t("language.cz"),
  };

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

        <div className="card-footer">
          <div className="d-flex justify-content-center links">
            {languages.map((language, index) => (
              <div
                key={index}
                className={
                  currentLang === language
                    ? "py-xl-2 bg-secondary-subtle"
                    : "py-xl-2"
                }
                onClick={() => {
                  changeLanguage(language);
                }}
              >
                <span
                  className={`${currentLang === language ? "fw-bold" : ""} px-4`}
                >
                  {languageNames[language]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
