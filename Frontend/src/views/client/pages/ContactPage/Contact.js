import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ authController }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          <ul className="breadcrumb py-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title="Trang chủ"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Trang chủ
              </Link>
              <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">Liên hệ</span>
            </li>
          </ul>
        </div>
      </div>
      <section class="section main-page pb-5">
        <div class="container">
          <div class="bg-white rounded p-3 mb-5">
            <div class="grid pt-4 row">
              <div className="col-6">
                <h1 class="fw-semibold mb-2">TẬP ĐOÀN HHGROUP</h1>
                <div class="d-flex align-items-start mb-2    ms-4">
                  <i class="bi bi-geo-alt text-secondary"></i>
                  <div class="ms-1">
                    <p class="text-forground m-0">Địa chỉ</p>
                    <p class="fw-semibold mb-1">
                      <span>{companyAddress}</span>
                    </p>
                  </div>
                </div>
                <div class="grid justify-content-between ms-4">
                  <div class="d-flex align-items-start mb-2">
                    <i class="bi bi-telephone text-secondary"></i>
                    <div class="ms-1">
                      <p class="text-forground m-0">Hotline</p>
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
                      <p class="text-forground m-0">Email</p>
                      <a
                        class="fw-semibold link text-black"
                        href="mailto:support@sapo.vn"
                      >
                        support@sapo.vn{" "}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="py-4 ms-4 ">
                  <h2 class="fw-semibold mb-2 fs-4">Liên hệ với chúng tôi</h2>
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
                        <fieldset class="form-group my-2 ">
                          <input
                            placeholder="Họ tên*"
                            type="text"
                            class="form-input w-100 p-2"
                            required
                            name="FullName"
                          />
                        </fieldset>
                        <fieldset class="form-group my-2 ">
                          <input
                            placeholder="Email*"
                            type="email"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            required
                            id="email1"
                            class="form-input w-100 p-2"
                            name="Email"
                          />
                        </fieldset>
                        <fieldset class="form-group my-2 ">
                          <input
                            placeholder="Số điện thoại*"
                            type="text"
                            class="form-input w-100 p-2"
                            required
                            pattern="\d+"
                            name="PhoneNumber"
                          />
                        </fieldset>
                        <fieldset class="form-group my-2 ">
                          <textarea
                            placeholder="Nhập nội dung*"
                            name="Body"
                            id="comment"
                            class="form-textarea w-100 p-2"
                            rows="5"
                            required
                          ></textarea>
                        </fieldset>
                        <div class="">
                          <button
                            type="submit"
                            class="btn bg-success text-white fw-semibold py-2 px-4 rounded-5"
                          >
                            Gửi liên hệ của bạn
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-6">
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
                  <p className="text-center mt-3 text-muted small">
                    <i className="bi bi-geo-alt-fill"></i> Nhấn vào bản đồ để
                    xem chỉ đường
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
