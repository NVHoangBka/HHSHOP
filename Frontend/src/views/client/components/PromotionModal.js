import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import imgPromo from "../../../assets/image/promo/promo.png";

const PromotionModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("promoSeen");

    if (!hasSeen) {
      setTimeout(() => {
        setShow(true);
        localStorage.setItem("promoSeen", "true");
      }, 1000);
    }
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered backdrop="true">
      <Modal.Body className="p-0 position-relative">
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={() => setShow(false)}
        ></button>

        <img src={imgPromo} alt="Khuyến mãi" className="img-fluid rounded" />
      </Modal.Body>
    </Modal>
  );
};

export default PromotionModal;
