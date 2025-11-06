import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../../components/ToastMessage";

const ChangePassword = ({authController}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải ít nhất 8 ký tự";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await authController.changePassword(
        formData.oldPassword,
        formData.newPassword
      );

      if (result.success) {
        setShowToast(true);
        setToastMessage("Đổi mật khẩu thành công! Đang đăng xuất...");
        setToastType("success");
        await authController.logout();
        navigate("/account/login");
      } else {
        setErrors({ oldPassword: result.message || "Mật khẩu cũ không đúng" });
      }
    } catch (err) {
      setErrors({ oldPassword: "Đã có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-background rounded-lg px-3 mb-6 ">
        <h1 className="fs-3 fw-semibold mb-3">Đổi mật khẩu</h1>
        <p className="fs-7">
          Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 8 kí tự
        </p>
        <form
          onSubmit={handleSubmit}
          id="change_customer_password"
        >
          <input name="FormType" type="hidden" value="change_customer_password" />
          <input name="utf8" type="hidden" value="true" />
          <div className="form-signup clearfix space-y-3 ">
            <fieldset className="form-group mb-3  ">
              <label
                className="label d-block mb-1 fs-7 text-secondary mb-1"
                for="oldPass"
              >
                Mật khẩu cũ <span className="error">*</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                id="oldPass"
                value={formData.oldPassword}
                onChange={handleChange}
                className="form-control w-50"
                required
              />
              {errors.oldPassword && (
              <p className="text-danger text-xs mt-1">{errors.oldPassword}</p>
              )}
            </fieldset>
            <fieldset className="form-group mb-3 ">
              <label
                className="label d-block mb-1 fs-7 text-secondary mb-1"
                for="changePass"
              >
                Mật khẩu mới <span className="error">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                id="changePass"
                required
                className="form-control w-50"
              />
              {errors.newPassword && (
              <p className="text-danger text-xs mt-1">{errors.newPassword}</p>
              )}
            </fieldset>
            <fieldset className="form-group mb-3 ">
              <label
                className="label d-block mb-1 fs-7 text-secondary mb-1"
                for="confirmPass"
              >
                Xác nhận lại mật khẩu <span className="error">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                id="confirmPass"
                required
                className="form-control w-50"
              />
              {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </fieldset>
            <button className="mt-3 ms-2 btn btn bg-success text-white btn-more rounded-pill fs-7 px-3 py-2">
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </div>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <ToastMessage
          show={showToast}
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      </div>
    </>
  );
};

export default ChangePassword;
