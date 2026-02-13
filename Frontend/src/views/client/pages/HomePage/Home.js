import React, { useEffect, useState } from "react";
import Slider from "../../components/Slider";
import ProductItem from "../ProductPage/ProductItem";
import ProductTabSection from "../ProductPage/ProductTabSection";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = ({
  addToCart,
  productController,
  titleController,
  bannerController,
  categoryController,
}) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [bannerHome, setBannerHome] = useState([]);
  const [titlesHome, setTitlesHome] = useState([]);
  const [categoriesHome, setCategoriesHome] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [status, setStatus] = useState("not-started");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await productController.getAllProducts();
        const banners = await bannerController.getBannersAll();
        const titles = await titleController.getTitlesByType("h1");
        const resCategories = await categoryController.getCategories();

        if (resCategories.success) {
          const categories = resCategories.categories;
          const featuredCategories = categories.filter(
            (category) => category.isFeatured === true,
          );
          setCategoriesHome(featuredCategories);
        }

        const flashSale = orders.filter((order) => order.flashSale === true);

        setFlashSaleProducts(flashSale);
        setBannerHome(banners);
        setTitlesHome(titles);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [
    bannerController,
    productController,
    titleController,
    categoryController,
  ]);

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  const calculateTimeLeft = () => {
    const startDate = new Date();
    const endDate = new Date();
    const now = new Date();

    endDate.setHours(23, 59, 59);

    if (now < startDate) {
      setStatus("not-started");
      const diff = startDate - now;
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    // ĐANG DIỄN RA
    if (now >= startDate && now <= endDate) {
      setStatus("ongoing");
      const diff = endDate - now;
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    // ĐÃ KẾT THÚC
    setStatus("ended");
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Slider />
      <div className="home bg-success-subtle py-xl-4 py-lg-4 py-md-3 py-sm-2 py-1">
        <div className="container">
          <div className="section-banner-group row flex-nowrap flex-lg-wrap overflow-auto overflow-lg-visible my-3">
            {bannerHome
              .filter((banner) => banner.showHome === true)
              .map((banner, index) => (
                <div key={index} className="banner-item col-8 col-lg-4">
                  <img
                    src={banner.image}
                    alt="Banner 1"
                    className="w-100 rounded-4"
                  />
                </div>
              ))}
          </div>
          <div className="section-flashsale bg-danger rounded-4 mt-xl-5 pb-xl-3 mt-lg-5 pb-lg-3 mt-md-4 pb-md-3 mt-sm-3 pb-sm-2">
            <div className="flashsale-header d-flex flex-column flex-lg-row align-items-center justify-content-lg-between text-center text-lg-start">
              <h1 className="text-white ps-xl-3 py-xl-4 m-0 py-lg-3 ps-lg-3 py-md-2 ps-md-2 py-sm-1 ps-sm-1 ps-2 py-2 fw-bold">
                {t("home.flash-sale-title")}
              </h1>
              <div className="flashsale__countdown-timer flex-wrap flashsale__countdown-wrapper d-flex items-align-center gap-2 justify-content-end pe-xl-3 pe-lg-3 pe-md-2 pe-sm-1 pe-2">
                <div className="flashsale__countdown-title text-center text-white me-3 d-flex align-items-center">
                  {status === "not-started" && (
                    <span>{t("home.not-started")}</span>
                  )}

                  {status === "ongoing" && (
                    <span>
                      {t("home.ongoing_line1")} <br />
                      <b>{t("home.ongoing_line2")}</b>
                    </span>
                  )}

                  {status === "ended" && <span>{t("home.ended")}</span>}
                </div>
                <div className="flashsale__countdown">
                  <div className="row g-2 justify-content-center align-items-center">
                    {/* Hours */}
                    <div className="col-auto">
                      <div className="bg-warning rounded text-center p-2 overflow-hidden countdown-box">
                        <div key={timeLeft.hours} className="count-number">
                          {String(timeLeft.hours || 0).padStart(2, "0")}
                        </div>
                        <div className="small">{t("home.hours")}</div>
                      </div>
                    </div>

                    {/* Minutes */}
                    <div className="col-auto">
                      <div className="bg-warning rounded text-center p-2 overflow-hidden countdown-box">
                        <div key={timeLeft.minutes} className="count-number">
                          {String(timeLeft.minutes || 0).padStart(2, "0")}
                        </div>
                        <div className="small">{t("home.minutes")}</div>
                      </div>
                    </div>

                    {/* Seconds */}
                    <div className="col-auto">
                      <div className="bg-warning rounded text-center p-2 overflow-hidden countdown-box">
                        <div key={timeLeft.seconds} className="count-number">
                          {String(timeLeft.seconds || 0).padStart(2, "0")}
                        </div>
                        <div className="small">{t("home.seconds")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-flashsale-list flex-nowrap row overflow-auto overflow-md-visible p-3 justify-content-lg-center">
              {flashSaleProducts.length > 0 ? (
                flashSaleProducts.slice(0, 6).map((product, index) => (
                  <div
                    className="col-6 col-sm-4 col-md-4 col-xl-2 col-lg-3"
                    key={index}
                  >
                    <ProductItem
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-white">
                  {t("home.no-flash-sale")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="section-collection mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-3 position-relative">
          <img
            src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/coll_bg.jpg?1733201190476"
            alt="Collection Background"
            className="w-100 position-absolute h-100"
          />
          <div className="container">
            <div className="collection-list row py-xl-5 position-relative fs-6">
              {titlesHome.map((title, index) => (
                <Link
                  key={index}
                  to="#"
                  className="collection-item text-center col text-white text-decoration-none"
                >
                  <img
                    src={title.image}
                    alt={title.name}
                    className="hover mb-1"
                  />
                  <p className="m-0">{title.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {[...categoriesHome]
          .sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999))
          .map((category, index) => (
            <ProductTabSection
              key={index}
              path={getTranslated(category.slug)}
              title={getTranslated(category.name)}
              value={getTranslated(category.value)}
              addToCart={addToCart}
              productController={productController}
              titleController={titleController}
              categoryController={categoryController}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
