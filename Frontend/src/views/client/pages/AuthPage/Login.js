import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin, authController }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await authController.login(email, password);
    if (result.success) {
      onLogin(email, password);
      navigate("/");
    } else {
      setError(result.message || t("system.login.error.invalid-credentials"));
    }
  };

  const handleShơwRecoverPassword = () => {
    const loginForm = document.getElementById("login");
    const recoverForm = document.getElementById("recover-password");
    loginForm.style.display = "none";
    recoverForm.style.display = "block";
  };

  const handleHideRecoverPassword = () => {
    const loginForm = document.getElementById("login");
    const recoverForm = document.getElementById("recover-password");
    loginForm.style.display = "block";
    recoverForm.style.display = "none";
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    const result = await authController.recoverPassword(recoverEmail);
    if (result.success) {
      alert(t("system.login.error.check-email-reset-password"));
      handleHideRecoverPassword();
    } else {
      setError(result.message || t("reset-password-email-failed"));
    }
  };

  return (
    <div className="bg-success-subtle">
      <div className="container">
        <div className="row nav justify-content-start py-2 d-flex">
          {t("header.home")} / {t("system.login.title")}
        </div>
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card px-4">
              <div className="login-card">
                <div className="text-center my-3">
                  <h1 className="fs-2 fw-semibold mb-2 mt-4">
                    {t("system.login.description")}
                  </h1>
                  <p className="text-center fst-normal fs-6 mb-0">
                    {t("system.login.no-account")}
                    <Link
                      to="/account/register"
                      className="fst-italic text-reset"
                    >
                      {t("system.login.sign-up")}
                    </Link>
                  </p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <div id="login">
                  <form onSubmit={handleSubmit}>
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
                        {t("system.password")} *
                      </label>
                      <input
                        type="password"
                        className="form-control input-group-lg"
                        id="password"
                        value={password}
                        placeholder={t("system.password")}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3 text-end">
                      <p
                        className="text-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleShơwRecoverPassword}
                      >
                        {t("system.forgot-pass")}
                      </p>
                    </div>
                    <div className="text-center mb-3 py-3">
                      <button
                        type="submit"
                        className="btn btn-lg w-50 bg-success text-white fw-semibold fs-6 rounded-pill"
                      >
                        {t("system.login.title")}
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  id="recover-password"
                  style={{ display: "none" }}
                  class="form-signup page-login text-center"
                >
                  <div class="mb-3">
                    <h2 class="fw-semibold mb-2 fs-5">
                      {t("system.reset-pass.title")}
                    </h2>
                    <p className="fs-6">{t("system.des-pass")}</p>
                  </div>

                  <form onSubmit={handleForgotPassword}>
                    <div class="form-signup">
                      <fieldset class="form-group">
                        <input
                          type="email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                          class="form-input w-100 px-3 py-2 color-black border rounded-3"
                          name="Email"
                          value={recoverEmail}
                          onChange={(e) => setRecoverEmail(e.target.value)}
                          placeholder="Email"
                          required
                        />
                      </fieldset>
                    </div>

                    <div class="action_bottom my-3 d-flex justify-content-center align-items-center mt-5 flex-column">
                      <button
                        class="btn bg-success text-white w-50 fw-semibold "
                        type="submit"
                      >
                        {t("system.recover-pass")}
                      </button>
                      <div className="d-flex align-items-center text-hover">
                        <i className="bi bi-arrow-left"></i>
                        <p
                          class="fs-6 mt-3 ms-1  text-decoration-underline"
                          onClick={handleHideRecoverPassword}
                        >
                          {t("btn.back")}
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
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

export default Login;
