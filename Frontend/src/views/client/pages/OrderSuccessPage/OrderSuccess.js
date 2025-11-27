// src/views/pages/OrderSuccess.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
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
        setTimeLeft("ĐÃ HẾT HẠN");
        clearInterval(timer);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m} phút ${s < 10 ? "0" : ""}${s} giây`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt, paymentMethod]);

  // NẾU KHÔNG CÓ ĐƠN HÀNG → HIỆN LỖI
  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          Không tìm thấy thông tin đơn hàng! Vui lòng đặt hàng lại.
        </div>
        <Link to="/" className="btn btn-success">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header thành công */}
      <div className="text-center mb-5">
        <i
          className="bi bi-check-circle-fill text-success"
          style={{ fontSize: "80px" }}
        ></i>
        <h1 className="mt-3 text-success fw-bold">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="lead text-muted">
          Mã đơn hàng:{" "}
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
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-header bg-danger text-white text-center">
                <h4 className="mb-0">
                  <i className="bi bi-qr-code-scan"></i> THANH TOÁN CHUYỂN KHOẢN
                </h4>
              </div>
              <div className="card-body text-center p-4">
                {/* Đếm ngược */}
                <div className="alert alert-warning fw-bold fs-5 mb-4">
                  <i className="bi bi-clock"></i> Thời gian còn lại:
                  <span className="text-danger ms-2">
                    {timeLeft || "Đang tải..."}
                  </span>
                </div>

                {/* QR CODE – BẮT BUỘC HIỆN */}
                {qrImage ? (
                  <div className="d-inline-block p-4 bg-white rounded shadow">
                    <img
                      src={qrImage}
                      alt="QR Thanh toán"
                      className="img-fluid rounded"
                      style={{ maxWidth: "300px", border: "10px solid white" }}
                    />
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    Lỗi: Không tải được mã QR. Vui lòng liên hệ shop!
                  </div>
                )}

                {/* Thông tin chuyển khoản */}
                <div className="mt-4 p-4 bg-light rounded border">
                  <p className="mb-2">
                    <strong>Ngân hàng:</strong>{" "}
                    <span className="text-primary">
                      {bankInfo?.bank || "Vietcombank"}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Chủ tài khoản:</strong>{" "}
                    {bankInfo?.accountName || "NGUYỄN VĂN HOÀNG"}
                  </p>
                  <p className="mb-2">
                    <strong>Số tài khoản:</strong>{" "}
                    <code>{bankInfo?.accountNumber || "0385421799"}</code>
                  </p>
                  <p className="mb-0 text-danger fw-bold fs-5">
                    Nội dung:{" "}
                    {bankInfo?.content || `Thanh toan don ${order.orderId}`}
                  </p>
                </div>

                <div className="alert alert-danger mt-4">
                  <strong>QUAN TRỌNG:</strong> Vui lòng chuyển khoản{" "}
                  <u>đúng nội dung</u> để đơn được xử lý tự động!
                </div>
              </div>
            </div>
          )}

          {/* ================== COD ================== */}
          {paymentMethod === "COD" && (
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body text-center py-5">
                <i
                  className="bi bi-truck text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="mt-3 text-success fw-bold">
                  THANH TOÁN KHI NHẬN HÀNG
                </h4>
                <p className="text-muted">
                  Bạn sẽ thanh toán trực tiếp cho shipper khi nhận hàng
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="text-center mt-5">
        <Link to="/products/all" className="btn btn-success btn-lg px-5 me-3">
          Tiếp tục mua sắm
        </Link>
        <Link
          to="/account/orders"
          className="btn btn-outline-success btn-lg px-5"
        >
          Xem chi tiết đơn hàng
        </Link>
      </div>

      <div className="text-center mt-4 text-muted small">
        Có vấn đề? Liên hệ ngay: <strong>0385421799</strong> (Zalo/Facebook)
      </div>
    </div>
  );
};

export default OrderSuccess;
