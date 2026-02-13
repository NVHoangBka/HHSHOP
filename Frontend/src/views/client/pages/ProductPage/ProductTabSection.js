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
  categoryController,
}) => {
  const [t] = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [categoryId, setCategoryId] = useState(null);

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  useEffect(() => {
    const fetchCategoryId = async (value) => {
      try {
        const result = await categoryController.getCategoriesByValue(value);
        if (result.success) {
          const categories = result.category;
          setCategoryId(categories?._id);
        }
      } catch (error) {}
    };
    fetchCategoryId(value);
  }, [value]);

  // Lấy subTitles tương ứng với value của section này
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categoryId) return;

      try {
        const result =
          await categoryController.getSubCategoriesByCategory(categoryId);
        if (result.success) {
          const subs = result.subCategories;
          setSubCategories(subs);

          // Tự động chọn tab đầu tiên
          if (subs.length > 0) {
            setActiveTab(subs[0]._id);
          } else {
            setActiveTab("");
          }
        }
      } catch (error) {
        console.error("Lỗi lấy subTitles:", error);
        setSubCategories([]);
        setActiveTab("");
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  // Logic lấy sản phẩm ()
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;

      try {
        let products = [];

        if (activeTab) {
          // Lọc theo subCategory cụ thể
          products =
            await productController.getProductsBySubCategory(activeTab);
        } else {
          // Lọc theo category cha (nếu không có sub hoặc tab "Tất cả")
          products = await productController.getProductsByCategory(categoryId);
        }

        setFilteredProducts(products);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [activeTab, categoryId]);

  return (
    <div className="section-product-tabs mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-2">
      <div className="container">
        <div className="heading-bar position-relative d-flex">
          <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-xl-3 px-lg-2 px-md-2 px-sm-2 px-2">
            <Link
              to="#"
              className="text-decoration-none fs-1 fw-semibold text-success"
            >
              {title}
            </Link>
          </h2>
        </div>
        <div className="heading-tabs mx-xl-5 mt-xl-4 mx-lg-5 mt-lg-3 mt-2 mx-md-4 mt-md-1 mx-2 row flex-nowrap overflow-auto overflow-md-visible justify-content-md-center">
          {subCategories.slice(0, 3).map((sub) => (
            <button
              key={sub._id}
              className={`btn product-tab col-xl-3 col-lg-3 mx-xl-3 ${
                activeTab === sub._id ? "btn active" : "bg-white border"
              } hover`}
              onClick={() => setActiveTab(sub._id)}
            >
              {getTranslated(sub.name)}
            </button>
          ))}
        </div>
        <div className="tab-content mt-xl-4 mt-lg-4 mt-md-3 mt-sm-3 mt-3">
          <div className="product-list row bg-white py-xl-3 py-lg-3 py-md-2 py-sm-1 py-2 justify-content-md-center m-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 my-xl-2 my-lg-2 my-md-1 my-sm-1 my-1"
                  key={index}
                >
                  <ProductItem
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    productController={productController}
                  />
                </div>
              ))
            ) : (
              <p className="text-center">{t("product.noProducts")}</p>
            )}
          </div>
          <Link
            to={`/products/${path}`}
            alt={t("product.features.showMore")}
            className="bg-white w-100 d-flex mt-xl-4 mt-lg-3 mt-md-2 mt-sm-1 mt-2 p-xl-2 p-lg-2 p-md-1 p-sm-1 p-1 justify-content-center text-decoration-none text-success hover rounded-2"
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
