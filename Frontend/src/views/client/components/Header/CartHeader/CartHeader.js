import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CartHeader = ({ onClose, cartController, cart, onCartChange }) => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const [showBillInfo, setShowBillInfo] = useState(true);
  const [showTime, setShowTime] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [showVocher, setShowVocher] = useState(true);

  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  const cartItems = cart?.items || [];
  const total = cart?.totalPrice ?? 0;

  const handleIncrease = async (productId, variantValue) => {
    const currentItem = cart.findItem(productId, variantValue);
    if (currentItem) {
      try {
        const updatedCart = await cartController.updateQuantity(
          productId,
          variantValue,
          currentItem.quantity + 1,
        );
        onCartChange(updatedCart);
      } catch (err) {
        console.error("handleIncrease error:", err);
      }
    }
  };

  const handleDecrease = async (productId, variantValue) => {
    const currentItem = cart.findItem(productId, variantValue);
    if (currentItem && currentItem.quantity > 1) {
      try {
        const updatedCart = await cartController.updateQuantity(
          productId,
          variantValue,
          currentItem.quantity - 1,
        );
        onCartChange(updatedCart);
      } catch (err) {
        console.error("handleDecrease error:", err);
      }
    }
  };

  const handleRemove = async (productId, variantValue) => {
    try {
      const updatedCart = await cartController.removeFromCart(
        productId,
        variantValue,
      );
      onCartChange(updatedCart);
    } catch (err) {
      console.error("handleRemove error:", err);
    }
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

  const productName = (product) => {
    return (
      product.name?.[currentLanguage] || product.name?.vi || "Chưa đặt tên"
    );
  };

  return (
    <div className="d-flex flex-column end-0 h-100">
      <div className="cart-header d-flex justify-content-between align-items-center border-bottom me-xl-2 me-2 pb-2">
        <h2 className="card-title text-black pb-xl-3 pt-xl-4 px-xl-4">
          {t("cart.title")}
        </h2>
        <button
          className="btn border rounded-circle px-xl-2 py-0 px-1 "
          onClick={onClose}
        >
          <i className="bi bi-x fs-4"></i>
        </button>
      </div>
      {/* 
    
    */}
      <div className="card-body">
        <div className="cart-content px-xl-4 px-md-3 py-xl-3 pt-md-2 h-100">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="text-black text-center">
                <img
                  src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/cart_empty_background.png?1733201190476"
                  alt=""
                />
                <h2 className="font-bold">{t("cart.no-cart")}</h2>
                <p>{t("cart.desription-no-cart")}</p>
                <Link
                  className="btn font-bold bg-success text-white rounded-pill"
                  to="/products/all"
                  title={t("cart.continue-shopping")}
                >
                  {t("cart.continue-shopping")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex h-100 flex-column justify-content-between">
              <div className="cart-top pt-1 overflow-y-auto ">
                <div className="cart-table">
                  <div className="cart-items">
                    {cartItems.map((item, index) =>
                      // <div
                      //   key={index}
                      //   className="cart-item py-xl-3 py-2 border-bottom"
                      // >
                      //   <div className="cart-product-col d-flex justify-content-between align-items-start">
                      //     <div className="d-flex">
                      //       <Link
                      //         className="cart-item__image"
                      //         to={`/products/slug/${getTranslated(item.slug) || item.slug}`}
                      //         title={productName(item)}
                      //       >
                      //         <img
                      //           src={
                      //             item.displayImage ||
                      //             item.image ||
                      //             "https://via.placeholder.com/60"
                      //           }
                      //           className="me-xl-2 rounded"
                      //           alt={productName(item)}
                      //           style={{
                      //             width: "60px",
                      //             height: "60px",
                      //             objectFit: "cover",
                      //           }}
                      //         />
                      //       </Link>
                      //       <div className="ms-md-2">
                      //         <p className="cart-item__name mb-0 fw-semibold small">
                      //           <Link
                      //             to={`/products/slug/${getTranslated(item.slug)}`}
                      //             title={productName(item)}
                      //             className="link text-decoration-none text-dark"
                      //           >
                      //             {productName(item)}
                      //           </Link>
                      //         </p>
                      //         {item.variantValue &&
                      //           item.variantValue !== "default" && (
                      //             <span className="cart-item__variant text-muted fs-7">
                      //               {item.variantValue}
                      //             </span>
                      //           )}
                      //       </div>
                      //     </div>
                      //     <button
                      //       className="btn btn-sm px-xl-2 rounded-circle text-muted"
                      //       onClick={() =>
                      //         handleRemove(item.productId, item.variantValue)
                      //       }
                      //     >
                      //       <i className="bi bi-x-lg"></i>
                      //     </button>
                      //   </div>

                      //   <div className="px-xl-3 px-3 ms-xl-5 ms-5 d-flex justify-content-between cart-quantity-col">
                      //     <div className="cart-unit-price-col">
                      //       <div className="price text-danger fw-bold">
                      //         {item.subtotal.toLocaleString("vi-VN")}₫
                      //       </div>
                      //     </div>
                      //     <div
                      //       className="input-group custom-number-input cart-item-quantity d-flex border rounded row"
                      //       style={{ maxWidth: "100px", height: "28px" }}
                      //     >
                      //       <button
                      //         type="button"
                      //         name="minus"
                      //         className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                      //         onClick={() =>
                      //           handleDecrease(
                      //             item.productId,
                      //             item.variantValue,
                      //           )
                      //         }
                      //       >
                      //         <i className="bi bi-dash"></i>
                      //       </button>
                      //       <input
                      //         type="number"
                      //         className="form-quantity col-6 text-center no-spinner border-0"
                      //         name="Lines"
                      //         data-line-index="1"
                      //         value={item.quantity}
                      //         min="1"
                      //         readOnly
                      //       />
                      //       <button
                      //         type="button"
                      //         name="plus"
                      //         className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                      //         onClick={() =>
                      //           handleIncrease(
                      //             item.productId,
                      //             item.variantValue,
                      //           )
                      //         }
                      //       >
                      //         <i className="bi bi-plus"></i>
                      //       </button>
                      //     </div>
                      //   </div>
                      // </div>
                      console.log(item),
                    )}
                  </div>
                </div>
              </div>
              <div className="cart-bottom pt-xl-4 pt-4">
                <div className="cart-summary">
                  <div className="cart-summary-info">
                    <div className="cart-opener-group row align-items-center mb-3">
                      {/* Xuất hóa đơn */}
                      <div className="cart-opener-item col-3">
                        <div
                          className="bill-field slide-right position-absolute py-xl-4 py-3 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
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
                                {t("cart.issue-company-invoices")}
                              </h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="d-flex align-items-center mb-xl-3 mb-2">
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
                                <label>{t("cart.issue-invoices")}</label>
                              </div>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1 ">
                                {t("cart.name-company")}
                              </label>
                              <input
                                type="text"
                                className="form-input w-100 p-xl-2 p-1 rounded outline-none border"
                                name=""
                                placeholder={t("cart.name-company")}
                              />
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.tax-code")}
                              </label>
                              <input
                                type="number"
                                className="form-input w-100 p-xl-2 p-xl-2 p-1 rounded outline-none border"
                                placeholder={t("cart.tax-code")}
                              />
                              <span className="error text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.address-company")}
                              </label>
                              <textarea
                                className="form-textarea w-100 p-xl-2 p-1 rounded outline-none border"
                                placeholder={t("cart.address-company")}
                              ></textarea>
                              <span className="error  text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.email-invoices")}
                              </label>
                              <input
                                type="email"
                                className="form-input w-100 p-xl-2 p-1 rounded outline-none border"
                                placeholder={t("cart.email-invoices")}
                              />
                              <span className="error  text-error"></span>
                            </div>
                          </div>
                          <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-xl-2 px-xl-4 mx-xl-3 mb-xl-4 text-white fw-semibold w-100"
                            >
                              {t("btn.save")}
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
                                {t("cart.issue-invoices")}
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>

                      {/* Hẹn giờ */}
                      <div className="cart-opener-item col-3">
                        <div
                          className="time-field slide-right position-absolute py-xl-4 py-3 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
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
                              <h3 className="fw-bold m-0">
                                {t("cart.schedule-receive-timer")}
                              </h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="d-flex align-items-center mb-xl-3 mb-2">
                              <input className="invoice fs-5" type="hidden" />
                              <input
                                className="invoice-checkbox form-checkbox fs-5"
                                type="checkbox"
                              />
                              <div className="ms-2 text-sm ">
                                <label>
                                  {t("cart.schedule-delivery-timer")}
                                </label>
                              </div>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.receive-day")}
                              </label>
                              <input
                                type="date"
                                className="form-input w-100 p-xl-2 p-2 rounded outline-none border"
                                name=""
                              />
                              <span className="error text-error"></span>
                            </div>
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.receive-time")}
                              </label>
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                defaultValue="active"
                              >
                                <option value="active">
                                  ---{t("cart.chose-time")}---
                                </option>
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
                              {t("btn.save")}
                            </button>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer d-flex align-items-center justify-content-between"
                            data-portal="#cart-delivery-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowTime}
                            >
                              <i className="bi bi-clock"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                {t("cart.schedule-receive-timer")}
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>

                      {/* Ghi chú */}
                      <div className="cart-opener-item col-3">
                        <div
                          className="note-field slide-right position-absolute py-xl-4 py-3 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showNote}
                        >
                          <div className=" note-header">
                            <div className="d-flex align-items-center mb-xl-3 mb-2">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowNote}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2 "></i>
                              </p>
                              <h3 className="fw-bold m-0">
                                {t("cart.note-order")}
                              </h3>
                            </div>
                          </div>
                          <div className="px-4">
                            <div className="form-group mb-xl-3 mb-2">
                              <label className="label d-block mb-1">
                                {t("cart.note")}
                              </label>
                              <textarea
                                className="form-textarea w-100 p-2 rounded outline-none border "
                                style={{ height: "100px" }}
                                name="note"
                                placeholder={t("cart.note-order")}
                              ></textarea>
                              <span className="error text-error"></span>
                            </div>
                          </div>
                          <div className="mx-5 mt-4">
                            <button
                              type="button"
                              className="btn btn-success d-flex justify-content-center align-items-center rounded-5 py-2 px-4 mx-3 mb-4 text-white fw-semibold w-100"
                            >
                              {t("btn.save")}
                            </button>
                          </div>
                        </div>
                        <portal-opener>
                          <div
                            className="cart-voucer text-neutral-300 py-2 d-flex align-items-center justify-content-between w-100"
                            data-portal="#cart-note-drawer"
                          >
                            <p
                              className="d-flex align-items-center flex-column w-100 m-0 cursor-pointer text-secondary"
                              onClick={toggleShowNote}
                            >
                              <i className="bi bi-stickies-fill"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                {t("cart.note-order")}
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>

                      {/* Voucher */}
                      <div className="cart-opener-item col-3">
                        <div
                          className="vorcher-field slide-right position-absolute py-xl-4 py-3 ps-3 top-0 bg-white end-0 h-100 shadow-lg w-100"
                          hidden={showVocher}
                        >
                          <div className=" vorcher-header">
                            <div className="d-flex align-items-center mb-xl-3 mb-2">
                              <p
                                className="cursor-pointer m-0"
                                onClick={toggleShowVocher}
                              >
                                <i className="bi bi-arrow-left fs-4 me-2"></i>
                              </p>
                              <h3 className="fw-bold m-0">
                                {t("cart.choose-a-promo-code")}
                              </h3>
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
                              <i className="bi bi-ticket-perforated"></i>
                              <span className="line-clamp-1 text-truncate w-100 fs-7">
                                {t("cart.promo-code")}
                              </span>
                            </p>
                          </div>
                        </portal-opener>
                      </div>
                    </div>

                    <div className="border-top">
                      <div className="cart-total py-xl-3 py-md-2 d-flex align-items-start justify-content-between w-100 ">
                        <p className="fw-semibold text-black text-uppercase">
                          {t("cart.total")}
                        </p>
                        <div className="d-flex flex-column align-items-end">
                          <div className="price text-active fw-semibold">
                            {total.toLocaleString("vi-VN")}₫
                          </div>
                          <span className="loading-icon gap-1 hidden items-center justify-center">
                            <span className=" animate-pulse"></span>

                            <span className=" animate-pulse"></span>

                            <span className=" animate-pulse"></span>
                          </span>
                          <div className="fs-7 text-secondary cart-vat-note">
                            {t("cart.input-promo-code-checkout")}
                          </div>
                        </div>
                      </div>
                      <div className="cart-submit">
                        <button
                          type="submit"
                          className="btn w-100 btn fw-semibold text-uppercase bg-success text-white d-flex justify-content-center align-items-center rounded-5 py-2"
                          onClick={handleCheckout}
                        >
                          {t("cart.payment")}
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
