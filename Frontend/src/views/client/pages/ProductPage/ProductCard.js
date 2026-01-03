import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const { image, slug, price } = product;
  const name = product.getName(currentLanguage);
  return (
    <div className="card h-100">
      <img
        src={image}
        className="card-img-top"
        alt={name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link
            to={`/product/slug/${slug}`}
            className="text-decoration-none text-dark"
          >
            {name}
          </Link>
        </h5>
        <p className="card-text">{price.toLocaleString("vi-VN")} VNĐ</p>
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
