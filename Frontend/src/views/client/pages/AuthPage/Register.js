import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ onLogin, onRegister, authController }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;

    if (!emailRegex.test(email)) {
      setError(t("system.resgiter.error.invalid-email"));
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError(t("system.resgiter.error.password-min-length"));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t("system.resgiter.error.password-confirm-mismatch"));
      return false;
    }
    if (!firstName || !lastName) {
      setError(t("system.resgiter.error.full-name-required"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setLoading(true);
    try {
      const newUser = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
      };
      const registerResult = await onRegister(newUser);
      if (registerResult.success) {
        const loginResult = await authController.login(email, password);
        if (loginResult.success && onLogin) {
          onLogin(email, password);
          navigate("/");
        } else {
          setError(
            <>
              Đăng ký thành công nhưng đăng nhập thất bại.{" "}
              <a href="/account/login" className="text-primary">
                Đăng nhập thủ công
              </a>
              .
            </>
          );
        }
      } else {
        const message = registerResult.message || "Đăng ký không thành công.";
        setError(
          message === "Email đã tồn tại" ? "Email đã được sử dụng." : message
        );
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("Lỗi hệ thống, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-success-subtle">
      <div className="container">
        <div className="row nav justify-content-start py-2 d-flex">
          {t("header.home")} / {t("system.resgiter.title")}
        </div>
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card px-4">
              <div className="login-card">
                <div className="text-center my-3">
                  <h1 className="fs-2 fw-semibold mb-2 mt-4">
                    {t("system.resgiter.description")}
                  </h1>
                  <p className="text-center fst-normal fs-6 mb-0">
                    {t("system.resgiter.account")}
                    <Link to="/account/login" className="fst-italic text-reset">
                      {t("system.resgiter.login")}
                    </Link>
                  </p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="lastName"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.last-name")} *
                    </label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t("system.resgiter.last-name")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="firstName"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.first-name")} *
                    </label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t("system.resgiter.first-name")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.phone")} *
                    </label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t("system.resgiter.phone")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fs-6 opacity-75"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control input-group-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.password")} *
                    </label>
                    <input
                      type="password"
                      className="form-control input-group-lg"
                      id="password"
                      value={password}
                      placeholder={t("system.resgiter.password")}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.confirm-password")} *
                    </label>
                    <input
                      type="password"
                      className="form-control input-group-lg"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("system.resgiter.confirm-password")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="address"
                      className="form-label fs-6 opacity-75"
                    >
                      {t("system.resgiter.address")}
                    </label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("system.resgiter.address")}
                      required
                    />
                  </div>
                  <div className="text-center mb-3 py-3">
                    <button
                      type="submit"
                      className="btn btn-lg w-50 bg-success text-white fw-semibold fs-6 rounded-pill"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : t("system.resgiter.title")}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3 fs-6 text-danger fw-light">
                  {t("system.or-sign-with")}
                </div>
                <div className="mt-2 mb-4 d-flex justify-content-center gap-3">
                  <button className="btn btn-primary social-btn">
                    <i className="bi bi-facebook"></i>
                    <span className="ms-2">Facebook</span>
                  </button>
                  <button className="btn btn-danger social-btn">
                    <i className="bi bi-google"></i>
                    <span className="ms-2">Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
