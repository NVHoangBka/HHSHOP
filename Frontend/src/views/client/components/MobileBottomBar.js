import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const MobileBottomBar = ({ cartCount = 0, isOutOfStock = false }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isProductDetail =
    location.pathname.includes("/product/slug") ||
    location.pathname.includes("/product");

  return (
    <div className="mobile-bottom-menu d-md-none bg-white border-top shadow-sm sticky-bottom">
      <div className="container-fluid">
        {isProductDetail ? (
          <div className="row align-items-center text-center pt-2">
            <div className="col-2">
              <i className="bi bi-telephone fs-6 text-success"></i>
              <div className="fs-8">{t("mbBar.call")}</div>
            </div>

            <div className="col-2">
              <i className="bi bi-chat-dots fs-6 text-success"></i>
              <div className="fs-8">{t("mbBar.chat")}</div>
            </div>

            <div className="col-2 position-relative">
              <i className="bi bi-cart fs-6 text-success"></i>
              {
                <span className="badge bg-danger position-absolute top-25 start-75 translate-middle rounded-pill">
                  {cartCount}
                </span>
              }
              <div className="fs-8">{t("mbBar.cart")}</div>
            </div>

            <div className="col-6">
              <button
                className={`btn w-100 rounded-pill ${
                  isOutOfStock ? "btn-secondary" : "btn-warning"
                }`}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? t("mbBar.outOfStock") : t("mbBar.addToCart")}
              </button>
            </div>
          </div>
        ) : (
          <div className="row text-center py-2">
            <div className="col">
              <i className="bi bi-telephone text-success"></i>
              <div className="fs-8">{t("mbBar.call")}</div>
            </div>

            <div className="col">
              <i className="bi bi-chat-dots text-success"></i>
              <div className="fs-8">{t("mbBar.chat")}</div>
            </div>

            <div className="col">
              <i className="bi bi-fire text-danger"></i>
              <div className="fs-8">{t("mbBar.promotion")}</div>
            </div>

            <div className="col">
              <i className="bi bi-geo-alt text-success"></i>
              <div className="fs-8">{t("mbBar.store")}</div>
            </div>

            <div className="col">
              <i className="bi bi-grid text-success"></i>
              <div className="fs-8">{t("mbBar.product")}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileBottomBar;
