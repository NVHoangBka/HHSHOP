import React from "react";
import { Link } from "react-router-dom";

const CheckOrder = () => {
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

                <div class="page-content my-5">
                  <div class="rte">
                    <div class="prose w-100 content">
                      <div className="col-6 d-flex flex-wrap">
                        <div class="container-fluid">
                          <div class="row">
                            <div class="col-md-12 main-content position-relative">
                              <div
                                class="container ng-scope"
                                ng-app="checkOrderApp"
                                ng-controller="checkOrderCtrl"
                              >
                                <div class="os-search-test row">
                                  <div class="col-md-5">
                                    <div id="os-search-box-test">
                                      <div className="d-flex fw-semibold border-bottom w-100">
                                        <i className="bi bi-search me-1"></i>
                                        <p>Kiểm tra đơn hàng của bạn</p>
                                      </div>
                                      <div class="title-text">
                                        <form
                                          name="form"
                                          ng-submit="submit()"
                                          novalidate=""
                                          class="ng-pristine ng-valid ng-submitted"
                                        >
                                          <div ng-init="model.StoreId= 3736"></div>
                                          <div ng-init="config.CheckType= 4"></div>
                                          <div ng-init="model.CheckType= 1"></div>

                                          <div class="check-type">
                                            <label class="check-order-text">
                                              <span class="tieu-de-lua-chon">
                                                Kiểm tra bằng
                                              </span>
                                            </label>
                                            <div class="radio-inline">
                                              <div>
                                                <input
                                                  type="radio"
                                                  ng-model="model.CheckType"
                                                  value="1"
                                                  name="CheckType"
                                                  class="ng-pristine ng-untouched ng-valid"
                                                />
                                                <span class="check-order-text so-dien-thoai">
                                                  Số điện thoại
                                                </span>
                                              </div>
                                              <div>
                                                <input
                                                  type="radio"
                                                  ng-model="model.CheckType"
                                                  value="2"
                                                  name="CheckType"
                                                  class="ng-pristine ng-untouched ng-valid"
                                                />
                                                <span class="check-order-text email-custom">
                                                  Email
                                                </span>
                                              </div>
                                              <div>
                                                <input
                                                  type="radio"
                                                  ng-model="model.CheckType"
                                                  value="3"
                                                  name="CheckType"
                                                  class="ng-pristine ng-untouched ng-valid"
                                                />
                                                <span class="check-order-text phone-and-email-check">
                                                  Số điện thoại và Email
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            class="form-group ng-scope"
                                            ng-if="model.CheckType != 2"
                                          >
                                            <label
                                              for="PhoneNumber"
                                              class="control-label check-order-text"
                                            >
                                              <span class="so-dien-thoai">
                                                Số điện thoại
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              value=""
                                              name="PhoneNumber"
                                              id="PhoneNumber"
                                              placeholder="0909 xxx xxx"
                                              data-val-regex-pattern="^[0-9]*$"
                                              data-val-regex="Chỉ được nhập số"
                                              data-val="true"
                                              class="form-control ng-pristine ng-valid ng-touched"
                                              ng-model="model.PhoneNumber"
                                            />
                                            <span
                                              data-valmsg-replace="true"
                                              data-valmsg-for="PhoneNumber"
                                              class="field-validation-valid text-danger"
                                            ></span>
                                          </div>
                                          <div>
                                            <p class="pull-left content-preview check-order-text"></p>
                                            <button
                                              name="search"
                                              class="btn pull-right"
                                              type="submit"
                                              id="search"
                                            >
                                              <span class="btn-text btn-kiem-tra-custom">
                                                Kiểm tra
                                              </span>
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                      <div class="clearfix"></div>
                                    </div>
                                  </div>

                                  <div id="os-show" class="col-md-7 ">
                                    <div
                                      class="error ng-scope"
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
                              {/* <script>
    window.onmessage = function (e) {
        if (e.data != null && e.data != undefined) {
            if (e.data.pEmail != null && e.data.pEmail != undefined) {
                setInterval(function () {
                    var objectCheckOrderChangeContent = e.data;
                    $(".tieu-de-custom").text(objectCheckOrderChangeContent.pTieuDe);
                    $(".tieu-de-lua-chon").text(objectCheckOrderChangeContent.pTieuDeLuaChon);
                    $(".so-dien-thoai").text(objectCheckOrderChangeContent.pSoDienThoai);
                    $(".email-custom").text(objectCheckOrderChangeContent.pEmail);
                    $(".phone-and-email-check").text(objectCheckOrderChangeContent.pSoDienThoaiVaEmail);
                    $(".btn-kiem-tra-custom").text(objectCheckOrderChangeContent.pNutKiemTra);

                    $(".thong-tin-ma-don-hang").text(objectCheckOrderChangeContent.pThongTinTieuDeMaDonHang);
                    $(".thong-tin-ho-va-ten-khach-hang").text(objectCheckOrderChangeContent.pThongTinHoVaTenKH);
                    $(".thong-tin-so-dien-thoai").text(objectCheckOrderChangeContent.pThongTinSoDienThoai);
                    $(".thong-tin-email").text(objectCheckOrderChangeContent.pThongTinEmail);
                    $(".thong-tin-ngay-mua").text(objectCheckOrderChangeContent.pThongTinNgayMua);
                    $(".thong-tin-dia-chi-giao").text(objectCheckOrderChangeContent.pThongTinDiaChiGiao);
                    $(".thong-tin-gia-tri-don-hang").text(objectCheckOrderChangeContent.pThongTinGiaTriDonHang);
                    $(".thong-tin-don-vi-tien-te").text(objectCheckOrderChangeContent.pThongTinDonViTienTe);
                    $(".thong-tin-so-luong-san-pham").text(objectCheckOrderChangeContent.pThongTinSoLuongSanPham);
                    $(".thong-tin-trang-thai-thanh-toan").text(objectCheckOrderChangeContent.pThongTinTrangThaiThanhToan);
                    $(".thong-tin-trang-thai-giao-hang").text(objectCheckOrderChangeContent.pThongTinTrangThaiGiaoHang);
                    $.each($("b[ng-bind='order.financial_status']"), function () {
                        var content = $(this).text();
                        if (content == "Đơn hàng chờ xác nhận") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiDonHangChoXacNhan);
                        }
                        if (content == "Chờ thanh toán") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiChoThanhToan);
                        }
                        if (content == "Đã thanh toán") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiDaThanhToan);
                        }
                        if (content == "Thanh toán một phần") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiThanhToanMotPhan);
                        }
                        if (content == "Đơn hàng được hoàn trả") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiDonHangDuocHoanTra);
                        }
                        if (content == "Hủy bỏ đơn hàng") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiHuyBoDonHang);
                        }
                        if (content == "Đơn hàng được hoàn trả một phần") {
                            $(this).text(objectCheckOrderChangeContent.pTrangThaiDonHangDuocHoanTraMotPhan);
                        }
                    });

                    $.each($("b[ng-bind='order.fulfillment_status']"), function () {
                        var content = $(this).text();
                        if (content == "Chưa vận chuyển") {
                            $(this).text(objectCheckOrderChangeContent.pGiaoHangChuaVanChuyen);
                        }
                        if (content == "Đã vận chuyển") {
                            $(this).text(objectCheckOrderChangeContent.pGiaoHangDaVanChuyen);
                        }
                        if (content == "Vận chuyển một phần") {
                            $(this).text(objectCheckOrderChangeContent.pGiaoHangVanChuyenMotPhan);
                        }
                    });

                }, 100);
            }
        }
    };
</script> */}

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
        </div>
      </section>
    </div>
  );
};

export default CheckOrder;
