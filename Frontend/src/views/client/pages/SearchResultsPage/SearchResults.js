// src/views/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductItem from "..//ProductPage/ProductItem";

const SearchResults = ({ productController, addToCart }) => {
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
        <p className="mb-3">Vui lòng nhập từ khóa tìm kiếm.</p>
        <Link to="/" className="btn btn-success">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-success-subtle">
      <div className="container pb-4">
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
              <span style={{ color: "#BFBFBF" }}>Tìm kiếm</span>
            </li>
          </ul>
        </div>
        <div className="py-3 px-4  bg-white rounded-3">
          <h2 className="mb-4 mt-2 text-center fst-italic">
            Kết quả tìm kiếm cho: <strong>{q}</strong>
            {category !== "all" && ` trong ${getCategoryName(category)}`}
          </h2>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Đang tìm...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">Không tìm thấy sản phẩm nào.</p>
              <Link to="/" className="btn btn-outline-success">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="row justify-content-center">
              {products.map((product) => (
                <div key={product.id} className="col-2 mb-4">
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
