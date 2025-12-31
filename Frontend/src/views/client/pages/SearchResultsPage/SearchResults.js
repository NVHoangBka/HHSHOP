// src/views/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductItem from "../ProductPage/ProductItem";
import { useTranslation } from "react-i18next";

const SearchResults = ({ productController, addToCart }) => {
  const [t, i18n] = useTranslation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await productController.search(q, category);
        setProducts(results);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (q) fetchResults();
  }, [q, category, productController]);

  if (!q) {
    return (
      <div className="container py-5 text-center">
        <p className="mb-3">{t("search.searchResults.noKeyword")}</p>
        <Link to="/" className="btn btn-success">
          {t("search.searchResults.backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-success-subtle">
      <div className="container pb-xl-4">
        <div className="breadcrumbs">
          <ul className="breadcrumb py-xl-3 flex flex-wrap items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("search.searchResults.breadcrumb.home")}
                style={{ textDecoration: "none", color: "black" }}
              >
                <span>{t("search.searchResults.breadcrumb.home")}</span>
              </Link>
              <span className="mx-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span style={{ color: "#BFBFBF" }}>
                {t("search.searchResults.breadcrumb.current")}
              </span>
            </li>
          </ul>
        </div>
        <div className="py-xl-3 px-xl-4  bg-white rounded-3">
          <h2 className="mb-4 mt-2 text-center fst-italic">
            {t("search.searchResults.title")} <strong>{q}</strong>
            {category !== "all" && ` trong ${getCategoryName(category)}`}
          </h2>
          {loading ? (
            <div className="text-center py-xl-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">
                  {t("search.searchResults.loading")}
                </span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-xl-5">
              <p className="text-muted mb-xl-3">
                {t("search.searchResults.noResults")}
              </p>
              <Link to="/" className="btn btn-outline-success">
                {t("search.searchResults.backHome")}
              </Link>
            </div>
          ) : (
            <div className="row justify-content-center">
              {products.map((product) => (
                <div key={product.id} className="col-xl-2 mb-xl-4">
                  <ProductItem product={product} addToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getCategoryName = (cat) => {
  const map = {
    "personal-care": "Chăm sóc cá nhân",
    "baby-care": "Chăm sóc bé",
    "household-cleaning": "Vệ sinh nhà cửa",
    "food-beverages": "Thực phẩm & Đồ uống",
  };
  return map[cat] || cat;
};

export default SearchResults;
