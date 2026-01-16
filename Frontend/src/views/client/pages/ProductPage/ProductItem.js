import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProductItem = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  if (!product) {
    return (
      <div className="product-item p-3 border mx-xl-2">
        {t("product.not-found")}
      </div>
    );
  }

  const { name, image, price, discountPrice, rating = 0, slug } = product;

  console.log(product);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${
            i <= Math.floor(rating) ? "bi-star-fill" : "bi-star"
          } text-warning`}
        ></i>
      );
    }
    return stars;
  };

  const handleShowProductDetail = (e) => {
    e.stopPropagation();
    navigate(`/products/slug/${getTranslated(slug)}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // 👉 chặn navigate
    addToCart(product);
  };

  return (
    <div
      className="product-item w-100 p-xl-3 border mx-xl-2 bg-white h-100 rounded-4 cursor-pointer hover"
      onClick={handleShowProductDetail}
    >
      <img
        src={image}
        className="img-fluid rounded-start w-100"
        alt={getTranslated(name)}
        style={{ height: "158px" }}
      />
      <p className="mt-xl-3 line-clamp-2 fs-body fw-semibold text-hover fixed-two-lines">
        {getTranslated(name)}
      </p>
      <div className="more d-flex justify-content-between mx-xl-1">
        <div className="price">
          <p className="price-current m-xl-0 text-danger fw-bold">
            {formatPrice(discountPrice || price)}
          </p>
          {discountPrice && (
            <p className="price-old text-decoration-line-through m-xl-0">
              {formatPrice(price)}
            </p>
          )}
        </div>
        <button
          className="text-danger border px-xl-2 py-xl-1 rounded-circle bg-warning-subtle hover"
          onClick={handleAddToCart}
          aria-label={`Add ${getTranslated(name)} to cart`}
        >
          <i className="bi bi-cart4 fs-4"></i>
        </button>
      </div>
      <div className="rate">{renderStars(rating)}</div>
    </div>
  );
};

export default ProductItem;
