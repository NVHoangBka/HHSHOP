import { set } from "lodash";
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
  const [showBillInfo, setShowBillInfo] = useState(true);
  const [showTime, setShowTime] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [showVocher, setShowVocher] = useState(true);

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

  const toggleShowBillInfo = () => {
    setShowBillInfo(!showBillInfo);
  };

  const toggleShowTime = () => {
    setShowTime(!showTime);
  };

  const toggleShowNote = () => {
    setShowNote(!showNote);
  };

  const toggleShowVocher = () => {
    setShowVocher(!showVocher);
  };

  return (
    <div className="d-flex flex-column end-0 h-100">
      <div className="cart-header d-flex justify-content-between align-items-center border-bottom me-2">
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
                    <div className="cart-opener-group row align-items-center mb-3 ">
                      <div className="cart-opener-item col-3 ">
                        <div
                          className="bill-field slide-right position-absolute py-4 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showBillInfo}
                        >
                          <div className=" bill-header">
                            <div className="d-flex align-items-center mb-3">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowBillInfo}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2"></i>
                              </p>
                              <h3 className="fw-bold m-0">
                                Xuất hoá đơn công ty
                              </h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="d-flex align-items-center mb-3">
                              <input
                                className="invoice fs-5"
                                type="hidden"
                                name="attributes[Xuất hóa đơn]"
                                value="không"
                              />
                              <input
                                className="invoice-checkbox form-checkbox fs-5"
                                type="checkbox"
                              />
                              <div className="ms-2 text-sm ">
                                <label>Xuất hóa đơn</label>
                              </div>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Tên công ty
                              </label>
                              <input
                                type="text"
                                className="form-input w-100 p-2 rounded outline-none border"
                                name=""
                                placeholder="Tên công ty"
                              />
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Mã số thuế
                              </label>
                              <input
                                type="number"
                                className="form-input w-100 p-2 rounded outline-none border"
                                placeholder="Mã số thuế"
                              />
                              <span className="error text-error"></span>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Địa chỉ công ty
                              </label>
                              <textarea
                                className="form-textarea w-100 p-2 rounded outline-none border"
                                placeholder="Địa chỉ công ty"
                              ></textarea>
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Email nhận hóa đơn
                              </label>
                              <input
                                type="email"
                                className="form-input w-100 p-2 rounded outline-none border"
                                placeholder="Email nhận hóa đơn"
                              />
                              <span className="error  text-error"></span>
                            </div>
                          </div>
                          <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-2 px-4 mx-3 mb-4 text-white fw-semibold w-100"
                            >
                              Lưu thông tin
                            </button>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer d-flex align-items-center justify-content-between w-100"
                            data-portal="#cart-vat-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowBillInfo}
                            >
                              <i className="bi bi-receipt"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                Xuất hóa đơn
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>
                      <div className="cart-opener-item col-3">
                        <div
                          className="time-field slide-right position-absolute py-4 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showTime}
                        >
                          <div className=" time-header">
                            <div className="d-flex align-items-center mb-3">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowTime}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2"></i>
                              </p>
                              <h3 className="fw-bold m-0">Hẹn giờ nhận hàng</h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="d-flex align-items-center mb-3">
                              <input className="invoice fs-5" type="hidden" />
                              <input
                                className="invoice-checkbox form-checkbox fs-5"
                                type="checkbox"
                              />
                              <div className="ms-2 text-sm ">
                                <label>Hẹn giờ giao hàng</label>
                              </div>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Ngày nhận hàng
                              </label>
                              <input
                                type="date"
                                className="form-input w-100 p-2 rounded outline-none border"
                                name=""
                                placeholder="Tên công ty"
                              />
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Thời gian nhận hàng
                              </label>
                              <select
                                class="form-select"
                                aria-label="Default select example"
                              >
                                <option selected>---Chọn thời gian---</option>
                                <option value="1">08h00 - 12h00</option>
                                <option value="2">14h00 - 18h00</option>
                                <option value="3">19h00 - 21h00</option>
                              </select>
                              <span className="error text-error"></span>
                            </div>
                          </div>
                          <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-2 px-4 mx-3 mb-4 text-white fw-semibold w-100"
                            >
                              Lưu thông tin
                            </button>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer py-y d-flex align-items-center justify-content-between"
                            data-portal="#cart-delivery-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowTime}
                            >
                              <i className="bi bi-clock"></i>
                              <span className="line-clamp-1 text-truncate w-100  fs-7">
                                Hẹn giờ nhận hàng
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>
                      <div className="cart-opener-item col-3">
                        <div
                          className="note-field slide-right position-absolute py-4 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showNote}
                        >
                          <div className=" note-header">
                            <div className="d-flex align-items-center mb-3">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowNote}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2"></i>
                              </p>
                              <h3 className="fw-bold m-0">Ghi chú đơn hàng</h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="form-group mb-3">
                              <label className="label d-block mb-1">
                                Ghi chú
                              </label>
                              <textarea
                                className="form-textarea w-100 p-2 rounded outline-none border "
                                style={{ height: "100px" }}
                                name="note"
                                placeholder="Ghi chú đơn hàng"
                              ></textarea>
                              <span className="error  text-error"></span>
                            </div>
                          </div>
                          <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-2 px-4 mx-3 mb-4 text-white fw-semibold w-100"
                            >
                              Lưu thông tin
                            </button>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 md:py-4 flex items-center justify-between w-full"
                            data-portal="#cart-note-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowNote}
                            >
                              <i className="bi bi-stickies-fill"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                Ghi chú đơn hàng
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>
                      <div className="cart-opener-item col-3">
                        <div
                          className="vorcher-field slide-right position-absolute py-4 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showVocher}
                        >
                          <div className=" vorcher-header">
                            <div className="d-flex align-items-center mb-3">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowVocher}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2"></i>
                              </p>
                              <h3 className="fw-bold m-0">Chọn mã giảm giá</h3>
                            </div>
                          </div>
                          <div className="px-4"></div>
                          {/* <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-2 px-4 mx-3 mb-4 text-white fw-semibold w-100"
                            >
                              Lưu thông tin
                            </button>
                          </div> */}
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 d-flex align-items-center justify-content-between w-100"
                            data-portal="#coupon-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowVocher}
                            >
                              <i class="bi bi-ticket-perforated"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                Mã giảm giá
                              </span>
                            </p>
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
