import React, { useState } from "react";
import countries from "../../../../data/countries";

const AddressList = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className=" rounded-lg px-3 mb-6">
      <div className="d-flex justify-content-between align-items-center flex-wrap pb-4 border-bottom">
        <h1 className="fs-4 fw-semibold mb-2">Địa chỉ của bạn</h1>
        <button
          type="button"
          className="fw-semibold d-flex align-items-center rounded-pill btn bg-success text-white btn-more px-4 py-2"
          data-bs-toggle="modal"
          data-bs-target="#addAddressModal"
        >
          <i className="bi bi-plus-lg me-1"></i>Thêm địa chỉ
        </button>
      </div>
      <div
        className="modal fade"
        id="addAddressModal"
        tabIndex="-1"
        aria-labelledby="addAddressModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="title_pop fs-6 fw-bold text-uppercase">
                Thêm địa chỉ mới
              </h2>
              <div className="btn-close closed_pop">
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
            <div className="modal-body">
              <form
                method="post"
                action="/account/addresses"
                id="customer_address"
                accept-charset="UTF-8"
              >
                <input name="FormType" type="hidden" value="customer_address" />
                <input name="utf8" type="hidden" value="true" />
                <div className="pop_bottom">
                  <div className="form_address">
                    <div class="field">
                      <fieldset class="form-group">
                        <label>Họ tên</label>
                        <input
                          required=""
                          type="text"
                          name="FullName"
                          class="form-control"
                          value=""
                        />
                      </fieldset>
                      <p class="error-msg"></p>
                    </div>
                    <div class="field">
                      <fieldset class="form-group">
                        <label>Số điện thoại</label>
                        <input
                          required=""
                          type="number"
                          class="form-control"
                          id="Phone"
                          pattern="\d+"
                          name="Phone"
                          maxlength="12"
                          value=""
                        />
                      </fieldset>
                    </div>
                    <div class="field">
                      <label>Công ty</label>
                      <fieldset class="form-group">
                        <input
                          type="text"
                          class="form-control"
                          name="Company"
                          value=""
                        />
                      </fieldset>
                    </div>
                    <div class="field">
                      <fieldset class="form-group">
                        <label>Địa chỉ</label>
                        <input
                          required=""
                          type="text"
                          class="form-control"
                          name="Address1"
                          value=""
                        />
                      </fieldset>
                    </div>
                    <div class="field">
                      <fieldset class="form-group select-field">
                        <label>Quốc gia</label>
                        <select
                          name="Country"
                          class="form-control"
                          id="mySelect1"
                          defaultValue="VN"
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </fieldset>
                    </div>
                    <div class="group-country row w-100">
                      <fieldset class="form-group select-field col">
                        <label>Tỉnh thành</label>
                        <select
                          name="Province"
                          value=""
                          class="form-control add has-content"
                          id="mySelect2"
                          data-address-type="province"
                          data-address-zone="billing"
                          data-select2-id="select2-data-billingProvince"
                        ></select>
                      </fieldset>
                      <fieldset class="form-group select-field col">
                        <label>Quận huyện</label>
                        <select
                          name="District"
                          class="form-control add has-content"
                          value=""
                          id="mySelect3"
                          data-address-type="district"
                          data-address-zone="billing"
                          data-select2-id="select2-data-billingDistrict"
                          disabled="disabled"
                        ></select>
                      </fieldset>
                      <fieldset class="form-group select-field col">
                        <label>Phường xã</label>
                        <select
                          name="Ward"
                          class="form-control add has-content"
                          value=""
                          id="mySelect4"
                          data-address-type="ward"
                          data-address-zone="billing"
                          data-select2-id="select2-data-billingWard"
                          disabled="disabled"
                        ></select>
                      </fieldset>
                    </div>
                    <div class="field">
                      <fieldset class="form-group">
                        <label>Mã Zip</label>
                        <input
                          type="text"
                          class="form-control"
                          name="Zip"
                          value=""
                        />
                      </fieldset>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-lg btn-dark-address btn-outline article-readmore btn-close"
                type="button"
                onclick="Bizweb.CustomerAddress.toggleNewForm(); return false;"
              >
                <span>Hủy</span>
              </button>
              <button
                className="btn btn-lg btn-primary bg-primary text-white font-semibold btn-submit"
                id="addnew"
                type="submit"
              >
                <span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row total_address mt-4 fs-7">
        <div
          id="view_address_38391829"
          className="customer_address col-xs-12 col-lg-12 col-md-12 col-xl-12"
        >
          <div className="address_info d-flex justify-content-between">
            <div className="address-group">
              <div className="address form-signup">
                <p>
                  <strong>Họ tên: </strong> nguyen hoang
                </p>
                <p>
                  <strong>Địa chỉ: </strong>
                  Phường Lê Lợi, Thị xã Sơn Tây, Hà Nội, Vietnam
                </p>

                <p>
                  <strong>Số điện thoại:</strong> +84385427179
                </p>
              </div>
              <div>
                <span className="border py-1 px-2 text-danger border-danger">
                  Mặc định
                </span>
              </div>
            </div>
            <div id="tool_address_38391829" className="btn-address">
              <div className="btn-row d-flex">
                <button
                  className="btn-edit-addr btn btn-edit p-1 fw-semibold text-primary border-0"
                  type="button"
                  data-form="edit_address_38391829"
                  aria-controls="edit_address_38391829"
                >
                  <span>Cập nhật</span>
                </button>
                <button
                  className="hidden btn btn-dark-address btn-edit-addr btn-delete text-danger"
                  type="button"
                  onclick="Bizweb.CustomerAddress.destroy(38391829);return false"
                >
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="edit_address_38391829"
          className="form-list modal_address modal modal_edit_address"
        >
          <div className="btn-close closed_pop">
            <i className="icon icon-cross"></i>
          </div>
          <h2 className="title_pop">Chỉnh sửa địa chỉ</h2>
          <form
            method="post"
            action="/account/addresses/38391829"
            id="customer_address"
            accept-charset="UTF-8"
          >
            <input name="FormType" type="hidden" value="customer_address" />
            <input name="utf8" type="hidden" value="true" />
            <div className="pop_bottom">
              <div className="form_address">
                <div className="field">
                  <fieldset className="form-group">
                    <input
                      type="text"
                      name="FullName"
                      className="form-control has-content"
                      required=""
                      value=" nguyen hoang"
                      autocapitalize="words"
                    />
                    <label>Họ tên</label>
                  </fieldset>
                  <p className="error-msg"></p>
                </div>
                <div className="field">
                  <fieldset className="form-group">
                    <input
                      type="number"
                      pattern="\d+"
                      className="form-control"
                      id="Phone"
                      name="Phone"
                      maxlength="12"
                      value="+84385427179"
                    />
                    <label>Số điện thoại</label>
                  </fieldset>
                </div>
                <div className="field">
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="Company"
                      value=""
                    />
                    <label>Công ty</label>
                  </fieldset>
                </div>
                <div className="field">
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="Address1"
                      value=""
                    />
                    <label>Địa chỉ</label>
                  </fieldset>
                </div>
                <div className="field">
                  <fieldset className="form-group select-field">
                    <label>Quốc gia</label>
                    <select
                      name="Country"
                      class="form-control"
                      id="mySelect1"
                      defaultValue="VN"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>
                <div className="group-country">
                  <fieldset className="form-group select-field not-vn">
                    <label>Tỉnh thành</label>
                    <select
                      name="Province"
                      value="Hà Nội"
                      data-default="Hà Nội"
                      className="form-control add province myselect has-content"
                      id="mySelect3_38391829"
                      data-address-type="province"
                      data-address-zone="38391829"
                      data-select2-id="select2-data-billingProvince"
                    ></select>
                  </fieldset>
                  <fieldset className="form-group select-field not-vn">
                    <label>Quận huyện</label>
                    <select
                      name="District"
                      className="form-control add district myselect has-content"
                      data-default="Thị xã Sơn Tây"
                      value="Thị xã Sơn Tây"
                      id="mySelect4_38391829"
                      data-address-type="district"
                      data-address-zone="38391829"
                      data-select2-id="select2-data-billingDistrict"
                    ></select>
                  </fieldset>
                  <fieldset className="form-group select-field not-vn">
                    <label>Phường xã</label>
                    <select
                      name="Ward"
                      className="form-control add ward myselect has-content"
                      data-default="Phường Lê Lợi"
                      value="Phường Lê Lợi"
                      id="mySelect5_38391829"
                      data-address-type="ward"
                      data-address-zone="38391829"
                      data-select2-id="select2-data-billingWard"
                    ></select>
                  </fieldset>
                </div>

                <div className="field">
                  <fieldset className="form-group">
                    <label>Mã Zip</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Zip"
                      value=""
                    />
                  </fieldset>
                </div>
              </div>
              <div className="btn-row">
                <button
                  className="btn btn-dark-address btn-fix-addr btn-close font-semibold"
                  type="button"
                  data-form="edit_address_38391829"
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary btn-submit btn bg-primary text-white "
                  id="update"
                >
                  <span>Cập nhật địa chỉ</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressList;
