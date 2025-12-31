// src/admin/pages/Payments.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminPayments = () => {
  const [t, i18n] = useTranslation();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/admin/payments/pending")
      .then((r) => r.json())
      .then((d) => setPayments(d));
  }, []);

  const confirmPaid = async (orderId) => {
    // if (confirm("Xác nhận khách đã chuyển tiền?")) {
    //   await fetch(`/api/admin/orders/${orderId}/paid`, { method: "PUT" });
    //   setPayments(prev => prev.filter(p => p.order._id !== orderId));
    //   alert("Đã xác nhận thanh toán!");
    // }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-danger">{t("admin.payments.title")}</h2>
      <div className="row g-4">
        {payments.map((item) => (
          <div key={item.order._id} className="col-md-6">
            <div className="card shadow-lg border-danger">
              <div className="card-header bg-danger text-white">
                <strong>#{item.order.orderId}</strong> –{" "}
                {item.order.total.toLocaleString()}₫
              </div>
              <div className="card-body text-center">
                <img
                  src={item.qrBase64}
                  alt="QR"
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: "280px" }}
                />
                <div className="mt-3 p-3 bg-light rounded">
                  <p className="mb-1">
                    <strong>{t("admin.payments.content")}:</strong>{" "}
                    <code className="text-danger">{item.bankInfo.content}</code>
                  </p>
                  <p className="mb-0">
                    <strong>{t("admin.payments.customer")}:</strong>{" "}
                    {item.order.address.recipientName} –{" "}
                    {item.order.address.phoneNumber}
                  </p>
                </div>
                <button
                  className="btn btn-success btn-lg mt-3"
                  onClick={() => confirmPaid(item.order._id)}
                >
                  {t("admin.payments.confirmPaid")}
                </button>
              </div>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="alert alert-success text-center fs-3">
            {t("admin.payments.noPayments")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
