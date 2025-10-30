import React from 'react';

const ProductItem = ({ product, addToCart }) => {
  if (!product) {
    return <div className="product-item p-3 border mx-2">Sản phẩm không tồn tại</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= Math.floor(rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="product-item w-100 p-3 border mx-2 bg-white h-100 rounded-4">
      <img
        src={product.image}
        className="img-fluid rounded-start w-100"
        alt={product.name}
      />
      <p className="mt-3 line-clamp-2 fs-body fw-semibold hover fixed-two-lines">{product.name}</p>
      <div className="more d-flex justify-content-between mx-1">
        <div className="price">
          <p className="price-current m-0 text-danger fw-bold">
            {formatPrice(product.discountPrice || product.price)}
          </p>
          {product.discountPrice && (
            <p className="price-old text-decoration-line-through m-0">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
        <button
          className="text-danger border px-2 py-1 rounded-circle bg-warning-subtle hover"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <i className="bi bi-cart4 fs-4"></i>
        </button>
      </div>
      <div className="rate">{renderStars(product.rating)}</div>
    </div>
  );
};

export default ProductItem;