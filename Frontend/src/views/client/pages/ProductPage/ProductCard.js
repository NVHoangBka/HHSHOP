import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t } = useTranslation();
  return (
    <div className="card h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link
            to={`/product/slug/${product.slug}`}
            className="text-decoration-none text-dark"
          >
            {product.name}
          </Link>
        </h5>
        <p className="card-text">{product.price.toLocaleString("vi-VN")} VNĐ</p>
        <button
          onClick={() => addToCart(product)}
          className="btn btn-primary mt-auto"
        >
          {t("product.buttons.addToCart")}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
