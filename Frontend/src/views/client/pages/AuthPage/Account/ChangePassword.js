import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";
import { useTranslation } from "react-i18next";

const ChangePassword = ({ authController }) => {
  // const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) {
      newErrors.oldPassword = t("account.change-password.errors.old-required");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("account.change-password.errors.new-required");
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("account.change-password.errors.min-length");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("account.change-password.errors.mismatch");
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
        setToastMessage(t("account.change-password.success"));
        setToastType("success");
        await authController.logout();
        setTimeout(() => {
          window.location.href = "/account/login";
        }, 1000);
      } else {
        setErrors({
          oldPassword:
            result.message || t("account.change-password.errors.old-incorrect"),
        });
      }
    } catch (err) {
      setErrors({ oldPassword: t("account.change-password.errors.common") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-background rounded-lg px-3 mb-6 ">
        <h1 className="fs-3 fw-semibold mb-3">
          {" "}
          {t("account.change-password.title")}
        </h1>
        <p className="fs-7">{t("account.change-password.description")}</p>
        <form onSubmit={handleSubmit} id="change_customer_password">
          <input
            name="FormType"
            type="hidden"
            value="change_customer_password"
          />
          <input name="utf8" type="hidden" value="true" />
          <div className="form-signup clearfix space-y-3 ">
            <fieldset className="form-group mb-3  ">
              <label
                className="label d-block mb-1 fs-7 text-secondary mb-1"
                for="oldPass"
              >
                {t("account.change-password.old-password")}{" "}
                <span className="error">*</span>
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
                {t("account.change-password.new-password")}{" "}
                <span className="error">*</span>
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
                {t("account.change-password.confirm-password")}{" "}
                <span className="error">*</span>
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
                <p className="text-danger text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </fieldset>
            <button className="mt-3 ms-2 btn btn bg-success text-white btn-more rounded-pill fs-7 px-3 py-2">
              {loading
                ? t("account.change-password.loading")
                : t("account.change-password.submit")}
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
