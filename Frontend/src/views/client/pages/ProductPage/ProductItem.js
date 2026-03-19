import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import QuickAddModal from "../../components/QuickAddModal";

const ProductItem = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  const [showModal, setShowModal] = useState(false);
  if (!product) {
    return (
      <div className="product-item p-3 border mx-2">
        {t("product.not-found")}
      </div>
    );
  }

  const { name, image, price, discountPrice, slug } = product;

  const ratingAverage = product.ratingAverage || 0;
  const hasVariants = product.variants?.length > 0;

  //Tính tổng tồn kho
  const availableStock = hasVariants
    ? product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0)
    : product.totalStock || 0;

  const isOutOfStock = availableStock <= 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < Math.floor(rating) ? "bi-star-fill" : "bi-star"} text-warning`}
      />
    ));
  };

  const handleShowProductDetail = (e) => {
    e.stopPropagation();
    navigate(`/products/slug/${getTranslated(slug)}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.id) return;

    if (hasVariants) {
      setShowModal(true);
    } else {
      addToCart(product.id, "default", 1, product);
    }
  };

  return (
    <>
      <div
        className="product-item w-100 p-lg-3 p-md-2 p-2 border mx-lg-2 mx-1 bg-white h-100 rounded-4 cursor-pointer hover"
        onClick={handleShowProductDetail}
      >
        <img
          src={image}
          className="img-fluid rounded-start w-100"
          alt={getTranslated(name)}
          style={{ height: "158px" }}
        />
        <p className="mt-lg-3 mt-md-2 mt-1 line-clamp-2 fs-body fw-semibold text-hover fixed-two-lines">
          {getTranslated(name)}
        </p>
        <div className="more d-flex line-clamp-2 justify-content-between mx-1">
          <div className="price">
            <p className="price-current m-xl-0 text-danger fw-bold">
              {formatPrice(discountPrice || price)}
            </p>
            {discountPrice && (
              <p className="price-old text-decoration-line-through m-0">
                {formatPrice(price)}
              </p>
            )}
          </div>

          {isOutOfStock ? (
            <button
              className="btn btn-sm text-danger fw-bold border rounded-pill px-2 py-1"
              style={{ fontSize: "11px", cursor: "not-allowed" }}
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              {t("product.buttons.outOfStock") || "Hết hàng"}
            </button>
          ) : (
            <button
              className="text-danger border px-xl-2 py-xl-1 px-lg-2 py-lg-1 px-md-1 px-1 rounded-circle bg-warning-subtle hover"
              onClick={handleAddToCart}
              aria-label={`Add ${getTranslated(name)} to cart`}
            >
              <i className="bi bi-cart4 fs-4"></i>
            </button>
          )}
        </div>

        <div className="rate">{renderStars(ratingAverage)}</div>
      </div>

      {showModal && (
        <QuickAddModal
          product={product}
          addToCart={addToCart}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductItem;
