import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({onLogin, onRegister, authController }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;

    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!firstName || !lastName) {
      setError('Họ và tên không được để trống');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    setLoading(true);
    try {
      const newUser = { email, password, firstName, lastName, phoneNumber, address: [address]};
      const registerResult = await onRegister(newUser);
      if (registerResult.success) {
        const loginResult = await authController.login(email, password);
        if (loginResult.success && onLogin) {
          onLogin(email, password);
          navigate('/');
        } else {
          setError(
            <>
              Đăng ký thành công nhưng đăng nhập thất bại.{' '}
              <a href="/account/login" className="text-primary">Đăng nhập thủ công</a>.
            </>
          );
        }
      } else {
        const message = registerResult.message || 'Đăng ký không thành công.';
        setError(message === 'Email đã tồn tại' ? 'Email đã được sử dụng.' : message);
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('Lỗi hệ thống, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-success-subtle'>
      <div className="container">
        <div className='row nav justify-content-start py-2 d-flex'>Trang chủ / Đăng Ký</div>
        <div className="row justify-content-center py-4">
          <div className="col-md-6">
            <div className="card px-4">
              <div className="login-card">
                <div className='text-center my-3'>
                  <h1 className="fs-2 fw-semibold mb-2 mt-4">Đăng ký tài khoản</h1>
                  <p className="text-center fst-normal fs-6 mb-0">
                    Bạn đã có tài khoản? 
                    <Link to="/account/login" className='fst-italic text-reset'> Đăng nhập tại đây</Link>
                  </p>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label fs-6 opacity-75">Họ *</label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder='Họ'
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label fs-6 opacity-75">Tên *</label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder='Tên'
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label fs-6 opacity-75">Số điện thoại *</label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder='Số điện thoại'
                      required
                    />
                  </div>
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
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fs-6 opacity-75">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      className="form-control input-group-lg"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label fs-6 opacity-75">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control input-group-lg"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Địa chỉ'
                      required
                    />
                  </div>
                  <div className='text-center mb-3 py-3'>
                    <button 
                      type="submit" 
                      className="btn btn-lg w-50 bg-success text-white fw-semibold fs-6 rounded-pill"
                      disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng Ký'}</button>
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

export default Register;