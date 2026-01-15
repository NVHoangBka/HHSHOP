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
            (category) => category.isFeatured === true
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

  return (
    <>
      <Slider />
      <div className="home bg-success-subtle py-xl-4">
        <div className="container">
          <div className="section-banner-group row">
            {bannerHome
              .filter((banner) => banner.showHome === true)
              .map((banner, index) => (
                <div key={index} className="banner-item col-4">
                  <img
                    src={banner.image}
                    alt="Banner 1"
                    className="w-100 rounded-4"
                  />
                </div>
              ))}
          </div>
          <div className="section-flashsale mt-xl-5 bg-danger rounded-4 pb-xl-3">
            <h2 className="text-white ps-xl-3 py-xl-4 m-0">
              {t("home.flash-sale-title")}
            </h2>
            <div className="product-flashsale-list row px-xl-1 m-0 justify-content-center">
              {flashSaleProducts.length > 0 ? (
                flashSaleProducts.slice(0, 6).map((product, index) => (
                  <div className="col-2" key={index}>
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
        <div className="section-collection mt-xl-5 position-relative">
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
