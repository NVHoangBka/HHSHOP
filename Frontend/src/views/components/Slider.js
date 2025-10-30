import sliderImg1 from "../../assets/sliders/home_slider_1.webp";
import sliderImg2 from "../../assets/sliders/home_slider_2.jpg";
import "./component.css";

function Slider() {
  return (
    <>
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={sliderImg1} className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src={sliderImg2} className="d-block w-100" alt="Slide 2" />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon border rounded-circle"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon border rounded-circle"></span>
        </button>
      </div>
      <div className="section-police">
        <div className="container">
          <ul className="section-police-list row">
            <li className="section-police-item d-flex mt-3 col-3">
              <i className="bi bi-box-fill fs-5"></i>
              <div className="section-police-title ms-2">
                <h5 className="m-0 fs-6">Giao hỏa tốc</h5>
                <p>Nội thành TP. HCM trong 4h</p>
              </div>
            </li>
            <li className="section-police-item d-flex mt-3 col-3">
              <i className="bi bi-arrow-repeat fs-5"></i>
              <div className="section-police-title ms-2">
                <h5 className="m-0 fs-6">Đổi trả miễn phí</h5>
                <p>Trong vòng 30 ngày miễn phí</p>
              </div>
            </li>
            <li className="section-police-item d-flex mt-3 col-3">
              <i className="bi bi-hand-thumbs-up fs-5"></i>
              <div className="section-police-title ms-2">
                <h5 className="m-0 fs-6">Hỗ trợ 24/7</h5>
                <p>Hỗ trợ khách hàng 24/7</p>
              </div>
            </li>
            <li className="section-police-item d-flex mt-3 col-3">
              <i className="bi bi-ticket-perforated fs-5"></i>
              <div className="section-police-title ms-2">
                <h5 className="m-0 fs-6">Deal hot bùng nổ</h5>
                <p>Flash sale giảm giá cực sốc</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Slider;