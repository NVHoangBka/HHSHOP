import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserController from "../../../../controllers/UserController";

const userController = new UserController();

const CheckOrder = ({ orderController }) => {
  const [checkType, setCheckType] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchCheckOrder = async () => {
  //     try {
  //       const result = await orderController.getOrders();
  //       console.log(result);
  //     } catch (error) {}
  //   };
  //   fetchCheckOrder();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = {
        email: emailAddress,
        phoneNumber,
      };
      const result = await userController.getAllUsers(userData);
      console.log(result);
    } catch (error) {}

    // Ví dụ gọi API kiểm tra đơn hàng ở đây
    // const result = await fetchCheckOrder({
    //   checkType,
    //   phoneNumber,
    //   emailAddress,
    // });

    // Giả lập không tìm thấy
    setError("Không tìm thấy dữ liệu đơn hàng");
  };

  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title="Trang chủ"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Trang chủ
              </Link>
              <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">Kiểm tra đơn hàng</span>
            </li>
          </ul>
        </div>
      </div>
      <section class="section main-page pb-5">
        <div class="container">
          <div class="grid justify-content-center mx-5">
            <div>
              <div class="bg-white rounded px-3 py-4 mb-5 mx-5">
                <h1 class="fw-semibold mb-2 fs-3">Kiểm tra đơn hàng</h1>
                <div class="page-content py-5 mx-1 bg-body-secondary">
                  <div class="rte">
                    <div class="prose w-100 content">
                      <div class="container-fluid">
                        <div class="row justify-content-center">
                          <div class="col-6 main-content bg-white p-4 rounded">
                            <div
                              class="container ng-scope border p-3"
                              ng-app="checkOrderApp"
                              ng-controller="checkOrderCtrl"
                            >
                              <div class="search-test">
                                <div class="">
                                  <div id="search-box-test ">
                                    <div className="d-flex fw-semibold border-bottom w-100 d-flex align-item-center pb-3 justify-content-center">
                                      <i className="bi bi-search me-1"></i>
                                      <p className="m-0">
                                        Kiểm tra đơn hàng của bạn
                                      </p>
                                    </div>
                                    <div class="title-text fs-7">
                                      <form onSubmit={handleSubmit}>
                                        {/* Chọn loại kiểm tra */}
                                        <div class="my-3">
                                          <label class="form-label mb-2">
                                            <span>Kiểm tra bằng</span>
                                          </label>
                                          <div class="radio-inline d-flex align-items-center">
                                            {[
                                              {
                                                value: "1",
                                                label: "Số điện thoại",
                                              },
                                              { value: "2", label: "Email" },
                                              {
                                                value: "3",
                                                label: "Số điện thoại và Email",
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
                                                  class="me-1"
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
                                          <div className="mb-3 fs-7">
                                            <label
                                              htmlFor="phoneNumber"
                                              className="form-label"
                                            >
                                              Số điện thoại
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control fs-7"
                                              id="phoneNumber"
                                              placeholder="0909 xxx xxx"
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
                                          <div className="mb-4">
                                            <label
                                              htmlFor="emailAddress"
                                              className="form-label"
                                            >
                                              Địa chỉ Email
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control fs-7"
                                              id="emailAddress"
                                              placeholder="Email@gmail.com"
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
                                            Kiểm tra
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                </div>

                                <div id="show" class="">
                                  <div
                                    class="error"
                                    ng-if="data.orders.length == 0"
                                  >
                                    <p id="error" class="text-danger"></p>
                                    <p
                                      id="empty-error"
                                      class="text-danger empty-error"
                                    >
                                      <b>Không tìm thấy dữ liệu đơn hàng</b>
                                    </p>
                                    <p>
                                      <i class="fa fa-credit-card text-muted"></i>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="resize-sensor">
                              <div class="resize-sensor-expand">
                                <div></div>
                              </div>
                              <div class="resize-sensor-shrink">
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
