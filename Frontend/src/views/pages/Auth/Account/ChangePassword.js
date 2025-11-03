import React from "react";

const ChangePassword = () => {
  return (
    <div class="bg-background rounded-lg px-3 mb-6 ">
      <h1 class="fs-3 fw-semibold mb-3">Đổi mật khẩu</h1>
      <p className="fs-7">
        Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 8 kí tự
      </p>
      <form
        method="post"
        action="/account/changepassword"
        id="change_customer_password"
        accept-charset="UTF-8"
      >
        <input name="FormType" type="hidden" value="change_customer_password" />
        <input name="utf8" type="hidden" value="true" />
        <div class="form-signup clearfix space-y-3 ">
          <fieldset class="form-group mb-3  ">
            <label
              class="label d-block mb-1 fs-7 text-secondary mb-1"
              for="oldPass"
            >
              Mật khẩu cũ <span class="error">*</span>
            </label>
            <input
              type="password"
              name="OldPassword"
              id="OldPass"
              required=""
              class="form-control w-50"
            />
          </fieldset>
          <fieldset class="form-group mb-3 ">
            <label
              class="label d-block mb-1 fs-7 text-secondary mb-1"
              for="changePass"
            >
              Mật khẩu mới <span class="error">*</span>
            </label>
            <input
              type="password"
              name="Password"
              id="changePass"
              required=""
              class="form-control w-50"
            />
          </fieldset>
          <fieldset class="form-group mb-3 ">
            <label
              class="label d-block mb-1 fs-7 text-secondary mb-1"
              for="confirmPass"
            >
              Xác nhận lại mật khẩu <span class="error">*</span>
            </label>
            <input
              type="password"
              name="ConfirmPassword"
              id="confirmPass"
              required=""
              class="form-control w-50"
            />
          </fieldset>
          <button class="mt-3 ms-2 btn btn bg-success text-white btn-more rounded-pill fs-7 px-3 py-2">
            Đặt lại mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
