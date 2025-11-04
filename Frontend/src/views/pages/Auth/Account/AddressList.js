import React, { useEffect, useState } from "react";
import countries from "i18n-iso-countries";
import { getCities } from "countries-cities";
import vietnamData from "../../../../data/vietnam.json";

// Đăng ký tiếng Việt
countries.registerLocale(require("i18n-iso-countries/langs/vi.json"));

const AddressList = () => {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cities, setCities] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Load tỉnh VN hoặc thành phố thế giới
  useEffect(() => {
    // ---- 1. Reset mọi field con ----
    setProvince("");
    setDistrict("");
    setWard("");
    setCity("");

    // ---- 2. Reset danh sách ----
    setDistricts([]);
    setWards([]);

    if (country === "VN") {
      setProvinces(vietnamData);
      setCities([]);
      setDistricts([]);
      setWards([]);
    } else if (country) {
      const cityList = getCities(country) || [];
      setCities(cityList.sort());
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    } else {
      setProvinces([]);
      setCities([]);
      setDistricts([]);
      setWards([]);
    }
  }, [country]);

  // Load huyện
  useEffect(() => {
    if (province && country === "VN") {
      const prov = vietnamData.find((p) => p.name === province);
      setDistricts(prov?.districts || []);
    } else {
      setDistricts([]);
    }
    setDistrict("");
    setWard("");
  }, [province, country]);

  // Load xã
  useEffect(() => {
    if (district && province && country === "VN") {
      const prov = vietnamData.find((p) => p.name === province);
      const dist = prov?.districts.find((d) => d.name === district);
      setWards(dist?.wards || []);
    } else {
      setWards([]);
    }
    setWard("");
  }, [district, province, country]);

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
            <div className="modal-header justify-content-between">
              <h2 className="title_pop fs-6 fw-bold text-uppercase mb-0">
                Thêm địa chỉ mới
              </h2>
              <div className="btn" onClick={handleClose}>
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
            <div className="modal-body">
              <form>
                <input name="FormType" type="hidden" value="customer_address" />
                <input name="utf8" type="hidden" value="true" />
                <div className="pop_bottom">
                  <div className="form_address">
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Họ tên</label>
                        <input
                          required=""
                          type="text"
                          name="FullName"
                          className="form-control"
                        />
                      </fieldset>
                      <p className="error-msg"></p>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Số điện thoại</label>
                        <input
                          required=""
                          type="number"
                          className="form-control"
                          id="Phone"
                          pattern="\d+"
                          name="Phone"
                          maxLength="12"
                        />
                      </fieldset>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Địa chỉ</label>
                        <input
                          required=""
                          type="text"
                          className="form-control"
                          name="Address1"
                        />
                      </fieldset>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group select-field">
                        <label>Quốc gia</label>
                        <select
                          name="Country"
                          className="form-control"
                          id="country"
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          {Object.entries(countries.getNames("vi")).map(
                            ([code, name]) => (
                              <option key={code} value={code}>
                                {name}
                              </option>
                            )
                          )}
                        </select>
                      </fieldset>
                    </div>
                    {/* Việt Nam: Tỉnh → Huyện → Xã */}
                    {country === "VN" && (
                      <div className="group-country row w-100 mb-3">
                        <fieldset className="form-group select-field col">
                          <label>Tỉnh thành</label>
                          <select
                            name="Province"
                            className="form-control add has-content"
                            id="province"
                            // value={province}
                            onChange={(e) => setProvince(e.target.value)}
                          >
                            {provinces.map((p) => (
                              <option key={p.Id} value={p.Name}>
                                {p.Name}
                              </option>
                            ))}
                          </select>
                        </fieldset>
                        <fieldset className="form-group select-field col">
                          <label>Quận/Huyện</label>
                          <select
                            name="District"
                            className="form-control add has-content"
                            id="district"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={!province}
                          >
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((d) => (
                              <option key={d.code} value={d.name}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </fieldset>
                        <fieldset className="form-group select-field col">
                          <label>Phường xã</label>
                          <select
                            name="Ward"
                            className="form-control add has-content"
                            id="ward"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            disabled={!district}
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((w) => (
                              <option key={w.code} value={w.name}>
                                {w.name_with_type || w.name}
                              </option>
                            ))}
                          </select>
                        </fieldset>
                      </div>
                    )}

                    {/* Thế giới: Thành phố */}
                    {country !== "VN" && (
                      <div className="group-country w-100 mb-3">
                        <label className="form-label">Thành phố *</label>
                        <select
                          className="form-select"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        >
                          <option value="">Chọn thành phố</option>
                          {cities.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-dark-address px-4 btn-outline article-readmore"
                type="button"
                onClick={handleClose}
              >
                <span>Hủy</span>
              </button>
              <button
                className="btn btn-success px-4 text-white font-semibold btn-submit"
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
                  data-bs-toggle="modal"
                  data-bs-target="#edit_address_38391829"
                  data-form="edit_address_38391829"
                  aria-controls="edit_address_38391829"
                >
                  <span>Cập nhật</span>
                </button>
                <button
                  className="hidden btn btn-dark-address btn-edit-addr btn-delete text-danger"
                  type="button"
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
            acceptCharset="UTF-8"
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
                      autoCapitalize="words"
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
                      maxLength="12"
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
                    />
                    <label>Địa chỉ</label>
                  </fieldset>
                </div>
                <div className="field">
                  <fieldset className="form-group select-field">
                    <label>Quốc gia</label>
                    <select
                      name="Country"
                      className="form-control"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {Object.entries(countries.getNames("vi")).map(
                        ([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        )
                      )}
                    </select>
                  </fieldset>
                </div>
                {/* Việt Nam: Tỉnh → Huyện → Xã */}
                {country === "VN" && (
                  <div className="group-country row w-100">
                    <fieldset className="form-group select-field col">
                      <label>Tỉnh thành</label>
                      <select
                        name="Province"
                        className="form-control add has-content"
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                      >
                        <option>Chọn Tỉnh/TP</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.name_with_type || p.name}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                    <fieldset className="form-group select-field col">
                      <label>Quận/Huyện</label>
                      <select
                        name="District"
                        className="form-control add has-content"
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!province}
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.name}>
                            {d.name_with_type || d.name}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                    <fieldset className="form-group select-field col">
                      <label>Phường xã</label>
                      <select
                        name="Ward"
                        className="form-control add has-content"
                        id="ward"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        disabled={!district}
                      >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.name}>
                            {w.name_with_type || w.name}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                  </div>
                )}

                {/* Thế giới: Thành phố */}
                {country !== "VN" && cities.length > 0 && (
                  <div className="group-country row w-100">
                    <label className="form-label">Thành phố *</label>
                    <select
                      className="form-select"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Chọn thành phố</option>
                      {cities.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="field">
                  <fieldset className="form-group">
                    <label>Mã Zip</label>
                    <input type="text" className="form-control" name="Zip" />
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
