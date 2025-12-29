import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductTabSection = ({
  path,
  value,
  title,
  addToCart,
  productController,
  titleController,
}) => {
  const [t, i18n] = useTranslation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subTitles, setSubTitles] = useState([]);
  const [activeTab, setActiveTab] = useState();

  // Lấy subTitles tương ứng với value của section này
  useEffect(() => {
    const fetchSubTitles = async () => {
      if (!value) return; // nếu không có value (trường hợp trending) thì bỏ qua

      try {
        const allTitles = await titleController.getAllTitles();
        const parent = allTitles.find((t) => t.value === value);

        if (parent && parent.subTitles && parent.subTitles.length > 0) {
          const subs = parent.subTitles;
          setSubTitles(subs);

          // Tự động chọn subTitle đầu tiên làm activeTab
          if (subs.length > 0) {
            setActiveTab(subs[0].value);
          }
        } else {
          setSubTitles([]);
          setActiveTab(value);
        }
      } catch (error) {
        console.error("Lỗi lấy subTitles:", error);
        setSubTitles([]);
      }
    };

    fetchSubTitles();
  }, [value, titleController]);

  // Logic lấy sản phẩm ()
  useEffect(() => {
    if (!activeTab) return;

    const fetchProducts = async () => {
      try {
        let products = [];

        if (value === "trending" || !value) {
          // Trường hợp đặc biệt: Sản phẩm nổi bật
          products = await productController.getAllProducts();
          products = products
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)) // ví dụ
            .slice(0, 5);
        } else {
          // Lấy sản phẩm theo TẤT CẢ subTitles con
          const allSubProducts = await productController.getProductsByType(
            activeTab
          );

          // Gộp lại và lấy 5 sản phẩm đầu (hoặc random, mới nhất...)
          products = allSubProducts.slice(0, 5);
        }

        setFilteredProducts(products || []);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [activeTab, value, productController]);

  return (
    <div className="section-product-tabs mt-xl-5">
      <div className="container">
        <div className="heading-bar position-relative d-flex">
          <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-xl-3">
            <Link
              to="#"
              className="text-decoration-none fs-1 fw-semibold text-success"
            >
              {title}
            </Link>
          </h2>
        </div>
        <div className="heading-tabs mx-xl-5 mt-xl-4 row justify-content-center">
          {subTitles.slice(0, 3).map((sub) => (
            <button
              key={sub.value}
              className={`btn product-tab col-xl-3 col-lg-3 mx-xl-3 ${
                activeTab === sub.value ? "active" : "bg-white border"
              } hover`}
              onClick={() => setActiveTab(sub.value)}
            >
              {i18n.language === "en" ? sub.nameEn : sub.nameVn}
            </button>
          ))}
        </div>
        <div className="tab-content mt-xl-4">
          <div className="product-list row bg-white py-xl-3 justify-content-center m-xl-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div className="col-xl-2" key={index}>
                  <ProductItem
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    productController={productController}
                  />
                </div>
              ))
            ) : (
              <p className="text-center">{t("product.empty-category")}</p>
            )}
          </div>
          <Link
            to={`/products/${path}`}
            alt="Xem thêm"
            className="bg-white w-100 d-flex mt-xl-4 p-xl-2 justify-content-center text-decoration-none text-success hover rounded-2"
          >
            {t("common.view-all")}
            <i className="ms-1 bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductTabSection;
