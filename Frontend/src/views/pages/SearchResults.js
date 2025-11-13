// src/views/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const SearchResults = ({ productController, titleController }) => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [subTitles, setSubTitles] = useState([]);
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

  useEffect(() => {
    const loadSubTitle = async () => {
      try {
        const arrSubTitles = await titleController.getAllSubTitles();
        setSubTitles(arrSubTitles);
      } catch (error) {
        console.log(error);
      }
    };
    loadSubTitle();
  });

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
    <div className="container py-5">
      <h2 className="mb-4">
        Kết quả tìm kiếm cho:{" "}
        <strong>
          {subTitles
            .filter((sub) => sub.value.toLowerCase().includes(q))
            .map((sub) => sub.name)}
        </strong>
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
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
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
