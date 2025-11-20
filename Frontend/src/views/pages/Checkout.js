import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      console.error("Giỏ hàng trống!");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      console.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Giả lập gửi đơn hàng thành công
    console.success(
      "Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Minimart ❤️"
    );

    // Xóa giỏ hàng sau khi đặt thành công
    clearCart();

    // Chuyển về trang chủ sau 2 giây
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const totalPrice = cart.reduce((total, item) => {
    const price = item.selectedVariant
      ? item.selectedVariant.discountPrice || item.selectedVariant.price
      : item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm trước khi thanh toán nhé!</p>
        <button onClick={() => navigate("/")} className="btn btn-danger btn-lg">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-success-subtle py-3">
        <div className="container">
          <h4 className="mb-0">Thanh toán đơn hàng</h4>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-5">
          {/* Form thông tin */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-person me-2"></i>Thông tin nhận hàng
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">Họ và tên *</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Email (không bắt buộc)
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        Địa chỉ giao hàng *
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Ví dụ: 123 Đường Láng, Đống Đa, Hà Nội"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        name="note"
                        rows="3"
                        className="form-control"
                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                        value={formData.note}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-grid">
                    <button
                      type="submit"
                      className="btn btn-danger btn-lg fw-bold"
                    >
                      HOÀN TẤT ĐẶT HÀNG
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Giỏ hàng tóm tắt */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: "100px" }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-cart-check me-2"></i>Đơn hàng (
                  {cart.length} sản phẩm)
                </h5>

                <div
                  className="checkout-items"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {cart.map((item, index) => {
                    const displayName = item.selectedVariant
                      ? `${item.name} - ${item.selectedVariant.value}`
                      : item.name;
                    const price = item.selectedVariant
                      ? item.selectedVariant.discountPrice ||
                        item.selectedVariant.price
                      : item.discountPrice || item.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <div
                        key={index}
                        className="d-flex mb-3 pb-3 border-bottom"
                      >
                        <img
                          src={item.cartImage || item.image}
                          alt={item.name}
                          width="60"
                          height="60"
                          className="rounded me-3 object-fit-cover"
                        />
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-bold small">{displayName}</p>
                          <p className="text-muted small mb-1">
                            {formatPrice(price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fw-bold text-danger">
                            {formatPrice(itemTotal)}
                          </p>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item._id || item.id,
                                item.selectedVariant?.value
                              )
                            }
                            className="btn btn-sm text-danger"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-top mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <span className="fw-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Phí vận chuyển</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <div className="d-flex justify-content-between fs-5 fw-bold text-danger">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="alert alert-success small mt-3">
                  <i className="bi bi-truck me-2"></i>
                  Miễn phí vận chuyển toàn quốc • Đổi trả dễ dàng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;
