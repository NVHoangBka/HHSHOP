import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Contact = ({ authController }) => {
  const [t, i18n] = useTranslation();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // Thông tin công ty
  const companyAddress = "Tạp Hoá Hải Xinh, Các Sơn, Thanh Hoá";
  const googleMapsUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3759.8624386371766!2d105.74557247581434!3d19.54751853699969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313701a6284e1937%3A0x7dc9644db809959d!2zVOG6oXAgaG_DoSBI4bqjaSBYaW5o!5e0!3m2!1svi!2sus!4v1765271642410!5m2!1svi!2sus";

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await authController.getCurrentUser();
        const { email, firstName, lastName, phoneNumber } = currentUser;
        setEmail(email);
        setFullName(`${firstName} ${lastName}`);
        setPhoneNumber(phoneNumber);
      } catch (error) {}
    };
    fetchCurrentUser();
  }, [authController]);

  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-lg-3 pt-md-2 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("header.home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("header.home")}
              </Link>
              <span className="mx-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">
                {t("info.contact.pageTitle")}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <section class="section main-page pb-xl-5 pb-md-3">
        <div class="container">
          <div class="bg-white rounded mb-xl-5 mb-md-3 px-xl-4 px-md-3 pt-xl-2 pt-md-2 pb-xl-4 pb-md-3">
            <div class="grid pt-xl-4 row">
              <div className="col-xl-6 col-md-5">
                <h1 class="fw-semibold mb-xl-2 mb-2">{t("info.name")}</h1>
                <div class="d-flex align-items-start mb-xl-2 ms-xl-4 mb-2 ms-2">
                  <i class="bi bi-geo-alt text-secondary"></i>
                  <div class="ms-1">
                    <p class="text-forground m-0">{t("info.address")}</p>
                    <p class="fw-semibold mb-1">
                      <span>{companyAddress}</span>
                    </p>
                  </div>
                </div>
                <div class="grid justify-content-between ms-lg-4 ms-2">
                  <div class="d-flex align-items-start mb-lg-2 mb-2">
                    <i class="bi bi-telephone text-secondary"></i>
                    <div class="ms-1">
                      <p class="text-forground m-0">{t("info.hotline")}</p>
                      <a
                        class="fw-semibold text-success link "
                        href="tel:19006750"
                        title="19006750"
                      >
                        19006750
                      </a>
                    </div>
                  </div>
                  <div class="d-flex align-items-start">
                    <i class="bi bi-envelope text-secondary"></i>
                    <div class="ms-1">
                      <p class="text-forground m-0">{t("info.email")}</p>
                      <a
                        class="fw-semibold link text-black"
                        href="mailto:support@sapo.vn"
                      >
                        hoangdo.bka@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <div class="py-lg-4 ms-lg-4 py-3 ms-2">
                  <h2 class="fw-semibold mb-lg-2 mb-2 fs-4">
                    {t("info.contact.pageTitle")}
                  </h2>
                  <form
                    method="post"
                    action="/postcontact"
                    id="contact"
                    accept-charset="UTF-8"
                  >
                    <input name="FormType" type="hidden" value="contact" />
                    <input name="utf8" type="hidden" value="true" />

                    <div class="form-signup clearfix">
                      <div class="group_contact ">
                        <div class="form-group my-2">
                          <input
                            placeholder={t("info.fullName")}
                            type="text"
                            class="form-input w-100 p-lg-2 p-1"
                            name="FullName"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                            }}
                            required
                          />
                        </div>
                        <fieldset class="form-group my-2 ">
                          <input
                            placeholder="Email*"
                            type="email"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            id="email1"
                            class="form-input w-100 p-lg-2 p-1"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            name="Email"
                            required
                          />
                        </fieldset>
                        <fieldset class="form-group my-2 ">
                          <input
                            placeholder={t("info.phoneNumber")}
                            type="text"
                            class="form-input w-100 p-lg-2 p-1"
                            required
                            pattern="\d+"
                            name="PhoneNumber"
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value);
                            }}
                          />
                        </fieldset>
                        <fieldset class="form-group my-2 ">
                          <textarea
                            placeholder="Nhập nội dung*"
                            name="Body"
                            id="comment"
                            class="form-textarea w-100 p-lg-2 p-1"
                            rows="5"
                            required
                          ></textarea>
                        </fieldset>
                        <div class="">
                          <button
                            type="submit"
                            class="btn bg-success text-white fw-semibold py-lg-2 px-lg-4 py-2 px-4  rounded-5"
                          >
                            {t("info.contact.header")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-xl-6 col-7">
                <div className="position-sticky top-0">
                  <div className="ratio ratio-1x1 rounded overflow-hidden shadow-lg">
                    <iframe
                      src={googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bản đồ HHGroup"
                    ></iframe>
                  </div>
                  <p className="text-center mt-lg-3 mt-2 text-muted small">
                    <i className="bi bi-geo-alt-fill"></i>{" "}
                    {t("info.contact.map.instruction")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
