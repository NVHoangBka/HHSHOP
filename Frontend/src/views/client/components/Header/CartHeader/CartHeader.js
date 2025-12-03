import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartHeader = ({
  isOpen,
  onClose,
  cartController,
  cartItems: propCartItems,
  onCartChange,
}) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(propCartItems || []);
  const [total, setTotal] = useState(cartController.getTotalPrice());

  // Đồng bộ state với props khi có thay đổi
  useEffect(() => {
    setCartItems(propCartItems || []);
    setTotal(cartController.getTotalPrice());
  }, [propCartItems, cartController]);

  const handleIncrease = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem) {
      const updatedCart = cartController.updateQuantity(
        id,
        currentItem.quantity + 1
      );
      setCartItems([...updatedCart]);
      setTotal(cartController.getTotalPrice());
      onCartChange(updatedCart);
    }
  };

  const handleDecrease = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem && currentItem.quantity > 1) {
      const updatedCart = cartController.updateQuantity(
        id,
        currentItem.quantity - 1
      );
      setCartItems([...updatedCart]);
      setTotal(cartController.getTotalPrice());
      onCartChange(updatedCart);
    }
  };

  const handleRemove = (id) => {
    const updatedCart = cartController.removeFromCart(id);
    setCartItems([...updatedCart]);
    setTotal(cartController.getTotalPrice());
    onCartChange(updatedCart);
  };

  const handleCheckout = (e) => {
    onClose();
    navigate(`/checkout`);
  };

  return (
    <div className={`cart d-flex flex-column end-0`}>
      <div className="cart-header d-flex justify-content-between align-items-center border-bottom">
        <h2 className="card-title text-black pb-3 pt-4 px-4">Giỏ hàng</h2>
        <button
          className="btn border rounded-circle px-2 py-0"
          onClick={onClose}
        >
          <i className="bi bi-x fs-4"></i>
        </button>
      </div>
      <div className="card-body">
        <div className="cart-content px-4 py-3 h-100">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="text-black text-center">
                <img
                  src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/cart_empty_background.png?1733201190476"
                  alt=""
                />
                <h2 className="font-bold">Giỏ hàng chưa có gì!</h2>
                <p>Hãy tìm sản phẩm ứng ý và thêm vào giỏ hàng bạn nhé</p>
                <Link
                  className="btn font-bold bg-success text-white rounded-pill"
                  to="/products/all"
                  title="Tiếp tục mua sắm"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex h-100 flex-column justify-content-between">
              <div className="cart-top pt-1 overflow-y-auto flex flex-col">
                <div className="cart-table">
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div className="cart-item py-3 border-bottom">
                        <div className="cart-product-col d-flex justify-content-between align-items-start">
                          <div className="d-flex">
                            <Link
                              className="cart-item__image"
                              to={`/products/slug/${item.slug}`}
                              title={item.name}
                            >
                              <img
                                src={
                                  item.image || "https://via.placeholder.com/60"
                                } // Hiển thị placeholder nếu không có image
                                className="me-2 rounded"
                                alt={item.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                            <div>
                              <p className="cart-item__name mb-0 fw-semibold small">
                                <Link
                                  to={`/products/slug/${item.slug}`}
                                  title={item.name}
                                  className="link text-decoration-none text-dark"
                                >
                                  {item.name}
                                </Link>
                              </p>
                              <span className="cart-item__variant text-muted fs-7">
                                Size: {item.size || "default"}
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm px-2 rounded-circle text-muted"
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>

                        <div className="px-3 ms-5 d-flex justify-content-between cart-quantity-col">
                          <div className="cart-unit-price-col">
                            <div className="price text-danger fw-bold">
                              {(
                                (item.discountPrice || item.price) *
                                item.quantity
                              ).toLocaleString("vi-VN")}
                              ₫
                            </div>
                          </div>
                          <div
                            className="input-group custom-number-input cart-item-quantity d-flex border rounded row"
                            style={{ maxWidth: "100px", height: "28px" }}
                          >
                            <button
                              type="button"
                              name="minus"
                              className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                              onClick={() => handleDecrease(item.id)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input
                              type="number"
                              className="form-quantity col-6 text-center no-spinner border-0"
                              name="Lines"
                              data-line-index="1"
                              value={item.quantity || 1}
                              min="1"
                              readOnly
                            />
                            <button
                              type="button"
                              name="plus"
                              className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                              onClick={() => handleIncrease(item.id)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cart-bottom pt-4">
                <div className="cart-summary">
                  <div className="cart-summary-info">
                    <div className="cart-opener-group  divide-dashed divide-y divide-neutral-50">
                      <div
                        className="cart-opener-item"
                        style={{ display: "none" }}
                      >
                        <div className="bill-field  space-y-3 hidden ">
                          <div className="flex items-center">
                            <div className="flex items-center ">
                              <input
                                className="invoice"
                                type="hidden"
                                name="attributes[Xuất hóa đơn]"
                                value="không"
                              />
                              <input
                                className="invoice-checkbox form-checkbox"
                                type="checkbox"
                              />
                            </div>
                            <div className="ml-2 text-sm">
                              <label>Xuất hóa đơn</label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="label block mb-2">
                              Tên công ty
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              name="attributes[Tên công ty]"
                              value=""
                              data-rules="['required']"
                              data-messages="{'required':'Trường này không được bỏ trống' }"
                              placeholder="Tên công ty"
                            />
                            <span className="error  text-error"></span>
                          </div>
                          <div className="form-group">
                            <label className="label block mb-2">
                              Mã số thuế
                            </label>
                            <input
                              type="number"
                              className="form-input"
                              name="attributes[Mã số thuế]"
                              value=""
                              data-rules="['minLength:10','required']"
                              data-messages="{ 'minLength:10': 'Số kí tự tối thiểu [size]', 'require':'Trường này không được bỏ trống' }"
                              placeholder="Mã số thuế"
                            />
                            <span className="error text-error"></span>
                          </div>
                          <div className="form-group">
                            <label className="label block mb-2">
                              Địa chỉ công ty
                            </label>
                            <textarea
                              className="form-textarea"
                              data-rules="['required']"
                              data-messages="{'required':'Trường này không được bỏ trống' }"
                              name="attributes[Địa chỉ công ty]"
                              placeholder="Địa chỉ công ty"
                            ></textarea>
                            <span className="error  text-error"></span>
                          </div>
                          <div className="form-group">
                            <label className="label block mb-2">
                              Email nhận hóa đơn
                            </label>
                            <input
                              type="email"
                              className="form-input"
                              name="attributes[Email nhận hóa đơn]"
                              value=""
                              placeholder="Email nhận hóa đơn"
                              data-rules="['required','email']"
                              data-messages="{'required':'Trường này không được bỏ trống', 'email': 'Email không đúng định dạng' }"
                            />
                            <span className="error  text-error"></span>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 md:py-4 flex items-center justify-between w-full"
                            data-portal="#cart-vat-drawer"
                          >
                            <p className="flex items-center gap-1">
                              <i className="icon icon-receipt"></i>
                              <span className="line-clamp-1">
                                {" "}
                                Xuất hóa đơn{" "}
                              </span>
                            </p>
                            <button type="button" className="flex items-center">
                              Thay đổi
                              <i className="icon icon-carret-right ml-2  flex items-center"></i>
                            </button>
                          </div>
                        </portal-opener>
                      </div>
                      <div
                        className="cart-opener-item"
                        style={{ display: "none" }}
                      >
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 md:py-4 flex items-center justify-between w-full"
                            data-portal="#cart-delivery-drawer"
                          >
                            <p className="flex items-center gap-1">
                              <i className="icon icon-time"></i>
                              <span className="line-clamp-1">
                                Hẹn giờ nhận hàng{" "}
                              </span>
                            </p>
                            <button type="button" className="flex items-center">
                              Thay đổi
                              <i className="icon icon-carret-right ml-2  flex items-center"></i>
                            </button>
                            <input
                              type="hidden"
                              name="attributes[Hẹn giờ nhận hàng]"
                              value=""
                            />
                            <input
                              type="hidden"
                              name="attributes[Ngày nhận hàng]"
                              value=""
                            />
                            <input
                              type="hidden"
                              name="attributes[Thời gian nhận hàng]"
                              value=""
                            />
                          </div>
                        </portal-opener>
                      </div>
                      <div
                        className="cart-opener-item"
                        style={{ display: "none" }}
                      >
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 md:py-4 flex items-center justify-between w-full"
                            data-portal="#cart-note-drawer"
                          >
                            <p className="flex items-center gap-1">
                              <i className="icon icon-stickynote"></i>
                              <span className="line-clamp-1">
                                {" "}
                                Ghi chú đơn hàng{" "}
                              </span>
                            </p>
                            <button type="button" className="flex items-center">
                              Thay đổi
                              <i className="icon icon-carret-right ml-2  flex items-center"></i>
                            </button>
                            <textarea
                              className="form-textarea hidden"
                              name="note"
                            ></textarea>
                          </div>
                        </portal-opener>
                      </div>
                      <div
                        className="cart-opener-item"
                        style={{ display: "none" }}
                      >
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 md:py-4 flex items-center justify-between w-full"
                            data-portal="#coupon-drawer"
                          >
                            <p className="flex items-center gap-1">
                              <i className="icon icon-ticket-discount"></i>
                              <span className="line-clamp-1">
                                {" "}
                                Mã giảm giá{" "}
                              </span>
                            </p>
                            <button type="button" className="flex items-center">
                              Chọn
                              <i className="icon icon-carret-right ml-2  flex items-center"></i>
                            </button>
                          </div>
                        </portal-opener>
                      </div>
                    </div>
                    <div className="border-top">
                      <div className="cart-total py-3 d-flex align-items-start justify-content-between w-100 ">
                        <p className="fw-semibold text-black">TỔNG CỘNG</p>
                        <div className="d-flex flex-column align-items-end">
                          <div className="price text-active fw-semibold">
                            {total.toLocaleString("vi-VN")}₫
                          </div>
                          <span className="loading-icon gap-1 hidden items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                            <span className="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                            <span className="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>
                          </span>
                          <div className="fs-7 text-secondary cart-vat-note">
                            Nhập mã giảm giá ở trang thanh toán
                          </div>
                        </div>
                      </div>
                      <div className="cart-submit">
                        <button
                          type="submit"
                          className="btn w-100 btn fw-semibold  bg-success text-white d-flex justify-content-center align-items-center rounded-5 py-2"
                          onClick={handleCheckout}
                        >
                          THANH TOÁN
                          <i className="bi bi-arrow-bar-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
