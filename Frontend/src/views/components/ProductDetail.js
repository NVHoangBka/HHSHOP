import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProductDetail = ({ addToCart, productController }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productController.getProductById(id);
        if (!data) {
          console.error("Không có sản phẩm");
          // navigate("/");
          return;
        }
        setProduct(data);

        // Ưu tiên ảnh của variant đầu tiên
        const firstVariant = data.variants?.[0];
        const defaultImage = firstVariant?.image || data.image || "";
        setMainImage(defaultImage);
        // Chọn variant mặc định
        if (firstVariant) setSelectedVariant(firstVariant);
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, productController, navigate]);

  // Khi chọn variant → đổi ảnh + giá
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setMainImage(variant.image || product.image);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const item = {
      ...product,
      quantity,
      selectedVariant: selectedVariant ? { ...selectedVariant } : null,
      // Tên hiển thị trong giỏ
      displayName: selectedVariant
        ? `${product.name} - ${selectedVariant.value}`
        : product.name,
      // Giá thực tế
      finalPrice: selectedVariant
        ? selectedVariant.discountPrice || selectedVariant.price
        : product.discountPrice || product.price,
      // Ảnh trong giỏ
      cartImage: mainImage,
    };

    addToCart(item);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Sản phẩm không tồn tại.</p>
        <Link to="/" className="btn btn-outline-success">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const currentPrice =
    selectedVariant?.discountPrice ||
    selectedVariant?.price ||
    product.discountPrice ||
    product.price;
  const originalPrice = selectedVariant?.price || product.price;
  const hasDiscount = currentPrice < originalPrice;

  const allImages = product?.gallery || [product?.image];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-success-subtle">
        <div className="container">
          <div className="breadcrumbs">
            <ul className="breadcrumb py-2 flex flex-wrap items-center text-xs md:text-sm">
              <li className="home ">
                <Link
                  className="link hover fs-7"
                  to="/"
                  title="Trang chủ"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>Trang chủ</span>
                </Link>
                <span className="mx-1 md:mx-2 inline-block">/</span>
              </li>
              <li>
                <span className="fs-7" style={{ color: "#BFBFBF" }}>
                  {product.name}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container mt-4">
        <product-form id="main-product">
          <div class="product-detail row justify-content-between">
            {/* Gallery */}
            <div class="product-gallery-wrapper col-5">
              <div class="">
                <div class="product-gallery">
                  <div>
                    <div className="text-center">
                      <img
                        src={mainImage || "/placeholder.jpg"}
                        alt={product.name}
                        className="object-contain rounded-lg gallery-main-img w-100"
                      />
                    </div>

                    {/* Thumbnails (nếu có nhiều ảnh) */}
                    {allImages.length > 1 && (
                      <div className="d-flex justify-content-center gap-3 mt-3">
                        {allImages.map((img, i) => (
                          <div
                            key={i}
                            className={`border p-1 cursor-pointer ${
                              mainImage === img ? "border-danger" : "border"
                            }`}
                            onClick={() => setMainImage(img)}
                          >
                            <img
                              src={img}
                              width="64"
                              height="64"
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chia sẻ */}
                <div class="mb-3">
                  <div class="share-group d-flex justify-content-center align-items-center mt-5">
                    <p class="share-group__heading m-0">Chia sẻ</p>
                    <div class="share-group__list d-flex ms-3">
                      <Link
                        title="facebook-share"
                        class="share-group__item p-2 border rounded-5 d-flex align-items-center justify-content-center facebook mx-1"
                        target="_blank"
                        to={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                      >
                        <img
                          class="object-contain"
                          src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/facebook-icon.png?1760435339581"
                          alt="facebook"
                          loading="lazy"
                          width="20"
                          height="20"
                        />
                      </Link>
                      <Link
                        title="messenger-share"
                        class="share-group__item messenger p-2 border rounded-5 d-flex align-items-center justify-content-center mx-1"
                        target="_blank"
                        to={`https://m.me/?app_scoped_user_id=&link=${window.location.href}`}
                      >
                        <img
                          class="object-contain"
                          src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/messenger-icon.png?1760435339581"
                          alt="messenger"
                          loading="lazy"
                          width="20"
                          height="20"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div class="product-form-wrapper col-6">
              <div class="bg-background">
                <div class="">
                  <div class="product-title mb-4">
                    <h1 class="fw-semibold fs-4">{product.name}</h1>

                    <div class="d-flex flex-wrap align-items-center  my-2 ">
                      <button
                        aria-label="So sánh"
                        type="button"
                        class="p-0 fs-7 fw-semibold d-flex align-items-center border border-0 bg-transparent text-active"
                      >
                        <i class="bi bi-arrow-left-right me-1"></i>
                        <span>So sánh</span>
                      </button>
                    </div>

                    <div class="group-status  d-flex flex-wrap pb-2 align-items-center">
                      <div class="status status-vendor col-4">
                        <span class="fs-7 me-1">Thương hiệu:</span>

                        <span className="fs-7 fw-semibold text-black">
                          {product.brands?.join(", ") || "Minimart"}
                        </span>
                      </div>
                      <div class="status status-sku  col-4">
                        <span class="fs-7">Mã sản phẩm:</span>
                        <span class="fs-7">{product.id.slice(-8)}</span>
                      </div>
                    </div>

                    {/* Giá */}
                    <div class="product-price-group rounded-sm overflow-hidden mb-4">
                      <div class="price-box d-flex align-items-center flex-wrap">
                        <div class="flex flex-wrap">
                          <span class="price fs-2 fw-bold text-active ms-3">
                            {formatPrice(currentPrice)}
                          </span>
                          {hasDiscount && (
                            <del className="text-muted ms-2 fs-6">
                              {formatPrice(originalPrice)}
                            </del>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khuyến mãi */}
                  <div class="promo-box mb-4">
                    <div class="promo-box-group border rounded-2 ">
                      <div class="promo-box__header d-flex align-items-center px-4 py-1 bg-success-subtle text-success">
                        <i class="bi bi-gift"></i>
                        <div class="promo-box__header-title ms-2">
                          Quà tặng khuyến mãi
                        </div>
                      </div>

                      <div class="promo-box__body px-5 bg-background py-3">
                        <div class="promo-box__body-item">
                          1. Nhập mã EGANY thêm 5% đơn hàng
                        </div>
                        <div class="promo-box__body-item">
                          2. Giảm giá 10% khi mua từ 5 sản phẩm
                        </div>
                        <div class="promo-box__body-item">
                          3. Giảm giá 20% khi mua từ 10 sản phẩm
                        </div>
                        <div class="promo-box__body-item">
                          4. Tặng phiếu mua hàng khi mua từ 500k
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="coupon-box mb-4">
                    <div class="coupon-group d-flex align-items-center justify-content-between">
                      <div class="coupon-group-header col-2">Mã giảm giá</div>
                      <div class="d-flex" data-portal="#coupon-drawer">
                        <div class="d-flex align-items-center cursor-pointer">
                          <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 fs-7 bg-warning-subtle mx-1 text-active rounded-3 col-3">
                            <i class="bi bi-ticket-perforated"></i>
                            <div class="coupon-group-item__code fw-semibold ms-1 text-truncate">
                              EGA50THANG10
                            </div>
                          </div>

                          <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 fs-7 bg-warning-subtle mx-1 text-active rounded-3 col-3">
                            <i class="bi bi-ticket-perforated"></i>
                            <div class="coupon-group-item__code fw-semibold ms-1 text-truncate">
                              EGA30THANG10
                            </div>
                          </div>

                          <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 fs-7 bg-warning-subtle mx-1 text-active rounded-3 col-3">
                            <i class="bi bi-ticket-perforated"></i>
                            <div class="coupon-group-item__code fw-semibold ms-1 text-truncate">
                              FREESHIPTHANG10
                            </div>
                          </div>
                          <div class="px-3 py-2 bg-warning-subtle mx-1 text-active rounded-3">
                            <i class="bi bi-caret-right-fill"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variant (nếu có) dung tích */}
                  {product.variants && product.variants.length > 0 && (
                    <div class="mb-4">
                      <div class="variant-picker d-flex">
                        <div class="variant-picker__input d-flex align-items-center w-100">
                          <div class="mb-1 col-2">Dung tích</div>
                          <div
                            class="fieldset d-flex flex-wrap selected"
                            data-option="dung-tich"
                          >
                            {product.variants.map((v, i) => (
                              <button
                                key={i}
                                onClick={() => handleVariantChange(v)}
                                className={`mx-1 btn ${
                                  selectedVariant?.value === v.value
                                    ? "btn-danger text-white"
                                    : "btn-outline-secondary"
                                }`}
                              >
                                {v.value}
                                {v.discountPrice && (
                                  <small className="ms-1">
                                    (−
                                    {Math.round(
                                      100 - (v.discountPrice / v.price) * 100
                                    )}
                                    %)
                                  </small>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Số lượng + CTA */}
                <div class="product-cta mb-0 mt-4 ">
                  <div class="d-none btn fw-semibold mt-2 btn w-100">
                    HẾT HÀNG
                  </div>
                  <input type="hidden" name="variantId" value="118468360" />

                  <div class="d-flex align-items-center mb-4 ">
                    <div class="col-2"> Số lượng </div>
                    <quantity-input>
                      <div class="custom-number-input product-quantity">
                        <div class="d-flex border rounded-1 w-50">
                          <button
                            type="button"
                            name="minus"
                            class="cursor-pointer p-2 bg-transparent border-0 text-hover"
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                          >
                            <i class="m-auto bi bi-dash"></i>
                          </button>
                          <input
                            type="text"
                            class="form-quantity w-100 fw-semibold d-flex align-items-center bg-transparent border-0 text-center"
                            name="quantity"
                            value={quantity}
                            min="1"
                          />
                          <button
                            type="button"
                            name="plus"
                            class="cursor-pointer p-2 bg-transparent border-0 text-hover"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            <i class="m-auto bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </quantity-input>
                  </div>

                  <div class="d-flex mt-4 border-top pt-4">
                    <button
                      name="buynow"
                      class=" fw-semibold btn border border-danger btn-buynow w-100 py-2 text-danger col mx-2 rounded-5"
                    >
                      <span> Mua ngay </span>
                      <span class="loading-icon hidden align-items-center justify-content-center">
                        <span class="rounded-full animate-pulse"></span>

                        <span class="rounded-full animate-pulse"></span>

                        <span class="rounded-full animate-pulse"></span>
                      </span>
                    </button>

                    <button
                      name="addtocart"
                      class=" fw-semibold btn btn-add-to-cart w-100 bg-danger text-white py-2 col mx-2 rounded-5"
                      onClick={handleAddToCart}
                    >
                      <span> Thêm vào giỏ</span>
                      <span class="loading-icon  hidden align-items-center justify-content-center">
                        <span class="rounded-full animate-pulse"></span>

                        <span class="rounded-full animate-pulse"></span>

                        <span class="rounded-full animate-pulse"></span>
                      </span>
                    </button>
                  </div>
                </div>

                <div class="card-product__badges d-none space-y-2 col-span-full mt-4 "></div>

                {/* Chính sách */}
                <ul class="pt-3 d-flex flex-column   product-polices">
                  <li class="item d-flex align-items-center my-1">
                    <div class="max-w-5">
                      <img
                        class="object-contain"
                        loading="lazy"
                        width="20"
                        height="20"
                        src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/policy_product_image_1.png?1760435339581"
                        alt="Giao hàng miễn phí trong 24h (chỉ áp dụng khu vực nội thành)"
                      />
                    </div>
                    <div class="fs-7 ms-2">
                      Giao hàng miễn phí trong 24h (chỉ áp dụng khu vực nội
                      thành)
                    </div>
                  </li>

                  <li class="item d-flex align-items-center my-1">
                    <div class="max-w-5">
                      <img
                        class="object-contain"
                        loading="lazy"
                        width="20"
                        height="20"
                        src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/policy_product_image_2.png?1760435339581"
                        alt="Trả góp lãi suất 0% qua thẻ tín dụng Visa, Master, JCB"
                      />
                    </div>
                    <div class="fs-7 ms-2">
                      Trả góp lãi suất 0% qua thẻ tín dụng Visa, Master, JCB
                    </div>
                  </li>

                  <li class="item d-flex align-items-center my-1">
                    <div class="max-w-5">
                      <img
                        class="object-contain"
                        loading="lazy"
                        width="20"
                        height="20"
                        src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/policy_product_image_3.png?1760435339581"
                        alt="Đổi trả miễn phí trong 30 ngày"
                      />
                    </div>
                    <div class="fs-7 ms-2">Đổi trả miễn phí trong 30 ngày</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </product-form>
      </div>

      <div class="">
        <div class="product-description relative">
          <div class="tab-nav container tab-nav--style3 d-none justify-content-center align-items-center ">
            <button
              class="tab-btn btn rounded-0 active fw-semibold "
              aria-controls="product-content"
            >
              Đặc điểm nổi bật
            </button>
          </div>

          <div class="tab-content  bg-white py-5" id="product-content">
            <div className="bg-success-subtle">
              <div class="container">
                <h3 class="fs-5 text-center block py-3 fw-semibold mb-5 text-success">
                  Đặc điểm nổi bật
                </h3>
              </div>
            </div>
            <div class="container mx-auto">
              <div class="expandable-content mb-3">
                <div class="prose text-base w-full max-w-full content">
                  <p>
                    SUNLIGHT NƯỚC LAU SÀN TINH DẦU THẢO MỘC HƯƠNG QUẾ CAM
                    BERGAMOT - SẠCH THƠM THƯ THÁI, TỔ ẤM TRONG LÀNH
                  </p>
                  <p>
                    Sản phẩm nước lau sàn Sunlight Hương Quế và Cam Bergamot sử
                    dụng chất làm sạch 100% từ thiên nhiên, không chỉ giúp sàn
                    nhà sạch bóng mà còn chứa tinh dầu quế giúp ngăn đuổi côn
                    trùng và mang lại không gian thư thái cho cả gia đình.
                  </p>
                  <p>
                    ƯU ĐIỂM NỔI BẬT:Sunlight lau sàn hoạt động hiệu quả cho mọi
                    loại sàn:- Đá mài- Gạch men- Simili- Mặt gỗ
                  </p>
                  <p>
                    HƯỚNG DẪN SỬ DỤNG:- Bước 1: Hòa 1 nắp đầy nước lau sàn
                    Sunlight vào nửa xô nước (Loại xô 5L).- Bước 2: Nhúng ướt
                    giẻ rồi lau sạch các vết bẩn.- Bước 3: Không lau lại bằng
                    nước.;Xuất xứ thương hiệu: Sản xuất tại Việt Nam - Sản phẩm
                    của Công ty TNHH Quốc Tế Unilever Việt Nam.
                  </p>
                  <p>
                    Thành phần: Alcohol Ethoxylate; Chất thơm (chứa tinh dầu Quế
                    (0,38ppm)); Carbomer; Sodium Hydroxide; Isothiazolinones;
                    Chất tạo màu; Nước.
                  </p>
                  <p>Bảo quản: Nơi thoáng mát, tránh ánh nắng trực tiếp</p>
                </div>
              </div>
              <button class="btn btn-showmore">
                Xem thêm <i class="icon icon-carret-down"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
