import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin, authController }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await authController.login(email, password);
    console.log("Kết quả đăng nhập:", result);
    if (result.success) {
      onLogin(email, password);
      navigate("/");
    } else {
      setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
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
      alert("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      handleHideRecoverPassword();
    } else {
      setError(result.message || "Gửi email đặt lại mật khẩu thất bại.");
    }
  };

  return (
    <div className="bg-success-subtle">
      <div className="container">
        <div className="row nav justify-content-start py-2 d-flex">
          Trang chủ / Đăng nhập
        </div>
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card px-4">
              <div className="login-card">
                <div className="text-center my-3">
                  <h1 className="fs-2 fw-semibold mb-2 mt-4">
                    Đăng nhập tài khoản
                  </h1>
                  <p className="text-center fst-normal fs-6 mb-0">
                    Bạn chưa có tài khoản?
                    <Link
                      to="/account/register"
                      className="fst-italic text-reset"
                    >
                      {" "}
                      Đăng ký tại đây
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
                        Mật khẩu *
                      </label>
                      <input
                        type="password"
                        className="form-control input-group-lg"
                        id="password"
                        value={password}
                        placeholder="Mật khẩu"
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
                        Quên mật khẩu?
                      </p>
                    </div>
                    <div className="text-center mb-3 py-3">
                      <button
                        type="submit"
                        className="btn btn-lg w-50 bg-success text-white fw-semibold fs-6 rounded-pill"
                      >
                        Đăng nhập
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
                    <h2 class="fw-semibold mb-2 fs-5">Đặt lại mật khẩu</h2>
                    <p className="fs-6">
                      Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt
                      lại mật khẩu.
                    </p>
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
                        class="btn bg-success text-white w-50 font-semibold "
                        type="submit"
                      >
                        Lấy lại mật khẩu
                      </button>
                      <div className="d-flex align-items-center text-hover">
                        <i className="bi bi-arrow-left"></i>
                        <p
                          class="fs-6 mt-3 ms-1  text-decoration-underline"
                          onClick={handleHideRecoverPassword}
                        >
                          Quay lại
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="text-center mt-3 fs-6 text-danger fw-light">
                  Hoặc đăng nhập bằng
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
