import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, authController }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await authController.login(email, password);
    console.log('Kết quả đăng nhập:', result);
    if (result.success) {
      onLogin(email, password);
      navigate('/');
    } else {
      setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className='bg-success-subtle'>
      <div className="container">
        <div className='row nav justify-content-start py-2 d-flex'>Trang chủ / Đăng nhập</div>
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card px-4">
              <div className="login-card">
                <div className='text-center my-3'>
                  <h1 className="fs-2 fw-semibold mb-2 mt-4">Đăng nhập tài khoản</h1>
                  <p className="text-center fst-normal fs-6 mb-0">
                    Bạn chưa có tài khoản? 
                    <a href="/account/register" className='fst-italic text-reset'> Đăng ký tại đây</a>
                  </p>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fs-6 opacity-75">Email *</label>
                    <input
                      type="email"
                      className="form-control input-group-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Email'
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fs-6 opacity-75">Mật khẩu *</label>
                    <input
                      type="password"
                      className="form-control input-group-lg"
                      id="password"
                      value={password}
                      placeholder='Mật khẩu'
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 text-end">
                    <a href="#" className="text-decoration-none text-small">Quên mật khẩu?</a>
                  </div>
                  <div className='text-center mb-3 py-3'>
                    <button type="submit" className="btn btn-lg w-50 bg-success text-white fw-semibold fs-6 rounded-pill">Đăng nhập</button>
                  </div>
                </form>

                <div className="text-center mt-3 fs-6 text-danger fw-light">Hoặc đăng nhập bằng</div>
                <div className='mt-2 mb-4 d-flex justify-content-center gap-3'>
                  <button className="btn btn-primary social-btn">
                    <i className="bi bi-facebook"></i> 
                    <span className='ms-2'>Facebook</span>
                  </button>
                  <button className="btn btn-danger social-btn">
                    <i className="bi bi-google"></i>
                    <span className='ms-2'>Google</span>
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