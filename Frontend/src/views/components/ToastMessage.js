import React, { useEffect, useRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./ToastMessage.css";
import { Toast } from "bootstrap";

const ToastMessage = ({
  show,
  onClose,
  message,
  title = "Thông báo",
  type = "info", 
}) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && toastRef.current) {
      const toast = new Toast(toastRef.current, { delay: 2000 });
      toast.show();

      const handleHidden = () => {
        onClose();
        toastRef.current.removeEventListener("hidden.bs.toast", handleHidden);
      };

      toastRef.current.addEventListener("hidden.bs.toast", handleHidden);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <i className="bi bi-check-circle-fill text-white me-2 fs-5"></i>;
      case "error":
        return <i className="bi bi-exclamation-circle-fill text-danger me-2 fs-5"></i>;
      case "info":
      default:
        return <i className="bi bi-info-circle-fill text-primary me-2 fs-5"></i>;
    }
  };

  return (
    <div
      ref={toastRef}
      className={`toast custom-toast border-0 shadow-sm`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-type={type}
    >
      <div className="d-flex align-items-start">
        <div className="toast-body d-flex p-0">
          <div className={`toast-icon d-flex align-items-center justify-content-center rounded-start-2 px-1 bg-${type}`}>
            {getIcon()}
          </div>
          <div className="toast-content px-3 py-2">
            <strong className="d-block">{title}</strong>
            <span>{message}</span>
          </div>
        </div>
        <button
          type="button"
          className={`btn-close pe-4 m-auto`}
          data-bs-dismiss="toast"
          aria-label="Close"
          shadow-none
        ></button>
      </div>
    </div>
  );
};

export default ToastMessage;