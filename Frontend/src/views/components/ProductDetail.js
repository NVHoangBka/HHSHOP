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
    <div className="bg-success-subtle">
      <div className="container">
        <div className="breadcrumbs">
          <ul className="breadcrumb py-3 flex flex-wrap items-center text-xs md:text-sm">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title="Trang chủ"
                style={{ textDecoration: "none", color: "black" }}
              >
                <span>Trang chủ</span>
              </Link>
              <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span style={{ color: "#BFBFBF" }}>{product.name}</span>
            </li>
          </ul>
        </div>
        <div class="bg-background ">
          <product-form id="main-product">
            <div class="product-detail d-flex">
              <div class="product-gallery-wrapper">
                <div class="">
                  <div class="product-gallery">
                    <div>
                      <div
                        id="GalleryMain-product-1"
                        class="swiper gallery-main"
                      >
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
              <div class="product-form-wrapper">
                <div class="bg-background  lg:rounded-l  md:py-6 lg:p-6 ">
                  <div class="   ">
                    <div class="product-title space-y-2  mb-4">
                      <h1 class="font-semibold text-h4">
                        Nước lau sàn Sunlight Tinh dầu thảo mộc Ngăn côn trùng |
                        Chai 900g
                      </h1>

                      <div class="flex flex-wrap gap-2 items-center  mt-2 ">
                        <compare-button>
                          <button
                            aria-label="So sánh"
                            type="button"
                            data-product="36059544"
                            data-portal="#quick-view-compare"
                            class="p-0 text-secondary text-xs font-semibold flex gap-2 items-centerfont-semibold"
                          >
                            <i class="icon icon-arrow-swap"></i>
                            <span>So sánh</span>
                          </button>
                        </compare-button>
                      </div>

                      <div class="group-status  flex flex-wrap gap-4 pb-2 items-center border-b border-dash border-neutral-50">
                        <div class="status status-vendor">
                          <span class="text-xs">Thương hiệu:</span>

                          <a
                            href="/collections/all?vendor=Minimart"
                            class="link text-xs font-semibold underline"
                          >
                            Minimart{" "}
                          </a>
                        </div>
                        <div class="status status-sku">
                          <span class="text-xs">Mã sản phẩm:</span>
                          <span class="text-xs"> Đang cập nhật </span>
                        </div>
                      </div>

                      <div class="product-price-group grid rounded-sm overflow-hidden mb-4">
                        <div class="product-flashsale">
                          <div class="product-flashsale-item flex items-center justify-between gap-3 ">
                            <stock-countdown
                              class="stock-countdown"
                              data-id="section-flashsale-0"
                              data-product-id="36059544"
                              data-type="tag"
                              data-max-qty=""
                              data-real-qty="0"
                            >
                              <div class="stock-countdown-inner">
                                <div class="stock-label mb-1">Hết hàng</div>
                                <div class="stock-progressbar w-full bg-neutral-50 rounded-sm h-1">
                                  <div class="stock-percent bg-primary rounded-sm h-1"></div>
                                </div>
                              </div>
                            </stock-countdown>

                            <countdown-timer
                              data-id="section-flashsale-0"
                              data-countdown-type="hours"
                              data-start-date="04/12/2023"
                              data-start-time="08:00:00"
                              data-end-time="23:59:59"
                              data-week="0,1,2,3,4,5,6"
                              class="active not-started ongoing"
                            >
                              <div class="flashsale__countdown-timer  flex-wrap  flashsale__countdown-wrapper flex items-center gap-2 md:gap-5 lg:w-auto w-full justify-center">
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="not-started"
                                >
                                  Chương trình sẽ bắt đầu sau
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center"
                                  data-label="ongoing"
                                >
                                  Nhanh lên nào!<b>Sự kiện sẽ kết thúc sau</b>
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="ended"
                                >
                                  Chương trình đã kết thúc
                                </span>
                                <div class="flashsale__countdown">
                                  <div class="ega-badge-ctd flex items-center gap-2">
                                    <div class="ega-badge-ctd__item w-[4.4rem] md:w-[5.2rem] px-1 text-center py-1 md:py-1.5 rounded-sm ">
                                      <div class=" ega-badge-ctd__h ega-badge-ctd--transition  text-h5 md:text-h4 font-semibold">
                                        15
                                      </div>
                                      <span>Giờ</span>
                                    </div>
                                    <div class="ega-badge-dot font-semibold text-h5">
                                      :
                                    </div>
                                    <div class="ega-badge-ctd__item w-[4.4rem] md:w-[5.2rem] px-1 text-center py-1 md:py-1.5 rounded-sm ">
                                      <div class="ega-badge-ctd__h ega-badge-ctd--transition ega-badge-ctd--animate text-h5 md:text-h4 font-semibold"></div>
                                      <span>Phút</span>
                                    </div>
                                    <div class="ega-badge-dot font-semibold text-h5">
                                      :
                                    </div>
                                    <div class="ega-badge-ctd__item w-[4.4rem] md:w-[5.2rem] px-1 text-center py-1 md:py-1.5 rounded-sm ">
                                      <div class="ega-badge-ctd__h ega-badge-ctd--transition ega-badge-ctd--animate text-h5 md:text-h4 font-semibold"></div>
                                      <span>Giây</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </countdown-timer>
                          </div>

                          <div class="product-flashsale-item flex items-center justify-between gap-3 ">
                            <stock-countdown
                              class="stock-countdown"
                              data-id="section-flashsale-1"
                              data-product-id="36059544"
                              data-type="tag"
                              data-max-qty=""
                              data-real-qty="0"
                            ></stock-countdown>

                            <countdown-timer
                              data-id="section-flashsale-1"
                              data-countdown-type="dates"
                              data-start-date="24/06/2024 - 00:00:00"
                              data-end-date="26/06/2024 - 23:00:00"
                              class="ended"
                            >
                              <div class="flashsale__countdown-timer  flex-wrap  flashsale__countdown-wrapper flex items-center gap-2 md:gap-5 lg:w-auto w-full justify-center">
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="not-started"
                                >
                                  Chương trình sẽ bắt đầu sau
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="ongoing"
                                >
                                  Nhanh lên nào! <b>Sự kiện sẽ kết thúc sau</b>
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center"
                                  data-label="ended"
                                >
                                  Chương trình đã kết thúc
                                </span>
                                <div class="flashsale__countdown hidden"></div>
                              </div>
                            </countdown-timer>
                          </div>

                          <div class="product-flashsale-item flex items-center justify-between gap-3 ">
                            <stock-countdown
                              class="stock-countdown"
                              data-id="section-flashsale-2"
                              data-product-id="36059544"
                              data-type="tag"
                              data-max-qty=""
                              data-real-qty="0"
                            ></stock-countdown>

                            <countdown-timer
                              data-id="section-flashsale-2"
                              data-countdown-type="dates"
                              data-start-date="27/06/2024 - 07:00:00"
                              data-end-date="30/06/2024 - 23:00:00"
                              class="ended"
                            >
                              <div class="flashsale__countdown-timer  flex-wrap  flashsale__countdown-wrapper flex items-center gap-2 md:gap-5 lg:w-auto w-full justify-center">
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="not-started"
                                >
                                  Chương trình sẽ bắt đầu sau
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center hidden"
                                  data-label="ongoing"
                                >
                                  Nhanh lên nào! <b>Sự kiện sẽ kết thúc sau</b>
                                </span>
                                <span
                                  class="flashsale__countdown-label text-center"
                                  data-label="ended"
                                >
                                  Chương trình đã kết thúc
                                </span>
                                <div class="flashsale__countdown hidden"></div>
                              </div>
                            </countdown-timer>
                          </div>
                        </div>
                        <div class="price-box flex items-center flex-wrap gap-2  ">
                          <div class="flex flex-wrap gap-1 items-baseline">
                            <span class="price text-h4">30.000₫</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="promo-box md:col-start-1  min-h-0 min-w-0 relative mb-4   ">
                      <div class="promo-box-group  border rounded-sm">
                        <div class="promo-box__header flex items-center gap-1 px-5 py-1.5">
                          <i class="icon icon-gift"></i>
                          <div class="promo-box__header-title">
                            Quà tặng khuyến mãi
                          </div>
                        </div>

                        <div class="promo-box__body px-5 bg-background p-3 prose  max-w-full text-base">
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

                    <div class="coupon-box md:col-start-1   min-h-0 min-w-0 relative mb-4">
                      <div class="coupon-group flex items-center gap-3 ">
                        <div class="coupon-group-header text-neutral-400 mb-2 w-[88px]  flex-shrink-0 flex-grow-0">
                          Mã giảm giá
                        </div>
                        <portal-opener class="block w-full overflow-hidden">
                          <div class="flex gap-3 " data-portal="#coupon-drawer">
                            <div class="inline-flex max-w-[calc(100%-48px)] overflow-hidden items-center gap-3 cursor-pointer">
                              <div class="coupon-group-item whitespace-nowrap text-ellipsis overflow-hidden w-1/3 flex gap-2 items-center px-3 py-2  rounded-lg text-[#FF9D02] bg-relative">
                                <i class="icon icon-ticket "> </i>
                                <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                  EGA50THANG10
                                </div>
                              </div>

                              <div class="coupon-group-item whitespace-nowrap text-ellipsis overflow-hidden w-1/3 flex gap-2 items-center px-3 py-2  rounded-lg text-[#FF9D02] bg-relative">
                                <i class="icon icon-ticket "> </i>
                                <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                  EGA30THANG10
                                </div>
                              </div>

                              <div class="coupon-group-item whitespace-nowrap text-ellipsis overflow-hidden w-1/3 flex gap-2 items-center px-3 py-2  rounded-lg text-[#FF9D02] bg-relative">
                                <i class="icon icon-ticket "> </i>
                                <div class="coupon-group-item__code font-semibold text-ellipsis overflow-hidden">
                                  FREESHIPTHANG10
                                </div>
                              </div>
                            </div>
                            <div class="px-3 py-2  rounded-lg text-[#FF9D02] bg-relative w-[3.6rem] h-[3.6rem]">
                              <i class="icon icon-carret-right "> </i>
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
      </div>
    </div>
  );
};

export default ProductDetail;
