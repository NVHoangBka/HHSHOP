import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Cart = ({
  isOpen,
  onClose,
  cartController,
  cartItems: propCartItems,
  onCartChange,
}) => {
  const navigate = useNavigate();
  const [t, i18n] = useTranslation;
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
    navigate(`/checkout`);
  };
  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-xl-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("header.home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("header.home")}
              </Link>
              <span className="mx-xl-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">{t("cart.title")}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="section section-main-cart pb-5">
        <div className="container bg-white">
          <div className="row px-xl-4">
            <div className="cart-left col-xl-8">
              <div className="cart-header d-flex justify-content-between align-items-center">
                <h2 className="card-title text-black pb-3 pt-4 px-1 fw-bold">
                  {t("cart.title")}
                </h2>
              </div>
              <div className="card-body">
                <div className="cart-content px-xl-2 py-xl-3">
                  <table class="table align-middle">
                    <thead>
                      <tr className="text-center">
                        <th style={{ width: "50%" }}>{t("cart.product")}</th>
                        <th style={{ width: "15%" }}>{t("cart.unit-price")}</th>
                        <th style={{ width: "15%" }}>{t("cart.quantity")}</th>
                        <th style={{ width: "15%" }}>{t("cart.subtotal")}</th>
                        <th style={{ width: "10%" }}></th>
                      </tr>
                    </thead>
                    {cartItems.length === 0 ? (
                      <tbody>
                        <tr>{t("cart.no-cart")}</tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {cartItems.map((item) => (
                          <tr
                            className="cart-item py-xl-3 border-bottom text-center"
                            key={item.id}
                          >
                            <td>
                              <div className="d-flex text-start align-items-center">
                                <Link
                                  className="cart-item__image"
                                  to={`/products/slug/${item.slug}`}
                                  title={item.name}
                                >
                                  <img
                                    src={
                                      item.image ||
                                      "https://via.placeholder.com/60"
                                    } // Hiển thị placeholder nếu không có image
                                    className="me-xl-2 rounded"
                                    alt={item.name}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Link>
                                <div>
                                  <p className="cart-item__name mb-xl-0 fw-semibold small">
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
                            </td>
                            <td className="price text-center">
                              {item.discountPrice ? (
                                <div>
                                  <p className="m-0 text-danger fw-bold">
                                    {item.discountPrice.toLocaleString("vi-VN")}
                                    ₫
                                  </p>
                                  <p className="m-0 text-decoration-line-through">
                                    {item.price.toLocaleString("vi-VN")}₫
                                  </p>
                                </div>
                              ) : (
                                <p className="m-0 text-danger fw-bold">
                                  {item.price.toLocaleString("vi-VN")}₫
                                </p>
                              )}
                            </td>
                            <td className="quantity text-center">
                              <div className="input-group custom-number-input cart-item-quantity d-flex border rounded">
                                <button
                                  type="button"
                                  name="minus"
                                  className="col-xl-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                                  onClick={() => handleDecrease(item.id)}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="number"
                                  className="form-quantity col-xl-6 text-center no-spinner border-0"
                                  name="Lines"
                                  data-line-index="1"
                                  value={item.quantity || 1}
                                  min="1"
                                  readOnly
                                />
                                <button
                                  type="button"
                                  name="plus"
                                  className="col-xl-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                                  onClick={() => handleIncrease(item.id)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="total text-danger fw-bold">
                              {(
                                (item.discountPrice || item.price) *
                                item.quantity
                              ).toLocaleString("vi-VN")}
                              ₫
                            </td>
                            <td>
                              <div className="cart-product-col d-flex justify-content-between align-items-start">
                                <button
                                  className="btn btn-sm px-xl-2 rounded-circle text-muted"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
            <div className="cart-right my-xl-4 col-xl-4 border p-xl-3 border-success rounded-4">
              <div className="cart-summary">
                <div className="cart-summary-info">
                  <div className="cart-opener-group  divide-dashed divide-y divide-neutral-50">
                    <div className="cart-opener-item border-bottom">
                      <div
                        className="modal fade"
                        id="billInfoModal"
                        tabIndex="-1"
                        aria-labelledby="billInfoModalLabel"
                        aria-hidden="true"
                      >
                        <div className="bill-field modal-dialog slide-right position-absolute px-xl-3 py-xl-4 top-0 bg-white end-0 h-100 shadow-lg w-25 m-0">
                          <div className="me-xl-5">
                            <div className="d-flex align-items-center mb-xl-3">
                              <i className="bi bi-arrow-left fs-4 me-xl-2"></i>
                              <h3 className="fw-bold m-0">
                                {t("cart.issue-company-invoices")}
                              </h3>
                            </div>
                          </div>
                          <div className="ps-4">
                            <div className="d-flex align-items-center mb-xl-3">
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
                              <div className="ms-xl-2 text-sm">
                                <label>{t("cart.issue-invoices")}</label>
                              </div>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-1">
                                {t("cart.name-company")}
                              </label>
                              <input
                                type="text"
                                className="form-input w-100 p-xl-2 rounded outline-none border"
                                name=""
                                placeholder={t("cart.name-company")}
                              />
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-1">
                                {t("cart.tax-code")}
                              </label>
                              <input
                                type="number"
                                className="form-input w-100 p-xl-2 rounded outline-none border"
                                placeholder={t("cart.tax-code")}
                              />
                              <span className="error text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-1">
                                {t("cart.address-company")}
                              </label>
                              <textarea
                                className="form-textarea w-100 p-xl-2 rounded outline-none border"
                                placeholder={t("cart.address-company")}
                              ></textarea>
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-xl-1">
                                {t("cart.email-invoices")}
                              </label>
                              <input
                                type="email"
                                className="form-input w-100 p-xl-2 rounded outline-none border"
                                placeholder={t("cart.email-invoices")}
                              />
                              <span className="error  text-error"></span>
                            </div>
                          </div>
                          <div className="mx-xl-5 mt-xl-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-xl-2 px-xl-4 mx-xl-3 mb-xl-4 text-white fw-semibold w-100"
                            >
                              {t("btn.save")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <portal-opener>
                        <div className="cart-voucer text-secondary py-xl-2 d-flex align-items-center justify-content-between w-100 py-xl-3">
                          <p className="d-flex align-items-center m-0 fs-6">
                            <i className="bi bi-receipt "></i>
                            <span className="line-clamp-1 ms-xl-1">
                              {t("cart.issue-invoices")}
                            </span>
                          </p>
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#billInfoModal"
                            className="d-flex align-items-center border-0 bg-transparent text-secondary text-hover"
                          >
                            {t("cart.change")}
                            <i className="bi bi-caret-right ms-xl-2  d-flex align-items-center"></i>
                          </button>
                        </div>
                      </portal-opener>
                    </div>
                    <div className="cart-opener-item border-bottom">
                      <div
                        className="modal fade"
                        id="timeModal"
                        tabIndex="-1"
                        aria-labelledby="timeModalLabel"
                        aria-hidden="true"
                      >
                        <div className="time-field modal-dialog slide-right position-absolute px-xl-3 py-xl-4 top-0 bg-white end-0 h-100 shadow-lg w-25 m-0">
                          <div className="me-xl-5">
                            <div className="d-flex align-items-center mb-xl-3">
                              <i className="bi bi-arrow-left fs-4 me-xl-2"></i>
                              <h3 className="fw-bold m-0">
                                {t("cart.schedule-receive-timer")}
                              </h3>
                            </div>
                          </div>
                          <div className="ps-xl-4">
                            <div className="d-flex align-items-center mb-xl-3">
                              <input className="invoice fs-5" type="hidden" />
                              <input
                                className="invoice-checkbox form-checkbox fs-5"
                                type="checkbox"
                              />
                              <div className="ms-xl-2 text-sm ">
                                <label>
                                  {" "}
                                  {t("cart.schedule-receive-timer")}
                                </label>
                              </div>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-1">
                                {t("cart.receive-day")}
                              </label>
                              <input
                                type="date"
                                className="form-input w-100 p-xl-2 rounded outline-none border"
                              />
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-xl-1">
                                {t("cart.receive-time")}
                              </label>
                              <select
                                class="form-select"
                                aria-label="Default select example"
                              >
                                <option selected>
                                  -- {t("cart.chose-time")} --
                                </option>
                                <option value={1}>08h00 - 11h00</option>
                                <option value={2}>14h00 - 18h00</option>
                                <option value={3}>19h00 - 22h00</option>
                              </select>
                              <span className="error text-error"></span>
                            </div>
                          </div>
                          <div className="mx-xl-5 mt-xl-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-xl-2 px-xl-4 mx-xl-3 mb-xl-4 text-white fw-semibold w-100"
                            >
                              {t("btn.save")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <portal-opener>
                        <div
                          className="cart-voucer text-secondary d-flex align-items-center justify-content-between w-100 py-xl-3"
                          data-portal="#cart-delivery-drawer"
                        >
                          <p className="d-flex align-items-center m-0 fs-6">
                            <i className="bi bi-clock"></i>
                            <span className="line-clamp-1 ms-1">
                              {t("cart.schedule-receive-timer")}
                            </span>
                          </p>
                          <button
                            type="button"
                            className="d-flex align-items-center border-0 bg-transparent text-secondary text-hover"
                            data-bs-toggle="modal"
                            data-bs-target="#timeModal"
                          >
                            {t("cart.change")}
                            <i className="bi bi-caret-right ms-xl-2  d-flex align-items-center"></i>
                          </button>
                        </div>
                      </portal-opener>
                    </div>
                    <div className="cart-opener-item border-bottom">
                      <div
                        className="modal fade"
                        id="noteModal"
                        tabIndex="-1"
                        aria-labelledby="noteModalLabel"
                        aria-hidden="true"
                      >
                        <div className="note-field modal-dialog slide-right position-absolute px-xl-3 py-xl-4 top-0 bg-white end-0 h-100 shadow-lg w-25 m-0">
                          <div className="me-xl-5">
                            <div className="d-flex align-items-center mb-xl-3">
                              <i className="bi bi-arrow-left fs-4 me-xl-2"></i>
                              <h3 className="fw-bold m-0">
                                {" "}
                                {t("cart.note-order")}
                              </h3>
                            </div>
                          </div>
                          <div className="ps-xl-4">
                            <div className="form-group mb-xl-3">
                              <label className="label d-block mb-xl-1">
                                {t("cart.note")}
                              </label>
                              <textarea
                                className="form-textarea w-100 p-xl-2 rounded outline-none border "
                                style={{ height: "100px" }}
                                name="note"
                              ></textarea>
                              <span className="error  text-error"></span>
                            </div>
                          </div>
                          <div className="mx-xl-5 mt-xl-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-xl-2 px-xl-4 mx-xl-3 mb-xl-4 text-white fw-semibold w-100"
                            >
                              {t("btn.save")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <portal-opener>
                        <div
                          className="cart-voucer text-secondary d-flex align-items-center justify-content-between w-100 py-xl-3 "
                          data-portal="#cart-note-drawer"
                        >
                          <p className="d-flex align-items-center m-0 fs-6">
                            <i className="bi bi-sticky"></i>
                            <span className="line-clamp-1 ms-xl-1">
                              {t("cart.note-order")}
                            </span>
                          </p>
                          <button
                            type="button"
                            className="d-flex align-items-center border-0 bg-transparent text-secondary text-hover"
                            data-bs-toggle="modal"
                            data-bs-target="#noteModal"
                          >
                            {t("cart.change")}
                            <i className="bi bi-caret-right ms-xl-2  d-flex align-items-center"></i>
                          </button>
                        </div>
                      </portal-opener>
                    </div>
                    <div className="cart-opener-item border-bottom">
                      <portal-opener>
                        <div
                          className="cart-voucer text-secondary d-flex align-items-center justify-content-between w-100 py-xl-3 "
                          data-portal="#coupon-drawer"
                        >
                          <p className="d-flex align-items-center m-0 fs-6">
                            <i className="bi bi-ticket-perforated"></i>
                            <span className="line-clamp-1 ms-xl-1">
                              {t("cart.promo-code")}
                            </span>
                          </p>
                          <button
                            type="button"
                            className="d-flex align-items-center border-0 bg-transparent text-secondary text-hover"
                          >
                            {t("cart.choose")}
                            <i className="bi bi-caret-right ms-xl-2  d-flex align-items-center"></i>
                          </button>
                        </div>
                      </portal-opener>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="cart-total py-xl-3 d-flex align-items-start justify-content-between w-100 ">
                      <p className="fw-semibold text-black">
                        {" "}
                        {t("cart.total")}
                      </p>
                      <div className="d-flex flex-column align-items-end">
                        <div className="price text-active fw-semibold">
                          {total.toLocaleString("vi-VN")}₫
                        </div>
                        <div className="fs-7 text-secondary cart-vat-note">
                          {t("cart.input-promo-code-checkout")}
                        </div>
                      </div>
                    </div>
                    <div className="cart-submit d-flex justify-content-center mt-xl-1">
                      <button
                        type="submit"
                        className="btn w-75 btn fw-semibold  bg-success text-white d-flex justify-content-center align-items-center rounded-5 py-xl-2"
                        onClick={handleCheckout}
                      >
                        {t("cart.payment")}
                        <i className="bi bi-arrow-bar-right ms-xl-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
