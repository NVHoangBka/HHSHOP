// src/components/QuickAddModal/QuickAddModal.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const QuickAddModal = ({ product, onClose, addToCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = localStorage.getItem("i18n_lang") || "vi";

  const getTranslated = (obj, fallback = "") =>
    obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;

  const [visible, setVisible] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(
    product.variants?.[0]?.image || product.image || "",
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setMainImage(variant.image || product.image);
    setQuantity(1);
  };

  const currentPrice =
    selectedVariant?.discountPrice ||
    selectedVariant?.price ||
    product.discountPrice ||
    product.price ||
    0;

  const originalPrice = selectedVariant?.price || product.price || 0;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(100 - (currentPrice / originalPrice) * 100)
    : 0;

  const availableStock = selectedVariant?.stock ?? product.totalStock ?? 0;

  const handleAddToCart = () => {
    if (!product.id) return;
    const variantValue = selectedVariant?.value || "default";
    addToCart(product.id, variantValue, quantity, product);
    handleClose();
  };

  const handleBuyNow = () => {
    if (!product) return;
    const variantValue = selectedVariant?.value || "default";

    const buyNowItem = {
      ...product,
      quantity,
      variantValue,
      selectedVariant: selectedVariant ? { ...selectedVariant } : null,
      displayName: selectedVariant
        ? `${getTranslated(product.name)} - ${selectedVariant.value}`
        : getTranslated(product.name),
      finalPrice: selectedVariant
        ? selectedVariant?.discountPrice || selectedVariant?.price
        : product?.discountPrice || product?.price,
      cartImage: mainImage,
    };

    navigate("/checkout", {
      state: {
        checkoutItems: [buyNowItem],
        isQuickBuy: true,
      },
    });

    handleClose();
  };

  const allImages =
    product.gallery?.length > 0
      ? product.gallery
      : [product.image].filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`qam-backdrop${visible ? " show" : ""}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`qam-sheet${visible ? " show" : ""}`}>
        <div className="d-block d-sm-none qam-drag-bar" />
        <div className="row p-2 justify-content-between">
          {/* ======================================================
                        MOBILE (<576px)
          ====================================================== */}
          <div className="col-12 d-sm-none p-3">
            {/* Header: ảnh + tên + giá + nút đóng */}
            <div className="d-flex align-items-start gap-3 mb-3">
              <img
                src={mainImage || "https://via.placeholder.com/80"}
                alt={getTranslated(product.name)}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0,
                  background: "#f5f5f5",
                }}
              />
              <div className="flex-grow-1">
                <p className="fw-semibold mb-1 lh-sm">
                  {getTranslated(product.name)}
                </p>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="fw-bold text-danger">
                    {currentPrice.toLocaleString("vi-VN")}₫
                  </span>
                  {hasDiscount && (
                    <>
                      <del className="text-muted ">
                        {originalPrice.toLocaleString("vi-VN")}₫
                      </del>
                      <span className="badge bg-danger">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className=" bg-transparent border-0 rounded-circle text-hover"
                  style={{ zIndex: 1 }}
                  onClick={handleClose}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Variants */}
            <div className="mb-3">
              <p className="small fw-semibold mb-2">
                {t("product.variant.label")}
              </p>
              <div className="d-flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantChange(v)}
                    className={`btn btn ${
                      selectedVariant?.value === v.value
                        ? "btn-outline-success"
                        : "btn-outline-secondary"
                    }`}
                    style={
                      selectedVariant?.value === v.value
                        ? { borderWidth: 2 }
                        : {}
                    }
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="small fw-semibold">
                {t("product.quantity.label")}
              </span>
              <div className="d-flex align-items-center border rounded-2">
                <button
                  className="btn btn-sm px-2"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <i className="bi bi-dash fs-5"></i>
                </button>
                <span className="px-3 fw-semibold">{quantity}</span>
                <button
                  className="btn btn-sm px-2"
                  onClick={() =>
                    setQuantity(Math.min(availableStock, quantity + 1))
                  }
                  disabled={quantity >= availableStock}
                >
                  <i className="bi bi-plus fs-5"></i>
                </button>
              </div>
              {availableStock > 0 && availableStock < 10 && (
                <span className="text-danger small">Còn {availableStock}</span>
              )}
            </div>

            {/* Nút hành động — full width */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger rounded-5 py-2 fw-semibold flex-grow-1"
                onClick={handleBuyNow}
              >
                {t("product.buttons.buyNow")}
              </button>
              <button
                className="btn btn-danger rounded-5 py-2 fw-semibold flex-grow-1"
                onClick={handleAddToCart}
                disabled={availableStock === 0}
              >
                {availableStock === 0
                  ? t("product.buttons.outOfStock")
                  : t("product.buttons.addToCart")}
              </button>
            </div>
          </div>

          {/* ======================================================
                      TABLET / DESKTOP (≥576px)
          ====================================================== */}
          {/* Ảnh sản phẩm */}
          <div className="col-md-6 d-none d-sm-block ">
            <img
              src={mainImage || "https://via.placeholder.com/400"}
              alt={getTranslated(product.name)}
              className="w-100 rounded-3"
            />
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
                {allImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setMainImage(img)}
                    className={`rounded-2 cursor-pointer border ${
                      mainImage === img ? "border-danger border-2" : ""
                    }`}
                    style={{
                      width: "54px",
                      height: "54px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thông tin */}
          <div className="col-md-6 d-none d-sm-block ">
            {/* Nút đóng */}
            <div className="d-flex justify-content-end">
              <button
                className=" bg-transparent border-0 rounded-circle text-hover"
                style={{ zIndex: 1 }}
                onClick={handleClose}
              >
                <i className="bi bi-x-lg fs-4"></i>
              </button>
            </div>

            {/* Tên sản phẩm */}
            <h5 className="fw-semibold mb-2 fs-2">
              <Link
                to={`/products/slug/${getTranslated(product.slug)}`}
                className="text-dark text-decoration-none"
                onClick={onClose}
              >
                {getTranslated(product.name)}
              </Link>
            </h5>

            <div className="d-flex flex-wrap align-items-center my-2">
              <button
                aria-label="So sánh"
                type="button"
                className="p-0 fs-7 fw-semibold d-flex align-items-center border border-0 bg-transparent text-danger"
              >
                <i className="bi bi-arrow-left-right me-1"></i>
                <span>So sánh</span>
              </button>
            </div>

            {/* Thương hiệu + SKU */}
            <div className="d-flex gap-3 text-muted small mb-3 border-bottom pb-2">
              <span>
                {t("product.brand")}: {""}
                <span className="fw-semibold text-dark text-decoration-underline">
                  {Array.isArray(product.brands)
                    ? product.brands.join(", ")
                    : product.brands || "Khác"}
                </span>
              </span>
              <span>
                {t("product.sku")}:{" "}
                {product.id?.slice(-8).toUpperCase() || "Đang cập nhật"}
              </span>
            </div>

            {/* Giá */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3 fw-bold text-danger">
                {currentPrice.toLocaleString("vi-VN")}₫
              </span>
              {hasDiscount && (
                <>
                  <del className="text-muted fs-6">
                    {originalPrice.toLocaleString("vi-VN")}₫
                  </del>
                  <span className="badge bg-danger fs-5">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            <div className="d-flex align-items-center mb-3 gap-4">
              <p className="mb-0 pb-0 fw-semibold">
                {t("product.variant.label")}
              </p>
              <div className="d-flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantChange(v)}
                    className={`btn btn ${
                      selectedVariant?.value === v.value
                        ? "btn-danger"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="d-flex align-items-center gap-4 mb-3">
              <span className="fw-semibold small">
                {t("product.quantity.label")}
              </span>
              <div className="d-flex border rounded-2 align-items-center">
                <button
                  className="btn btn-sm px-2"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="px-3 fw-semibold">{quantity}</span>
                <button
                  className="btn btn-sm px-2"
                  onClick={() =>
                    setQuantity(Math.min(availableStock, quantity + 1))
                  }
                  disabled={quantity >= availableStock}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              {availableStock > 0 && (
                <span className="text-success small">
                  <i className="bi bi-check-circle me-1"></i>
                  {t("product.inStock") || "Sẵn trong kho"}
                </span>
              )}
            </div>

            {/* Nút hành động */}
            <div className="d-flex gap-2 border-top pt-3">
              <button
                className="btn btn-outline-danger rounded-5 flex-grow-1 py-2 fw-semibold"
                onClick={handleBuyNow}
              >
                {t("product.buttons.buyNow")}
              </button>
              <button
                className="btn btn-danger rounded-5 flex-grow-1 py-2 fw-semibold"
                onClick={handleAddToCart}
                disabled={availableStock === 0}
              >
                {availableStock === 0
                  ? t("product.buttons.outOfStock")
                  : t("product.buttons.addToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickAddModal;
