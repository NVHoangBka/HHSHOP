import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../component.css";
import payPal from "../../../../assets/image/paying/footer-trustbadge.webp";

const Footer = () => {
  const { t } = useTranslation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const handleOpenSupport = () => {
    setIsSupportOpen(!isSupportOpen);
  };
  const handleOpenPolicy = () => {
    setIsPolicyOpen(!isPolicyOpen);
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content row mt-lg-5 mt-md-4 mt-3">
          <div className="footer-info col-lg-4 col-md-7">
            <div className="footer-logo">
              <img src={`/img/logo/LOGO.png`} alt="" className="w-50" />
              <p className="footer-title text-uppercase fw-bold">
                {t("info.name")}
              </p>
            </div>
            <p className="footer-desciption m-0 pb-2 fs-body">
              {t("info.slogan")}
            </p>
            <p className="m-0 pb-2 fs-body fw-bold">
              {t("info.tax-code")}: 12345678999
            </p>
            <div className="footer-address row align-items-center">
              <i className="bi bi-geo-alt fs-6 col-1"></i>
              <p className="col m-0 ps-1">
                <span className="d-block">{t("info.address")}</span>
                <span className="fw-bold fs-body">
                  10 Lu Gia, District 11, Ho Chi Minh City
                </span>
              </p>
            </div>
            <div className="row justify-content-start">
              <div className="col-lg-5 col-md-12 py-1">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-telephone fs-6"></i>
                  </div>
                  <p className="col m-0 ps-1">
                    <span className="d-block">{t("info.hotline")}</span>
                    <span className="fw-bold fs-body">19008088</span>
                  </p>
                </div>
              </div>
              <div className="col-lg-7 col-md-12 py-1">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-envelope fs-6"></i>
                  </div>
                  <p className="col m-0 ps-1">
                    <span className="d-block">{t("info.email")}</span>
                    <span className="fw-bold fs-body">
                      Hoangdo.bka@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-support col-lg-3 col-md-5 mt-md-0 mt-3">
            <div
              className="footer-title d-flex justify-content-between"
              onClick={handleOpenSupport}
            >
              <p className="footer-title fw-bolder mt-1 mb-1 ">
                {t("footer.support.title")}
              </p>
              <div className="d-md-none d-block">
                <i
                  className={`bi bi-chevron-${isSupportOpen ? "down" : "right"}`}
                ></i>
              </div>
            </div>
            <ul
              className={` fs-body ${isSupportOpen ? "d-block" : "d-none d-md-block"}`}
            >
              <li className="mb-lg-2 text-hover">
                {t("footer.support.contact")}
              </li>
              <li className="mb-lg-2 text-hover">
                {t("footer.support.store-locations")}
              </li>
              <li className="mb-lg-2 text-hover">
                {t("footer.support.ask-question")}
              </li>
              <li className="mb-lg-2 text-hover">
                {t("footer.support.affiliate-program")}
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mt-lg-0 mt-md-4 mt-3 ps-md-3">
            <div className="footer-policy row p-lg-0 m-lg-0">
              <div
                className="footer-title d-flex justify-content-between"
                onClick={handleOpenPolicy}
              >
                <p className="fw-bolder mt-xl-1 mt-lg-1 mt-md-1 p-0">
                  {t("footer.policy.title")}
                </p>
                <div className="d-md-none d-block">
                  <i
                    className={`bi bi-chevron-${isPolicyOpen ? "down" : "right"}`}
                  ></i>
                </div>
              </div>
              <ul
                className={`fs-body ms-md-3 ms-4 ps-4 ${isPolicyOpen ? "d-block" : "d-none d-md-block"}`}
              >
                <li className="mb-xl-2 hover">{t("footer.policy.warranty")}</li>
                <li className="mb-xl-2 hover">{t("footer.policy.return")}</li>
                <li className="mb-xl-2 hover">{t("footer.policy.privacy")}</li>
                <li className="mb-xl-2 hover">
                  {t("footer.policy.terms-of-service")}
                </li>
              </ul>
            </div>
            <div className="footer-support row p-lg-0 m-lg-0">
              <div className="footer-title d-flex justify-content-between">
                <p className="footer-title fw-bolder mt-lg-1 p-0 mb-1">
                  {t("footer.support-hotline.title")}
                </p>
              </div>
              <ul className="fs-body ms-md-3 ms-4 ps-4">
                <li className="mb-lg-2 text-hover">
                  {t("footer.support-hotline.order")}
                </li>
                <li className="mb-lg-2 text-hover">
                  {t("footer.support-hotline.warranty")}
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-payment col-lg-2 col-md-6 mt-lg-0 mt-md-4">
            <p className="footer-title fw-bolder mt-xl-1 p-xl mb-1">
              {t("footer.payment.title")}
            </p>
            <div className="row">
              <img className="col-lg-12 col-md-10 col-8" src={payPal} alt="" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
