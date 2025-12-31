import React from "react";
import { Link } from "react-router-dom";

const Introduce = () => {
  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-xl-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title="Trang chủ"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Trang chủ
              </Link>
              <span className="mx-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">Giới thiệu</span>
            </li>
          </ul>
        </div>
      </div>
      <section class="section main-page pb-5">
        <div class="container">
          <div class="grid justify-content-center">
            <div>
              <div class="bg-white rounded-3 px-xl-3 py-xl-4 mx-xl-5 ">
                <h1 class="fw-semibold mb-xl-4 fs-2">Giới thiệu</h1>

                <div class="page-content ms-xl-3">
                  <div class="rte">
                    <div class="prose w-100 content ">
                      <p>
                        <strong>1. Giới thiệu chung:</strong>
                      </p>
                      <p>
                        EGA Minimart là một thương hiệu siêu thị mini uy tín và
                        chất lượng, cam kết mang đến cho khách hàng những trải
                        nghiệm mua sắm tiện lợi, hiện đại và phong phú. Với sứ
                        mệnh “Phục vụ gia đình Việt,” EGA Minimart không ngừng
                        nỗ lực để cung cấp những sản phẩm thiết yếu và dịch vụ
                        tốt nhất, đáp ứng mọi nhu cầu sinh hoạt hàng ngày của
                        khách hàng.
                      </p>
                      <p>
                        <strong>2. Tầm nhìn và Sứ mệnh:</strong>
                      </p>
                      <p>
                        <strong>Tầm nhìn</strong>: EGA Minimart phấn đấu trở
                        thành hệ thống siêu thị mini hàng đầu tại Việt Nam, nơi
                        mang đến sự tiện lợi, tin cậy và giá trị vượt trội cho
                        khách hàng. Chúng tôi hướng đến việc xây dựng một cộng
                        đồng tiêu dùng thông minh, nơi mọi gia đình đều có thể
                        tiếp cận các sản phẩm chất lượng với giá cả hợp lý.
                      </p>
                      <p>
                        <strong>Sứ mệnh</strong>: EGA Minimart cam kết cung cấp
                        những sản phẩm và dịch vụ tốt nhất, phục vụ nhu cầu
                        thiết yếu hàng ngày của mọi gia đình. Chúng tôi chú
                        trọng đến việc tạo ra một môi trường mua sắm an toàn,
                        thân thiện và hiện đại, đồng thời góp phần vào sự phát
                        triển bền vững của cộng đồng.
                      </p>
                      <p>
                        <strong>3. Sản phẩm đa dạng:</strong>
                      </p>
                      <p>
                        EGA Minimart tự hào với danh mục sản phẩm phong phú, từ
                        thực phẩm tươi sống, hàng tiêu dùng, đồ gia dụng đến các
                        sản phẩm chăm sóc cá nhân và gia đình. Một số nhóm sản
                        phẩm chính bao gồm:
                      </p>
                      <ul>
                        <li>
                          <strong>Thực phẩm tươi sống</strong>: Rau củ quả,
                          thịt, cá, hải sản tươi ngon được tuyển chọn kỹ lưỡng.
                        </li>
                        <li>
                          <strong>Thực phẩm khô và đóng gói</strong>: Gạo, mì,
                          bún, thực phẩm đóng hộp, đồ ăn nhanh.
                        </li>
                        <li>
                          <strong>Đồ uống</strong>: Nước giải khát, sữa, các
                          loại nước trái cây, nước ngọt.
                        </li>
                        <li>
                          <strong>Sản phẩm chăm sóc cá nhân</strong>: Sữa tắm,
                          dầu gội, kem đánh răng, sản phẩm vệ sinh cá nhân.
                        </li>
                        <li>
                          <strong>Sản phẩm chăm sóc gia đình</strong>: Nước
                          giặt, nước xả vải, nước rửa chén, nước lau sàn.
                        </li>
                      </ul>
                      <p>
                        <strong>4. Dịch vụ vượt trội:</strong>
                      </p>
                      <p>
                        EGA Minimart luôn đặt khách hàng lên hàng đầu với phương
                        châm “Chất lượng – Tiện lợi – Tiết kiệm.” Chúng tôi cam
                        kết:
                      </p>
                      <ul>
                        <li>
                          <strong>Chất lượng đảm bảo</strong>: Mọi sản phẩm tại
                          EGA Minimart đều được kiểm tra kỹ lưỡng về nguồn gốc
                          và chất lượng, đảm bảo an toàn cho người tiêu dùng.
                        </li>
                        <li>
                          <strong>Tiện lợi tối đa</strong>: Với hệ thống cửa
                          hàng phân bố rộng khắp, EGA Minimart giúp khách hàng
                          dễ dàng tiếp cận các sản phẩm thiết yếu ngay tại khu
                          vực sinh sống.
                        </li>
                        <li>
                          <strong>Tiết kiệm chi phí</strong>: EGA Minimart luôn
                          có những chương trình khuyến mãi, giảm giá hấp dẫn,
                          giúp khách hàng tiết kiệm tối đa chi phí mua sắm.
                        </li>
                      </ul>
                      <p>
                        <strong>5. Không gian mua sắm thân thiện:</strong>
                      </p>
                      <p>
                        EGA Minimart chú trọng tạo ra không gian mua sắm thoải
                        mái, hiện đại với cách bày trí khoa học, giúp khách hàng
                        dễ dàng tìm thấy sản phẩm mình cần. Đội ngũ nhân viên
                        nhiệt tình, chuyên nghiệp luôn sẵn sàng hỗ trợ và tư vấn
                        khách hàng một cách chu đáo.
                      </p>
                      <p>
                        <strong>6. Cam kết cộng đồng:</strong>
                      </p>
                      <p>
                        EGA Minimart không chỉ quan tâm đến lợi ích kinh doanh
                        mà còn chú trọng đến trách nhiệm với cộng đồng. Chúng
                        tôi thường xuyên tổ chức các hoạt động xã hội, chương
                        trình từ thiện nhằm chia sẻ và đóng góp cho sự phát
                        triển bền vững của cộng đồng.
                      </p>
                      <p>
                        <strong>Kết luận:</strong>
                      </p>
                      <p>
                        Với những nỗ lực không ngừng nghỉ trong việc nâng cao
                        chất lượng sản phẩm và dịch vụ, EGA Minimart đã và đang
                        khẳng định vị thế của mình trên thị trường siêu thị mini
                        tại Việt Nam. Hãy đến với EGA Minimart để trải nghiệm
                        một không gian mua sắm tiện lợi, hiện đại và chất lượng,
                        nơi bạn và gia đình sẽ luôn được chăm sóc và phục vụ tốt
                        nhất.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Introduce;
