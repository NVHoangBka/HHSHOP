// src/admin/pages/Payments.jsx
import React, { useEffect, useState } from "react";

const AdminPayments = () => {
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
      <h2 className="mb-4 fw-bold text-danger">
        Xác nhận thanh toán chuyển khoản
      </h2>
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
                    <strong>Nội dung:</strong>{" "}
                    <code className="text-danger">{item.bankInfo.content}</code>
                  </p>
                  <p className="mb-0">
                    <strong>Khách:</strong> {item.order.address.recipientName} –{" "}
                    {item.order.address.phoneNumber}
                  </p>
                </div>
                <button
                  className="btn btn-success btn-lg mt-3"
                  onClick={() => confirmPaid(item.order._id)}
                >
                  ĐÃ NHẬN ĐƯỢC TIỀN
                </button>
              </div>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="alert alert-success text-center fs-3">
            Không có đơn chuyển khoản nào đang chờ xác nhận
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
