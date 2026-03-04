import React, { useEffect, useRef } from "react";
import Modal from "bootstrap/js/dist/modal";
import imgPromo from "../../../assets/image/promo/promo.png";

const PromotionModal = () => {
  const modalRef = useRef(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem("promoSeen");

    if (!hasSeen) {
      setTimeout(() => {
        const modal = new Modal(modalRef.current);
        modal.show();
        localStorage.setItem("promoSeen", "true");
      }, 1000);
    }
  }, []);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      style={{ zIndex: "3000" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0">
          <div className="modal-body p-0 position-relative">
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
            ></button>

            <img
              src={imgPromo}
              alt="Khuyến mãi"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
