import React from "react";
import { useTranslation } from "react-i18next";
import "../component.css";
import payPal from "../../../../assets/image/paying/footer-trustbadge.webp";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content row mt-xl-5">
          <div className="footer-info col-xl-4">
            <div className="footer-logo">
              <img src="logo.png" alt="" className="w-50" />
              <p className="footer-title text-uppercase fw-bolder">
                {t("info.name")}
              </p>
            </div>
            <p className="footer-desciption m-xl-0 pb-xl-2 fs-body">
              {t("info.slogan")}
            </p>
            <p className="m-xl-0 pb-xl-2 fs-body fw-bold">
              {t("info.tax-code")}: 12345678999
            </p>
            <div className="footer-address row align-items-center">
              <i className="bi bi-geo-alt fs-6 col-xl-1"></i>
              <p className="col m-xl-0 ps-xl-1">
                <span className="d-block">{t("info.address")}</span>
                <span className="fw-bold fs-body">
                  10 Lu Gia, District 11, Ho Chi Minh City
                </span>
              </p>
            </div>
            <div className="row justify-content-start">
              <div className="col-xl-5">
                <div className="row align-items-center">
                  <div className="col-xl-1">
                    <i className="bi bi-telephone fs-6"></i>
                  </div>
                  <p className="col m-xl-0">
                    <span className="d-block">{t("info.hotline")}</span>
                    <span className="fw-bold fs-body">19008088</span>
                  </p>
                </div>
              </div>
              <div className="col-xl-7">
                <div className="row align-items-center">
                  <div className="col-xl-1">
                    <i className="bi bi-envelope fs-6"></i>
                  </div>
                  <p className="col m-xl-0">
                    <span className="d-block">{t("info.email")}</span>
                    <span className="fw-bold fs-body">
                      Hoangdo.bka@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-support col">
            <p className="footer-title fw-bolder mt-xl-1">
              {t("footer.support.title")}
            </p>
            <ul className="fs-body">
              <li className="mb-xl-2 hover"> {t("footer.support.contact")}</li>
              <li className="mb-xl-2 hover">
                {t("footer.support.store-locations")}
              </li>
              <li className="mb-xl-2 hover">
                {t("footer.support.ask-question")}
              </li>
              <li className="mb-xl-2 hover">
                {t("footer.support.affiliate-program")}
              </li>
            </ul>
          </div>
          <div className="col p-xl-0">
            <div className="footer-policy row p-xl-0 m-xl-0">
              <p className="footer-title fw-bolder mt-xl-1 p-xl-0">
                {t("footer.policy.title")}
              </p>
              <ul className="fs-body">
                <li className="mb-xl-2 hover">{t("footer.policy.warranty")}</li>
                <li className="mb-xl-2 hover">{t("footer.policy.return")}</li>
                <li className="mb-xl-2 hover">{t("footer.policy.privacy")}</li>
                <li className="mb-xl-2 hover">
                  {t("footer.policy.terms-of-service")}
                </li>
              </ul>
            </div>
            <div className="footer-support row p-xl-0 m-xl-0">
              <p className="footer-title fw-bolder mt-xl-1 p-xl-0">
                {t("footer.support-hotline.title")}
              </p>
              <ul className="fs-body">
                <li className="mb-xl-2 hover">
                  {t("footer.support-hotline.order")}
                </li>
                <li className="mb-xl-2 hover">
                  {t("footer.support-hotline.warranty")}
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-payment col">
            <p className="footer-title fw-bolder mt-xl-1 p-xl -0">
              {t("footer.payment.title")}
            </p>
            <div className="row">
              <img src={payPal} alt="" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
