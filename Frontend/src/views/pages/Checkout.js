import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const authService = new AuthService();
const Checkout = ({ cartController, orderController }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Load user + giỏ hàng khi vào trang
  useEffect(() => {
    const init = async () => {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        alert("Vui lòng đăng nhập để thanh toán!");
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }

      setUser(currentUser);

      // Tự động điền thông tin nếu có
      setFormData({
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        address: currentUser.defaultAddress || "",
        note: "",
      });

      // Load giỏ hàng
      setCartItems(cartController.getCartItems());
      setLoading(false);
    };

    init();
  }, [navigate]);

  // Tính toán
  const shippingFee = 30000;
  const subTotal = cartController.getTotalPrice();
  const total = subTotal + shippingFee - voucherDiscount;

  const handleApplyVoucher = () => {
    if (!voucherCode) return;

    const code = voucherCode.toUpperCase().trim();
    let discount = 0;

    if (code === "GIAM10") {
      discount = subTotal * 0.1;
      alert("Áp dụng mã GIAM10 – Giảm 10%");
    } else if (code === "FREESHIP") {
      discount = shippingFee;
      alert("Miễn phí vận chuyển!");
    } else {
      alert("Mã không hợp lệ");
      setVoucherDiscount(0);
      return;
    }

    setVoucherDiscount(discount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
        },
        note: formData.note,
        paymentMethod: "cod",
        shippingFee,
        voucherCode: voucherCode || null,
        voucherDiscount,
        subTotal,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Gửi đơn hàng qua AuthService (giả sử có method createOrder)
      const result = await authService.createOrder(orderData);

      if (result.success) {
        // Xóa giỏ hàng
        cartController.clearCart();
        setCartItems([]);

        alert(
          `Đặt hàng thành công! Mã đơn: #${
            result.order.id || result.order.orderId
          }`
        );

        navigate("/order-success", { state: { order: result.order } });
      } else {
        alert("Đặt hàng thất bại: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Giỏ hàng trống</h3>
        <Link to="/products/all" className="btn btn-success">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Xác nhận thanh toán</h2>

      <div className="row g-5">
        {/* Danh sách sản phẩm */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">Sản phẩm ({cartItems.length})</h5>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex py-3 border-bottom">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-semibold">{item.name}</p>
                    {item.size && (
                      <small className="text-muted">Size: {item.size}</small>
                    )}
                    <span className="ms-2 text-muted">× {item.quantity}</span>
                  </div>
                  <div className="text-danger fw-bold text-end">
                    {(
                      (item.discountPrice || item.price) * item.quantity
                    ).toLocaleString("vi-VN")}
                    ₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form thanh toán */}
        <div className="col-lg-5">
          <div
            className="card border-0 shadow-sm sticky-top"
            style={{ top: 20 }}
          >
            <div className="card-body p-4">
              <h5 className="mb-4">Thông tin giao hàng</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ và tên *</label>
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

                <div className="mb-3">
                  <label className="form-label">Số điện thoại *</label>
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

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Địa chỉ nhận hàng *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Giao giờ hành chính, để trước cửa..."
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>

                {/* Mã giảm giá */}
                <div className="mb-4">
                  <label className="form-label">Mã giảm giá</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={handleApplyVoucher}
                    >
                      Áp dụng
                    </button>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="text-success mt-2 small">
                      Đã giảm: -{voucherDiscount.toLocaleString("vi-VN")}₫
                    </div>
                  )}
                </div>

                {/* Tổng tiền */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <span>{subTotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="d-flex justify-content-between text-success mb-2">
                      <span>Giảm giá</span>
                      <span>-{voucherDiscount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-bold fs-4 text-danger">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-success w-100 mt-4 py-3 fw-bold text-white"
                >
                  {submitting ? "Đang gửi đơn hàng..." : "HOÀN TẤT ĐẶT HÀNG"}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/cart" className="text-muted small">
                  ← Quay lại giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
