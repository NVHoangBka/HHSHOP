import React, { useEffect, useRef, useState } from "react";
import countries from "i18n-iso-countries";
import { getCities } from "countries-cities";
import vietnamData from "../../../../data/vietnam.json";

// Đăng ký tiếng Việt
countries.registerLocale(require("i18n-iso-countries/langs/vi.json"));

const AddressList = ({authController}) => {
  const modalRef = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [error, setError] = useState('');
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cities, setCities] = useState([]);


  useEffect(() => {
      const fetchAddresses = async () =>  {
        setLoading(true);
        setError('');
        try {
          const result = await authController.getAddressAll();
          if (result.success) {
            setAddresses(result.addresses);
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error('AddressesList  error:', error);
          setError(error.message || 'Không thể tải danh sách đơn hàng.');
        } finally {
          setLoading(false);
        }
      }
      fetchAddresses();
    }, [authController]);

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

  // Reset form
  const resetForm = () => {
    setIsEdit(false); setEditId("");
    setFullName(""); setPhone(""); setAddressLine("");
    setCountry("VN"); setProvince(""); setDistrict(""); setWard(""); setCity("");
    setIsDefault(false);
  };

  // Open edit
  const openEdit = (addr) => {
    setIsEdit(true);
    setEditId(addr._id);
    setFullName(addr.recipientName);
    setPhone(addr.phoneNumber);
    setAddressLine(addr.addressLine);
    setCountry(addr.city && !addr.ward ? "US" : "VN");
    setProvince(addr.city);
    setDistrict(addr.district);
    setWard(addr.ward);
    setIsDefault(addr.isDefault);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      recipientName: fullName,
      phoneNumber: phone,
      addressLine,
      ward, 
      district, 
      city: province,
      isDefault
    };

    try {
      let result;
      if (isEdit) {
        result = await authController.updateAddress(editId, data);
      } else {
        result = await authController.addAddress(data);
      } 
      if (result.success) {
        // Refresh address list
        const addressesList = await authController.getAddressAll();
        setAddresses(addressesList.addresses);
        resetForm();
        const modal = window.bootstrap.Modal.getInstance(modalRef.current);
        if (modal) modal.hide();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Address submit error:', error);
      setError(error.message || 'Không thể lưu địa chỉ.');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const result = await authController.deleteAddress(id);
      if (result.success) {
        // Refresh address list
        const addressesList = await authController.getAddressAll();
        setAddresses(addressesList.addresses);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Address delete error:', error);
      setError(error.message || 'Không thể xóa địa chỉ.');
    }
  };

  return (
    <div className=" rounded-lg px-3 mb-6">
      <div className="d-flex justify-content-between align-items-center flex-wrap pb-4 border-bottom">
        <h1 className="fs-4 fw-semibold mb-2">Địa chỉ của bạn</h1>
        <button
          type="button"
          className="fw-semibold d-flex align-items-center rounded-pill btn bg-success text-white btn-more px-4 py-2"
          data-bs-toggle="modal"
          data-bs-target="#addressModal"
        >
          <i className="bi bi-plus-lg me-1"></i>Thêm địa chỉ
        </button>
      </div>
      <div className="modal fade" id="addressModal" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header justify-content-between">
              <h2 className="title_pop fs-6 fw-bold text-uppercase mb-0">
                {isEdit ? "Sửa" : "Thêm"} địa chỉ
              </h2>
              <div className="btn" data-bs-dismiss="modal">
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input name="FormType" type="hidden" value="customer_address" />
                <input name="utf8" type="hidden" value="true" />
                <div className="pop_bottom">
                  <div className="form_address">
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Họ tên</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={fullName} 
                          onChange={e => setFullName(e.target.value)}
                        />
                      </fieldset>
                      <p className="error-msg"></p>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Số điện thoại</label>
                        <input
                          type="number"
                          className="form-control"
                          id="Phone"
                          pattern="\d+"
                          maxLength="12"
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          required
                        />
                      </fieldset>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group">
                        <label>Địa chỉ</label>
                        <input
                          type="text"
                          className="form-control"
                          value={addressLine} onChange={e => setAddressLine(e.target.value)} required
                        />
                      </fieldset>
                    </div>
                    <div className="field mb-3">
                      <fieldset className="form-group select-field">
                        <label>Quốc gia</label>
                        <select
                          className="form-control"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          {Object.entries(countries.getNames("vi")).map(
                            ([id, name]) => (
                              <option key={id} value={id}>
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
                            className="form-control add has-content"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                          >
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {provinces.map((p) => (
                              <option key={p.id} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </fieldset>
                        <fieldset className="form-group select-field col">
                          <label>Quận/Huyện</label>
                          <select
                            className="form-control add has-content"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={isEdit ? false : !province}
                          >
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map((d) => (
                              <option key={d.id} value={d.name}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </fieldset>
                        <fieldset className="form-group select-field col">
                          <label>Phường xã</label>
                          <select
                            className="form-control add has-content"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            disabled={isEdit? false : !district}
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((w) => (
                              <option key={w.id} value={w.name}>
                                {w.name}
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
                          {cities.map((id) => (
                            <option key={id}>{id}</option>
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
                className="btn btn-secondary px-4 btn-outline article-readmore"
                data-bs-dismiss="modal"
                type="button"
              >
                <span>Hủy</span>
              </button>
              <button
                className="btn btn-success px-4 text-white font-semibold btn-submit"
                type="submit"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                <span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách */}
      <div className="row total_address mt-4 fs-7">
        <div id="view_address"
          className="customer_address col-xs-12 col-lg-12 col-md-12 col-xl-12"
        >
          {loading ? <p>Đang tải...</p> : addresses.length === 0 ? (        
            <div className="fs-7 text-center">
              Chưa có địa chỉ nào. Vui lòng thêm địa chỉ. 
            </div>
          ) : (
            addresses.map((address, index) => (
              <div key={index} className="address_info d-flex justify-content-between">
                <div className="address-group">
                  <div className="address form-signup">
                    <p>
                      <strong>Họ tên: </strong> {address.recipientName}
                    </p>
                    <p>
                      <strong>Địa chỉ: </strong>
                      {address.ward && `${address.ward}, `}
                      {address.district && `${address.district}, `}
                      {address.city}
                    </p>

                    <p>
                      <strong>Số điện thoại:</strong> {address.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <span className="border py-1 px-2 text-danger border-danger">
                      {address.isDefault ? "Mặc định" : ""}
                    </span>
                  </div>
                </div>
                <div id="tool_address" className="btn-address">
                  <div className="btn-row d-flex">
                    <button
                      className="btn-edit-addr btn btn-edit p-1 fw-semibold text-primary border-0"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#addressModal"
                      onClick={() => openEdit(address)}
                    >
                      <span>Cập nhật</span>
                    </button>
                    <button
                      className="hidden btn btn-dark-address btn-edit-addr btn-delete text-danger"
                      type="button"
                      onClick={() => handleDelete(address._id)}
                    >
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            )) 
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
