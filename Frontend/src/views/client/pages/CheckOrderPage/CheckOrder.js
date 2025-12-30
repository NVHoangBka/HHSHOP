import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserController from "../../../../controllers/UserController";
import { useTranslation } from "react-i18next";

const userController = new UserController();

const CheckOrder = ({ orderController }) => {
  const [t] = useTranslation();
  const [checkType, setCheckType] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrders([]);
    try {
      let userData = {};

      switch (checkType) {
        case "1":
          userData = { phoneNumber };
          break;
        case "2":
          userData = { email: emailAddress };
          break;
        case "3":
          userData = { phoneNumber, email: emailAddress };
          break;
        default:
          userData = { phoneNumber, email: emailAddress };
          break;
      }
      // if (checkType === "1") {
      //   userData = { phoneNumber };
      // } else if (checkType === "2") {
      //   userData = { email: emailAddress };
      // } else if (checkType === "3") {
      //   userData = { phoneNumber, email: emailAddress };
      // }
      const userResult = await userController.getAllUsers(userData);
      if (!userResult.success) {
        setError(
          userResult.message || "Không tìm thấy người dùng với thông tin này"
        );
        setLoading(false);
        return;
      }

      const userId = userResult.user.userId;

      const ordersResult = await orderController.searchOrders(userId);
      if (ordersResult.success) {
        const orders = ordersResult.orders;
        if (orders.length > 0) {
          setOrders(orders);
        } else {
          setError(t("order.checkOrder.noOrdersFound"));
        }
      }
    } catch (error) {
      setError(t("order.checkOrder.errorNotFound"));
    }
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
              <span className="text-secondary">
                {t("order.checkOrder.pageTitle")}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <section className="section main-page pb-xl-5">
        <div className="container">
          <div className="grid justify-content-center mx-xl-5">
            <div>
              <div className="bg-white rounded px-xl-3 py-xl-4 mb-xl-5 mx-xl-5">
                <h1 className="fw-semibold mb-xl-2 fs-3">
                  {t("order.checkOrder.pageTitle")}
                </h1>
                <div className="page-content py-xl-5 mx-xl-1 bg-body-secondary">
                  <div className="rte">
                    <div className="prose w-100 content">
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                          <div className="col-xl-6 main-content bg-white p-xl-4 rounded">
                            <div
                              className="container border p-xl-3"
                              ng-app="checkOrderApp"
                              ng-controller="checkOrderCtrl"
                            >
                              <div className="search-test">
                                <div className="">
                                  <div id="search-box-test ">
                                    <div className="d-flex fw-semibold border-bottom w-100 d-flex align-item-center pb-xl-3 justify-content-center">
                                      <i className="bi bi-search me-1"></i>
                                      <p className="m-0">
                                        {t("order.checkOrder.searchTitle")}
                                      </p>
                                    </div>
                                    <div className="title-text fs-7">
                                      <form onSubmit={handleSubmit}>
                                        {/* Chọn loại kiểm tra */}
                                        <div className="my-xl-3">
                                          <label className="form-label mb-xl-2">
                                            <span>
                                              {t("order.checkOrder.checkBy")}
                                            </span>
                                          </label>
                                          <div className="radio-inline d-flex align-items-center">
                                            {[
                                              {
                                                value: "1",
                                                label: t(
                                                  "order.checkOrder.byPhone"
                                                ),
                                              },
                                              {
                                                value: "2",
                                                label: t(
                                                  "order.checkOrder.byEmail"
                                                ),
                                              },
                                              {
                                                value: "3",
                                                label: t(
                                                  "order.checkOrder.byPhoneAndEmail"
                                                ),
                                              },
                                            ].map((option) => (
                                              <div
                                                key={option.value}
                                                className="form-check fs-7"
                                              >
                                                <input
                                                  type="radio"
                                                  id={`checkType${option.value}`}
                                                  value={option.value}
                                                  name="CheckType"
                                                  className="me-1"
                                                  checked={
                                                    checkType === option.value
                                                  }
                                                  onChange={(e) =>
                                                    setCheckType(e.target.value)
                                                  }
                                                />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor={`checkType${option.value}`}
                                                >
                                                  {option.label}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Input Số điện thoại - hiện trừ khi chỉ chọn Email */}
                                        {checkType !== "2" && (
                                          <div className="mb-xl-3 fs-7">
                                            <label
                                              htmlFor="phoneNumber"
                                              className="form-label"
                                            >
                                              {t(
                                                "order.checkOrder.phoneNumber"
                                              )}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control fs-7"
                                              id="phoneNumber"
                                              placeholder={t(
                                                "order.checkOrder.phonePlaceholder"
                                              )}
                                              value={phoneNumber}
                                              onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                              }
                                              required={checkType !== "2"}
                                            />
                                          </div>
                                        )}

                                        {/* Input Email - hiện trừ khi chỉ chọn Số điện thoại */}
                                        {checkType !== "1" && (
                                          <div className="mb-xl-4">
                                            <label
                                              htmlFor="emailAddress"
                                              className="form-label"
                                            >
                                              {t(
                                                "order.checkOrder.emailAddress"
                                              )}
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control fs-7"
                                              id="emailAddress"
                                              placeholder={t(
                                                "order.checkOrder.emailPlaceholder"
                                              )}
                                              value={emailAddress}
                                              onChange={(e) =>
                                                setEmailAddress(e.target.value)
                                              }
                                              required={checkType !== "1"}
                                            />
                                          </div>
                                        )}
                                        {/* Nút submit */}
                                        <div className="d-flex justify-content-end ">
                                          <button
                                            type="submit"
                                            className="btn btn-success fs-7"
                                          >
                                            {t("btn.check")}
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                    <div className="clearfix"></div>
                                  </div>
                                </div>
                                <div id="show" className="mt-xl-5">
                                  {loading && (
                                    <div className="text-center py-xl-5">
                                      <div
                                        className="spinner-border text-success"
                                        role="status"
                                      >
                                        <span className="visually-hidden">
                                          {t("order.checkOrder.loadingText")}
                                        </span>
                                      </div>
                                      <p className="mt-xl-3">
                                        {t("order.checkOrder.loading")}
                                      </p>
                                    </div>
                                  )}

                                  {error && !loading && (
                                    <div className="alert alert-danger text-center">
                                      <strong>{error}</strong>
                                    </div>
                                  )}
                                  {!loading && !error && orders.length > 0 && (
                                    <div>
                                      <h4 className="fw-bold mb-xl-4 text-center text-success">
                                        {t("order.checkOrder.foundOrders", {
                                          count: orders.length,
                                        })}
                                      </h4>
                                      <div className="row g-4">
                                        {orders.map((order) => (
                                          <div
                                            key={order._id}
                                            className="col-xl-12"
                                          >
                                            <div className="border rounded p-xl-4 bg-light">
                                              <div className="d-flex justify-content-between align-items-center mb-xl-3">
                                                <h5 className="m-0 fw-bold">
                                                  {t(
                                                    "order.checkOrder.orderCode"
                                                  )}
                                                  : {order.orderId}
                                                </h5>
                                                <span
                                                  className={`badge bg-${
                                                    order.status === "completed"
                                                      ? "success"
                                                      : "warning"
                                                  } fs-6`}
                                                >
                                                  {t(
                                                    `order.checkOrder.status.${order.status}`
                                                  ) || order.status}
                                                </span>
                                              </div>
                                              <p className="mb-1">
                                                <strong>
                                                  {t(
                                                    "order.checkOrder.orderDate"
                                                  )}
                                                  :
                                                </strong>{" "}
                                                {new Date(
                                                  order.createdAt
                                                ).toLocaleString("vi-VN")}
                                              </p>
                                              <p className="mb-1">
                                                <strong>
                                                  {t(
                                                    "order.checkOrder.totalAmount"
                                                  )}
                                                  :
                                                </strong>{" "}
                                                {order.totalAmount.toLocaleString()}
                                                ₫
                                              </p>
                                              <p className="mb-xl-3">
                                                <strong>
                                                  {t(
                                                    "order.checkOrder.paymentStatus"
                                                  )}
                                                  :
                                                </strong>{" "}
                                                {order.paymentStatus === "paid"
                                                  ? t("order.checkOrder.paid")
                                                  : t(
                                                      "order.checkOrder.unpaid"
                                                    )}
                                              </p>

                                              <details className="mb-xl-2">
                                                <summary className="fw-semibold text-primary cursor-pointer">
                                                  {t(
                                                    "order.checkOrder.viewDetails",
                                                    {
                                                      count: order.items.length,
                                                    }
                                                  )}
                                                </summary>
                                                <ul className="list-group list-group-flush mt-xl-2">
                                                  {order.items.map(
                                                    (item, idx) => (
                                                      <li
                                                        key={idx}
                                                        className="list-group-item d-flex align-items-center py-xl-3"
                                                      >
                                                        {item.productId
                                                          ?.image && (
                                                          <img
                                                            src={
                                                              item.productId
                                                                .image
                                                            }
                                                            alt={item.name}
                                                            width="50"
                                                            className="me-xl-3 rounded"
                                                          />
                                                        )}
                                                        <div>
                                                          <strong>
                                                            {item.name}
                                                          </strong>
                                                          <br />
                                                          <small>
                                                            {t(
                                                              "order.checkOrder.quantityTimesPrice",
                                                              {
                                                                quantity:
                                                                  item.quantity,
                                                                price:
                                                                  item.price.toLocaleString(
                                                                    "vi-VN"
                                                                  ),
                                                              }
                                                            )}
                                                          </small>
                                                        </div>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </details>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="resize-sensor">
                              <div className="resize-sensor-expand">
                                <div></div>
                              </div>
                              <div className="resize-sensor-shrink">
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckOrder;
