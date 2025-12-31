// src/views/pages/OrderSuccess.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { t } = useTranslation();
  const { state } = useLocation();

  // BẮT BUỘC LẤY DATA TỪ CHECKOUT TRUYỀN QUA → KHÔNG ĐỂ NULL
  const order = state?.order;
  const qrImage = state?.qrImage;
  const bankInfo = state?.bankInfo;
  const expiredAt = state?.expiredAt;
  const paymentMethod = state?.paymentMethod || "COD";

  const [timeLeft, setTimeLeft] = useState("");

  // ĐẾM NGƯỢC 15 PHÚT – CHỈ CHẠY KHI CÓ QR VÀ LÀ CHUYỂN KHOẢN
  useEffect(() => {
    if (!expiredAt || paymentMethod !== "BANK") return;

    const timer = setInterval(() => {
      const diff = new Date(expiredAt) - new Date();
      if (diff <= 0) {
        setTimeLeft(t("orderSuccess.bankTransfer.expired"));
        clearInterval(timer);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m} phút ${s < 10 ? "0" : ""}${s} giây`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt, paymentMethod, t]);

  // NẾU KHÔNG CÓ ĐƠN HÀNG → HIỆN LỖI
  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {t("orderSuccess.errorNoOrder")}
        </div>
        <Link to="/" className="btn btn-success">
          {t("orderSuccess.backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-xl-5">
      {/* Header thành công */}
      <div className="text-center mb-xl-5">
        <i
          className="bi bi-check-circle-fill text-success"
          style={{ fontSize: "80px" }}
        ></i>
        <h1 className="mt-xl-3 text-success fw-bold">
          {t("orderSuccess.pageTitle")}
        </h1>
        <p className="lead text-muted">
          {t("orderSuccess.orderId")}:{" "}
          <strong className="text-danger">#{order.orderId || order.id}</strong>
        </p>
        <p className="fs-3 text-danger fw-bold">
          {order.totalAmount?.toLocaleString()} VNĐ
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          {/* ================== CHUYỂN KHOẢN – BẮT BUỘC HIỆN QR ================== */}
          {paymentMethod === "BANK" && (
            <div className="card shadow-lg border-0 mb-xl-4">
              <div className="card-header bg-danger text-white text-center">
                <h4 className="mb-0">
                  <i className="bi bi-qr-code-scan"></i>
                  {t("orderSuccess.bankTransfer.title")}
                </h4>
              </div>
              <div className="card-body text-center p-xl-4">
                {/* Đếm ngược */}
                <div className="alert alert-warning fw-bold fs-5 mb-xl-4">
                  <i className="bi bi-clock"></i>{" "}
                  {t("orderSuccess.bankTransfer.timeLeft")}:
                  <span className="text-danger ms-2">
                    {timeLeft || "Đang tải..."}
                  </span>
                </div>

                {/* QR CODE – BẮT BUỘC HIỆN */}
                {qrImage ? (
                  <div className="d-inline-block p-xl-4 bg-white rounded shadow">
                    <img
                      src={qrImage}
                      alt={t("orderSuccess.bankTransfer.qrTitle")}
                      className="img-fluid rounded"
                      style={{ maxWidth: "300px", border: "10px solid white" }}
                    />
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    {t("orderSuccess.bankTransfer.errorQr")}
                  </div>
                )}

                {/* Thông tin chuyển khoản */}
                <div className="mt-xl-4 p-xl-4 bg-light rounded border">
                  <p className="mb-xl-2">
                    <strong>{t("orderSuccess.bankTransfer.bank")}:</strong>{" "}
                    <span className="text-primary">
                      {bankInfo?.bank || "Vietcombank"}
                    </span>
                  </p>
                  <p className="mb-xl-2">
                    <strong>
                      {t("orderSuccess.bankTransfer.accountName")}:
                    </strong>{" "}
                    {bankInfo?.accountName || "NGUYỄN VĂN HOÀNG"}
                  </p>
                  <p className="mb-xl-2">
                    <strong>
                      {t("orderSuccess.bankTransfer.accountNumber")}:
                    </strong>{" "}
                    <code>{bankInfo?.accountNumber || "0385421799"}</code>
                  </p>
                  <p className="mb-0 text-danger fw-bold fs-5">
                    {t("orderSuccess.bankTransfer.transferContent")}:{" "}
                    {bankInfo?.content || `Thanh toan don ${order.orderId}`}
                  </p>
                </div>

                <div className="alert alert-danger mt-xl-4">
                  <strong>{t("orderSuccess.bankTransfer.important")}:</strong>{" "}
                  {t("orderSuccess.bankTransfer.importantNote")}
                </div>
              </div>
            </div>
          )}

          {/* ================== COD ================== */}
          {paymentMethod === "COD" && (
            <div className="card shadow-lg border-0 mb-xl-4">
              <div className="card-body text-center py-xl-5">
                <i
                  className="bi bi-truck text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="mt-xl-3 text-success fw-bold">
                  {t("orderSuccess.cod.title")}
                </h4>
                <p className="text-muted">
                  {t("orderSuccess.cod.description")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="text-center mt-xl-5">
        <Link
          to="/products/all"
          className="btn btn-success btn-lg px-xl-5 me-xl-3"
        >
          {t("orderSuccess.continueShopping")}
        </Link>
        <Link
          to="/account/orders"
          className="btn btn-outline-success btn-lg px-xl-5"
        >
          {t("orderSuccess.viewOrderDetails")}
        </Link>
      </div>

      <div className="text-center mt-xl-4 text-muted small">
        {t("orderSuccess.support")}{" "}
        <strong>{t("orderSuccess.supportPhone")}</strong>
      </div>
    </div>
  );
};

export default OrderSuccess;
