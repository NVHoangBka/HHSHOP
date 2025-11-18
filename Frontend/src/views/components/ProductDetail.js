import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProductDetail = ({ addToCart, productController }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, productController, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
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

  const displayPrice = product.discountPrice || product.price;

  return (
    <>
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
                <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
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
      <div class="container">
        <product-form id="main-product">
          <div class="product-detail row ">
            <div class="product-gallery-wrapper col-6">
              <div class="">
                <div class="product-gallery">
                  <div>
                    <div id="GalleryMain-product-1" class="swiper gallery-main">
                      <div
                        class="swiper-wrapper"
                        id="swiper-wrapper"
                        aria-live="polite"
                      >
                        <div
                          class="swiper-slide"
                          role="group"
                          aria-label="1 / 3"
                          data-swiper-slide-index="0"
                        >
                          <img
                            class="object-contain rounded-lg  gallery-main-img"
                            src="//bizweb.dktcdn.net/thumb/grande/100/518/448/products/image-116.jpg?v=1717487311197"
                            alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                          />
                        </div>

                        <div
                          class="swiper-slide"
                          role="group"
                          aria-label="2 / 3"
                          data-swiper-slide-index="1"
                          style={{ display: "none" }}
                        >
                          <img
                            class="object-contain rounded-lg gallery-main-img"
                            src="//bizweb.dktcdn.net/thumb/grande/100/518/448/products/image-117.jpg?v=1717487311197"
                            alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                          />
                        </div>

                        <div
                          class="swiper-slide"
                          role="group"
                          aria-label="3 / 3"
                          data-swiper-slide-index="2"
                          style={{ display: "none" }}
                        >
                          <img
                            class="object-contain rounded-lg  gallery-main-img"
                            src="//bizweb.dktcdn.net/thumb/grande/100/518/448/products/image-118.jpg?v=1717487311197"
                            alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                          />
                        </div>
                      </div>
                      <div
                        class="swiper-button-prev"
                        tabindex="0"
                        role="button"
                        aria-label="Previous slide"
                        aria-controls="swiper-wrapper-109b38c3e674d3f1"
                      ></div>
                      <div
                        class="swiper-button-next"
                        tabindex="0"
                        role="button"
                        aria-label="Next slide"
                        aria-controls="swiper-wrapper-109b38c3e674d3f1"
                      ></div>
                      <span
                        class="swiper-notification"
                        aria-live="assertive"
                        aria-atomic="true"
                      ></span>
                    </div>

                    <div
                      id="GalleryThumbnails-product-1"
                      class="swiper w-100  d-flex aligin-items-center justify-content-center"
                    >
                      <div
                        class="swiper-wrapper d-flex"
                        id="swiper-wrapper"
                        aria-live="polite"
                      >
                        <div
                          class="swiper-slide cursor-pointer mx-1 border border-warning"
                          role="group"
                          aria-label="1 / 3"
                        >
                          <div class=" d-flex align-items-center justify-content-center">
                            <img
                              class="object-contain w-auto"
                              src="//bizweb.dktcdn.net/thumb/small/100/518/448/products/image-116.jpg?v=1717487311197"
                              width="64"
                              height="64"
                              alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                            />
                          </div>
                        </div>

                        <div
                          class="swiper-slide cursor-pointer mx-1 border"
                          role="group"
                          aria-label="2 / 3"
                        >
                          <div class=" d-flex align-items-center justify-content-center">
                            <img
                              class="object-contain w-auto"
                              src="//bizweb.dktcdn.net/thumb/small/100/518/448/products/image-117.jpg?v=1717487311197"
                              width="64"
                              height="64"
                              alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                            />
                          </div>
                        </div>

                        <div
                          class="swiper-slide cursor-pointer mx-1 border"
                          role="group"
                          aria-label="3 / 3"
                        >
                          <div class=" d-flex align-items-center justify-content-center">
                            <img
                              class="object-contain w-auto"
                              src="//bizweb.dktcdn.net/thumb/small/100/518/448/products/image-118.jpg?v=1717487311197"
                              width="64"
                              height="64"
                              alt="Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng | Chai 900g"
                            />
                          </div>
                        </div>
                      </div>
                      <span
                        class="swiper-notification"
                        aria-live="assertive"
                        aria-atomic="true"
                      ></span>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="share-group flex justify-center items-center mt-5 gap-3">
                    <p class="share-group__heading mr-3 ">Chia sẻ</p>
                    <div class="share-group__list flex gap-3">
                      <Link
                        title="facebook-share"
                        class="share-group__item p-2 border border-warningneutral-50 rounded-full  flex items-center justify-center facebook"
                        target="_blank"
                        to="http://www.facebook.com/sharer.php?u=https://ega-mini-mart.mysapo.net/nuoc-lau-san-sunlight-tinh-dau-thao-moc-ngan-con-trung-chai-900g"
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
                        class="share-group__item messenger p-2  border border-neutral-50 rounded-full flex items-center justify-center lg:hidden"
                        target="_blank"
                        to="fb-messenger://share/?link=https://ega-mini-mart.mysapo.net/nuoc-lau-san-sunlight-tinh-dau-thao-moc-ngan-con-trung-chai-900g"
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
                      <Link
                        title="pinterest-share"
                        class="share-group__item pinterest p-2 border border-neutral-50 rounded-full"
                        target="_blank"
                        to="http://pinterest.com/pin/create/button/?url=https://ega-mini-mart.mysapo.net/nuoc-lau-san-sunlight-tinh-dau-thao-moc-ngan-con-trung-chai-900g"
                      >
                        <img
                          class="object-contain"
                          src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/pinterest-icon.png?1760435339581"
                          alt="pinterest"
                          loading="lazy"
                          width="20"
                          height="20"
                        />
                      </Link>
                      <Link
                        title="twitter-share"
                        class="share-group__item twitter p-2 border border-neutral-50 rounded-full flex items-center justify-center "
                        target="_blank"
                        to="http://twitter.com/share?text=https://ega-mini-mart.mysapo.net/nuoc-lau-san-sunlight-tinh-dau-thao-moc-ngan-con-trung-chai-900g"
                      >
                        <img
                          class="object-contain"
                          src="//bizweb.dktcdn.net/100/518/448/themes/953339/assets/twitter-icon.png?1760435339581"
                          alt="twitter"
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
            <div class="product-form-wrapper col-6">
              <div class="bg-background  lg:rounded-l  md:py-6 lg:p-6 ">
                <div class="   ">
                  <div class="product-title mb-4">
                    <h1 class="fw-semibold fs-4">
                      Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                      Chai 900g
                    </h1>

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

                    <div class="group-status  d-flex flex-wrap pb-2 align-items-center border-b border-dash border-neutral-50">
                      <div class="status status-vendor col-4">
                        <span class="fs-7">Thương hiệu:</span>

                        <Link
                          to="/collections/all?vendor=Minimart"
                          class="link fs-7 fw-semibold text-black"
                        >
                          Minimart
                        </Link>
                      </div>
                      <div class="status status-sku  col-4">
                        <span class="fs-7">Mã sản phẩm:</span>
                        <span class="fs-7"> Đang cập nhật </span>
                      </div>
                    </div>

                    <div class="product-price-group rounded-sm overflow-hidden mb-4">
                      <div class="price-box d-flex align-items-center flex-wrap">
                        <div class="flex flex-wrap">
                          <span class="price fs-2 fw-bold text-active ms-3">
                            30.000₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                    <div class="coupon-group d-flex align-items-center">
                      <div class="coupon-group-header mb-2 flex-shrink-0 flex-grow-0">
                        Mã giảm giá
                      </div>
                      <portal-opener class="block w-full overflow-hidden">
                        <div class="d-flex" data-portal="#coupon-drawer">
                          <div class="d-flex overflow-hidden align-items-center cursor-pointer">
                            <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 ">
                              <i class="bi bi-ticket "> </i>
                              <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                EGA50THANG10
                              </div>
                            </div>

                            <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 ">
                              <i class="bi bi-ticket "> </i>
                              <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                EGA30THANG10
                              </div>
                            </div>

                            <div class="coupon-group-item overflow-hidden d-flex align-items-center px-3 py-2 ">
                              <i class="bi bi-ticket "> </i>
                              <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                FREESHIPTHANG10
                              </div>
                            </div>
                          </div>
                          <div class="px-3 py-2 ">
                            <i class="bi bi-carret-right "> </i>
                          </div>
                        </div>
                      </portal-opener>
                    </div>
                  </div>
                </div>

                <div class="product-cta mb-0 mt-4 ">
                  <div class=" btn--soldout  font-semibold mt-2 btn bg-neutral-50 w-full ">
                    HẾT HÀNG
                  </div>

                  <form
                    class=" hidden "
                    enctype="multipart/form-data"
                    id="add-to-cart-form"
                    action="/cart/add"
                    method="post"
                  >
                    <input type="hidden" name="variantId" value="" />

                    <div class="flex items-center gap-3 mb-4 ">
                      <div class="w-[88px] text-neutral-400"> Số lượng </div>
                      <quantity-input>
                        <div class="custom-number-input product-quantity">
                          <div class="flex flex-row h-10 border border-neutral-50 relative bg-background rounded-pill overflow-hidden h-[3.8rem] w-[13rem]">
                            <button
                              type="button"
                              name="minus"
                              class="h-full w-20 cursor-pointer outline-non p-2 disabled"
                            >
                              <i class="m-auto icon icon-minus"></i>
                            </button>
                            <input
                              type="number"
                              class="focus:outline-none form-quantity w-full focus:ring-transparent text-base  font-semibold text-md  md:text-basecursor-default flex items-center outline-none bg-transparent border-none text-center"
                              name="quantity"
                              value="1"
                              min="1"
                            />
                            <button
                              type="button"
                              name="plus"
                              class=" h-full w-20 rounded-r cursor-pointer p-2"
                            >
                              <i class="m-auto icon icon-plus"></i>
                            </button>
                          </div>
                        </div>
                      </quantity-input>
                    </div>

                    <div class="flex gap-2 mt-4 border-t border-neutral-50 pt-4">
                      <button
                        name="buynow"
                        class=" font-semibold  btn bg-[var(--color-addtocart-color)] text-[var(--color-addtocart-bg)] border border-[var(--color-addtocart-bg)]  hover:bg-[var(--color-addtocart-bg)] hover:text-[var(--color-addtocart)] btn-buynow w-full"
                      >
                        <span> Mua ngay </span>
                        <span class="loading-icon gap-1 hidden items-center justify-center">
                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>
                        </span>
                      </button>

                      <button
                        name="addtocart"
                        class=" font-semibold  btn bg-[var(--color-addtocart-bg)] text-[var(--color-addtocart)] btn-add-to-cart w-full"
                      >
                        <span> Thêm vào giỏ</span>
                        <span class="loading-icon gap-1 hidden items-center justify-center">
                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>

                          <span class="w-1.5 h-1.5 bg-[currentColor] rounded-full animate-pulse"></span>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                <div class="card-product__badges hidden space-y-2 col-span-full lg:col-start-2 md:py-3 mt-4 "></div>

                <ul class=" pt-3 flex gap-2 flex-col product-polices">
                  <li class="item relative flex gap-2 items-center">
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
                    <div class="">
                      Giao hàng miễn phí trong 24h (chỉ áp dụng khu vực nội
                      thành)
                    </div>
                  </li>

                  <li class="item relative flex gap-2 items-center">
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
                    <div class="">
                      Trả góp lãi suất 0% qua thẻ tín dụng Visa, Master, JCB
                    </div>
                  </li>

                  <li class="item relative flex gap-2 items-center">
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
                    <div class="">Đổi trả miễn phí trong 30 ngày</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </product-form>
      </div>
    </>
  );
};

export default ProductDetail;
