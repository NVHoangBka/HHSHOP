import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, addToCart }) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  if (!product) return null;

  const { image, price, discountPrice } = product;

  const name = product.getName
    ? product.getName(currentLanguage)
    : product.name?.vi || "";
  const slug = product.getSlug
    ? product.getSlug(currentLanguage)
    : product.slug?.[currentLanguage] || product.slug?.vi || "";

  const handleAddToCart = () => {
    if (!product.id) return;
    const defaultVariant = product.variants?.[0]?.value || "default";
    addToCart(product.id, defaultVariant, 1);
  };

  return (
    <div className="card h-100">
      <img
        src={image || "https://via.placeholder.com/200"}
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
        <button onClick={handleAddToCart} className="btn btn-primary mt-auto">
          {t("product.buttons.addToCart")}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
