import React from "react";
import "./component.css";
import payPal from "../../assets/paying/footer-trustbadge.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content row mt-5">
          <div className="footer-info col-4">
            <div className="footer-logo">
              <img src="logo.png" alt="" className="w-50" />
              <p className="footer-title text-uppercase fw-bolder">
                HUNGNHUNG supermarket
              </p>
            </div>
            <p className="footer-desciption m-0 pb-2 fs-body">
              Thương hiệu siêu thị uy tín và chất lượng, cam kết mang đến những
              trải nghiệm mua sắm tiện lợi, hiện đại và phong phú
            </p>
            <p className="m-0 pb-2 fs-body fw-bold">TaxCode: 12345678999</p>
            <div className="footer-address row align-items-center">
              <i className="bi bi-geo-alt fs-6 col-1"></i>
              <p className="col m-0 ps-1">
                <span className="d-block">Địa chỉ</span>
                <span className="fw-bold fs-body">
                  10 Lu Gia, District 11, Ho Chi Minh City
                </span>
              </p>
            </div>
            <div className="row justify-content-start">
              <div className="col-5">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-telephone fs-6"></i>
                  </div>
                  <p className="col m-0">
                    <span className="d-block">Holline</span>
                    <span className="fw-bold fs-body">19008088</span>
                  </p>
                </div>
              </div>
              <div className="col-7">
                <div className="row align-items-center">
                  <div className="col-1">
                    <i className="bi bi-envelope fs-6"></i>
                  </div>
                  <p className="col m-0">
                    <span className="d-block">Email</span>
                    <span className="fw-bold fs-body">
                      Hoangdo.bka@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-support col">
            <p className="footer-title fw-bolder mt-1">Hỗ trợ khách hàng</p>
            <ul className="fs-body">
              <li className="mb-2 hover">Liên hệ</li>
              <li className="mb-2 hover">Hệ thống cửa hàng</li>
              <li className="mb-2 hover">Câu hỏi thường gặp</li>
              <li className="mb-2 hover">Chương trình cộng tác viên</li>
            </ul>
          </div>
          <div className="col p-0">
            <div className="footer-policy row p-0 m-0">
              <p className="footer-title fw-bolder mt-1 p-0">Chính sách</p>
              <ul className="fs-body">
                <li className="mb-2 hover">Chính sách bảo hành</li>
                <li className="mb-2 hover">Chính sách đổi trả</li>
                <li className="mb-2 hover">Chính sách bảo mật</li>
                <li className="mb-2 hover">Điều khoản dịch vụ</li>
              </ul>
            </div>
            <div className="footer-support row p-0 m-0">
              <p className="footer-title fw-bolder mt-1 p-0">Tổng đài hỗ trợ</p>
              <ul className="fs-body">
                <li className="mb-2 hover">Gọi mua hàng: 19006750 (8h-20h)</li>
                <li className="mb-2 hover">Gọi bảo hành: 19006750 (8h-20h)</li>
              </ul>
            </div>
          </div>
          <div className="footer-payment col">
            <p className="footer-title fw-bolder mt-1 p-0">
              Phương thức thanh toán
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