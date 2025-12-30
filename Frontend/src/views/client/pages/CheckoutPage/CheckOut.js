import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import vietnamData from "../../../../data/vietnam.json";
import { useTranslation } from "react-i18next";

const Checkout = ({ cartController, orderController, authController }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [t, i18n] = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderId, setOrderId] = useState("");

  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [isQuickBuy, setIsQuickBuy] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // ==================== LOAD DATA ====================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [currentUser, addressRes, cartData] = await Promise.all([
        authController.getCurrentUser(),
        authController.getAddressAll().catch(() => ({ addresses: [] })),
        cartController.getCartItems(),
      ]);
      // ƯU TIÊN 1: Nếu có "Mua ngay" → dùng danh sách này
      if (
        location.state?.isQuickBuy &&
        location.state?.checkoutItems?.length > 0
      ) {
        setCartItems(location.state.checkoutItems);
        setIsQuickBuy(true);
      } else {
        // ƯU TIÊN 2: Nếu không có → lấy giỏ hàng bình thường
        if (cartData.length === 0) {
          alert(t("checkout.emptyCart"));
          navigate("/cart");
          return;
        }
        setCartItems(cartData);
      }

      const addresses = addressRes.addresses || [];
      const defaultAddr = addresses.find((a) => a.isDefault);

      setUser(currentUser);
      setAddressList(addresses);

      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setFormData({
          fullName: defaultAddr.recipientName,
          phone: defaultAddr.phoneNumber,
          email: currentUser.email,
          address: defaultAddr.addressLine,
          city: defaultAddr.city,
          district: defaultAddr.district,
          ward: defaultAddr.ward,
          note: "",
        });

        setCity(defaultAddr.city);
        setDistrict(defaultAddr.district);
        setWard(defaultAddr.ward);
      } else {
        // Không có địa chỉ mặc định → để trống cho nhập mới
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          district: "",
          ward: "",
          note: "",
        });
      }

      setLoading(false);
    };

    init();
  }, [cartController, authController, navigate]);

  // Load tỉnh
  useEffect(() => {
    setCitys(vietnamData);
  }, [city]);

  // Load huyện
  useEffect(() => {
    if (city) {
      const citys = vietnamData.find((p) => p.name === city);
      console.log(citys);

      setDistricts(citys?.districts || []);
    } else {
      setDistricts([]);
    }
    setWard("");
  }, [city]);

  // Load xã
  useEffect(() => {
    if (district && city) {
      const citys = vietnamData.find((p) => p.name === city);
      const dist = citys?.districts.find((d) => d.name === district);
      setWards(dist?.wards || []);
    } else {
      setWards([]);
    }
    setWard("");
  }, [district, city]);

  // Tính toán
  const subTotal = cartItems.reduce((sum, item) => {
    const price = item.finalPrice || item.discountPrice || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const shippingFee = 30000;
  const totalAmount = subTotal + shippingFee - voucherDiscount;

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (code === "GIAM10") {
      setVoucherDiscount(subTotal * 0.1);
      alert(t("checkout.alert.voucherSuccess10"));
    } else if (code === "FREESHIP") {
      setVoucherDiscount(shippingFee);
      alert(t("checkout.alert.voucherFreeShip"));
    } else {
      alert(t("checkout.alert.voucherInvalid"));
      setVoucherDiscount(0);
    }
  };

  const handleAddressChange = (addressId) => {
    if (!addressId) {
      setSelectedAddressId("");
      return;
    }
    const addr = addressList.find((a) => a._id === addressId);
    if (addr) {
      setSelectedAddressId(addressId);
      setFormData((prev) => ({
        ...prev,
        fullName: addr.recipientName || "",
        phone: addr.phoneNumber || "",
        address: addr.addressLine || "",
        city: addr.city || "",
        district: addr.district || "",
        ward: addr.ward || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      (!formData.address && !city && !district && !ward)
    ) {
      alert(t("checkout.alert.emptyRequired"));
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id || item._id,
        quantity: item.quantity,
        price: item.discountPrice || item.price,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress: {
          recipientName: formData.fullName,
          phoneNumber: formData.phone,
          addressLine: formData.address || "",
          city: formData.city || "Hà Nội",
          district: formData.district || "Hoàn Kiếm",
          ward: formData.ward || "Hàng Bạc",
        },
        note: formData.note || undefined,
        paymentMethod: paymentMethod,
        voucherCode: voucherCode || undefined,
        voucherDiscount: voucherDiscount || 0,
        shippingFee: shippingFee || 30000,
      };

      // Gửi đơn hàng qua orderController
      const result = await orderController.createOrder(orderData);

      if (result.success) {
        setOrderId(result.order.id || result.order.orderId);

        // Xóa giỏ hàng
        cartController.clearCart();
        setCartItems([]);

        if (paymentMethod === "BANK") {
          // Chuyển sang trang thành công + hiện QR từ backend
          navigate("/checkout/order-success", {
            state: {
              order: result.order,
              qrImage: result.qrImage,
              bankInfo: result.bankInfo,
              expiredAt: result.expiredAt,
              paymentMethod: "BANK",
            },
          });
        } else {
          // COD → hiện thông báo thành công
          alert(
            t("checkout.alert.orderSuccess", {
              orderId: result.order.orderId || result.order.id,
            })
          );
          navigate("/checkout/order-success", {
            state: { order: result.order, paymentMethod: "COD" },
          });
        }
      } else {
        alert(t("checkout.alert.orderFailed", { message: result.message }));
      }
    } catch (err) {
      console.error(err);
      alert(t("checkout.alert.errorOccurred"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-xl-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">{t("checkout.loading")}</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-xl-5 text-center">
        <h3>{t("checkout.emptyCart")}</h3>
        <Link to="/products/all" className="btn btn-success">
          {t("checkout.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-xl-5">
      <h2 className="mb-4 fw-bold">{t("checkout.pageTitle")}</h2>

      <div className="row">
        {/* Form thanh toán */}
        <div className="row col-xl-8">
          <div className="col-xl-6">
            <div className="card shadow-sm sticky-top" style={{ top: 20 }}>
              <div className="card-body p-xl-4">
                <h5 className="mb-xl-4 fw-semibold">
                  {t("checkout.customerInfo")}
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="mb-xl-3">
                    <label for="customer-address" class="field__label">
                      {t("checkout.addressBook")}
                    </label>
                    <select
                      id="customer-address"
                      className="form-select form-select-lg shadow-sm fs-7"
                      value={selectedAddressId}
                      onChange={(e) => handleAddressChange(e.target.value)}
                    >
                      {addressList.map((addr) => (
                        <option
                          key={addr._id}
                          value={addr._id}
                          className="fs-7 w-100"
                        >
                          {addr.recipientName} • {addr.phoneNumber} •{" "}
                          {addr.ward} • {addr.district} • {addr.city}
                          {addr.isDefault && t("checkout.defaultAddress")}
                        </option>
                      ))}
                    </select>
                    <div class="field__caret">
                      <i class="fa fa-caret-down"></i>
                    </div>
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">{t("checkout.email")}</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled
                    />
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">
                      {t("checkout.fullName")}{" "}
                      <span className="text-danger">
                        {t("checkout.required")}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">
                      {t("checkout.phone")}{" "}
                      <span className="text-danger">
                        {t("checkout.required")}
                      </span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">
                      {t("checkout.addressOptional")}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">
                      {t("checkout.province")}
                    </label>
                    <select
                      id="city-address"
                      className="form-select form-select-lg"
                      onChange={(e) => ({ ...formData, city: e.target.value })}
                      value={formData.city}
                    >
                      <option value="">{t("checkout.province")}...</option>
                      {citys.map((city) => (
                        <option
                          key={city.id}
                          value={city.name}
                          className="fs-7"
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">
                      {t("checkout.district")}
                    </label>
                    <select
                      id="district-address"
                      className="form-select form-select-lg"
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      value={formData.district}
                    >
                      <option value="">{t("checkout.district")}...</option>
                      {districts.map((district) => (
                        <option
                          key={district.id}
                          value={district.name}
                          className="fs-7"
                        >
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-xl-3">
                    <label className="form-label">{t("checkout.ward")}</label>
                    <select
                      id="ward-address"
                      className="form-select form-select-lg"
                      onChange={(e) =>
                        setFormData({ ...formData, ward: e.target.value })
                      }
                      value={formData.ward}
                    >
                      <option value="">{t("checkout.ward")}...</option>
                      {wards.map((ward) => (
                        <option
                          key={ward.id}
                          value={ward.name}
                          className="fs-7"
                        >
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-xl-4">
                    <label className="form-label">{t("checkout.note")}</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder={t("checkout.notePlaceholder")}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="border p-xl-4 shadow-sm rounded-3">
              {/* Vận chuyển */}
              <div class="section mb-xl-4">
                <div class="header">
                  <h5 className="mb-xl-2 fw-semibold">
                    {t("checkout.shipping.title")}
                  </h5>
                </div>
                <div class="content" id="shippingMethodList">
                  <div class="alert alert--loader spinner spinner--active d-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="spinner-loader"
                    >
                      <use href="#spinner"></use>
                    </svg>
                  </div>

                  <div class="alert alert-retry alert--danger d-none">
                    <span data-bind="loadingShippingErrorMessage">
                      {t("checkout.shipping.loadingError")}
                    </span>{" "}
                    <i class="fa fa-refresh"></i>
                  </div>

                  <div class="content-box">
                    <div class="content-box border rounded-2 py-xl-2 px-xl-3">
                      <div class="radio-wrapper d-flex w-100 align-items-center">
                        <div class="radio__input">
                          <input
                            type="radio"
                            class="form-check-input"
                            name="shippingMethod"
                            id="shippingMethod"
                            value="40.000 VND"
                            data-bind="shippingMethod"
                            checked
                          />
                        </div>
                        <label
                          for="shippingMethod"
                          class="radio__label d-flex ms-xl-2 justify-content-between align-items-center fs-7 w-100"
                        >
                          <span class="radio__label__primary">
                            <span>{t("checkout.shipping.method")}</span>
                          </span>
                          <span class="radio__label__accessory">
                            <span class="content-box__emphasis price fw-semibold">
                              40.000₫
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Thanh Toán */}
              <div class="section">
                <div class="section__header">
                  <h5 className="mb-xl-2 fw-semibold">
                    {t("checkout.payment.title")}
                  </h5>
                </div>
                <div class="section__content" id="shippingMethodList">
                  <div class="alert alert--loader spinner spinner--active d-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="spinner-loader"
                    >
                      <use href="#spinner"></use>
                    </svg>
                  </div>
                  <div class="content-box">
                    <div class="content-box border rounded-2 py-xl-2 px-xl-3 mb-xl-1">
                      <div class="radio-wrapper d-flex align-items-center w-100">
                        <div class="radio__input">
                          <input
                            type="radio"
                            class="form-check-input"
                            name="paymentMethod"
                            id="paymentMethodBank"
                            data-bind="paymentMethod"
                            checked={paymentMethod === "BANK"}
                            onChange={() => setPaymentMethod("BANK")}
                          />
                        </div>
                        <label
                          for="paymentMethodBank"
                          class="radio__label d-flex ms-xl-2 justify-content-between align-items-center fs-7 w-100"
                        >
                          <span class="radio__label__primary">
                            <span>{t("checkout.payment.bankTransfer")}</span>
                          </span>
                          <span class="radio__label__accessory me-xl-2">
                            <i class="bi bi-cash text-primary fs-4"></i>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div class="content-box border rounded-2 py-xl-2 px-xl-3">
                      <div class="radio-wrapper d-flex w-100 align-items-center">
                        <div class="radio__input">
                          <input
                            type="radio"
                            class="form-check-input"
                            name="paymentMethod"
                            id="paymentMethodCOD"
                            data-bind="paymentMethod"
                            checked={paymentMethod === "COD"}
                            onChange={() => {
                              setPaymentMethod("COD");
                            }}
                          />
                        </div>
                        <label
                          for="paymentMethodCOD"
                          class="radio__label d-flex ms-xl-2 justify-content-between align-items-center fs-7 w-100"
                        >
                          <span class="radio__label__primary">
                            <span>{t("checkout.payment.cod")}</span>
                          </span>
                          <span class="radio__label__accessory me-xl-2">
                            <i class="bi bi-cash text-primary fs-4"></i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="col-xl-4">
          <div className="card border-bottom mb-xl-4">
            <div className="cart-content">
              <h5 className="card-title mb-xl-4 fw-semibold p-xl-3 border-bottom">
                {t("checkout.cartSummary.title")}{" "}
                {t("checkout.cartSummary.productCount", {
                  count: cartItems.length,
                })}
              </h5>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex py-xl-3 px-xl-4">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="rounded me-xl-3"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fs-6">{item.name}</p>
                    {item.size && (
                      <small className="text-muted">
                        {t("checkout.cartSummary.size", { size: item.size })}
                      </small>
                    )}
                    <span className="ms-xl-2 text-muted">
                      {t("checkout.cartSummary.quantity", {
                        quantity: item.quantity,
                      })}
                    </span>
                  </div>
                  <div className="text-danger fw-bold text-end ms-xl-2">
                    {(
                      (item.discountPrice || item.price) * item.quantity
                    ).toLocaleString("vi-VN")}
                    ₫
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Mã giảm giá */}
            <div className="mb-xl-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-xl-2"
                  placeholder={t("checkout.cartSummary.voucher.placeholder")}
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!isFocused}
                  onClick={handleApplyVoucher}
                >
                  {t("checkout.cartSummary.voucher.apply")}
                </button>
              </div>
              {voucherDiscount > 0 && (
                <div className="text-success mt-xl-2 small">
                  {t("checkout.cartSummary.voucher.applied", {
                    amount: voucherDiscount.toLocaleString("vi-VN"),
                  })}
                </div>
              )}
            </div>

            {/* Tổng tiền */}
            <div className="border-top pt-xl-3">
              <div className="d-flex justify-content-between mb-xl-2">
                <span>{t("checkout.cartSummary.subtotal")}</span>
                <span>{subTotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="d-flex justify-content-between mb-xl-2">
                <span>{t("checkout.cartSummary.shippingFee")}</span>
                <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="d-flex justify-content-between text-success mb-xl-2">
                  <span>{t("checkout.cartSummary.discount")}</span>
                  <span>-{voucherDiscount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="d-flex justify-content-between fw-bold fs-4 text-danger border-top mt-xl-3 pt-xl-2">
                <span>{t("checkout.cartSummary.total")}</span>
                <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-xl-4">
              <div className="text-center">
                <Link to="/cart" className="text-muted text-hover">
                  {t("checkout.cartSummary.backToCart")}
                </Link>
              </div>
              <button
                type="button"
                disabled={submitting}
                className="btn btn-success w-50 py-xl-3 fw-bold text-white"
                onClick={handleSubmit}
              >
                {submitting
                  ? t("checkout.cartSummary.placingOrder")
                  : t("checkout.cartSummary.placeOrder")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
