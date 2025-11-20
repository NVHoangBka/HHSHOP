import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      // đổi mật khẩu này sau nhé
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Sai mật khẩu rồi bro");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body p-5">
                <h3 className="text-center mb-4">ADMIN LOGIN</h3>
                <form onSubmit={handleLogin}>
                  <input
                    type="password"
                    className="form-control form-control-lg mb-3"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-danger btn-lg w-100">
                    Đăng nhập
                  </button>
                </form>
                <p className="text-center mt-3 text-muted small">
                  Gợi ý: admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
