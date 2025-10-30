import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = ({ addToCart, productController }) => {
  const { id } = useParams();
  const product = productController.getProductById(id);

  if (!product) {
    return <div className="container mt-4"><h2>Sản phẩm không tồn tại</h2></div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={product.image} className="img-fluid rounded-start" alt={product.name} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p className="card-text"><strong>Giá:</strong> {product.price.toLocaleString('vi-VN')} VNĐ</p>
              <p className="card-text"><strong>Mô tả:</strong> {product.description}</p>
              <button
                onClick={() => addToCart(product)}
                className="btn btn-primary me-2"
              >
                Thêm vào giỏ
              </button>
              <Link to="/" className="btn btn-secondary">
                Quay lại
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;