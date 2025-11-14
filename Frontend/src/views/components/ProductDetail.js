import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProductDetail = ({ addToCart, productController }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productController.getProductById(id);
        if (!data) {
          console.error("Không có sản phẩm");
          // navigate("/");
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, productController, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Sản phẩm không tồn tại.</p>
        <Link to="/" className="btn btn-outline-success">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="bg-success-subtle">
      <div className="container">
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
              <span style={{ color: "#BFBFBF" }}>{product.name}</span>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={product.image || "/placeholder.jpg"}
                  className="img-fluid rounded-start"
                  alt={product.name}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h2 className="card-title">{product.name}</h2>
                  <p className="card-text">
                    <strong>Giá:</strong>
                    {product.discountPrice ? (
                      <>
                        <span className="text-danger fs-3 fw-bold me-2">
                          {displayPrice.toLocaleString("vi-VN")}₫
                        </span>
                        <del className="text-muted">
                          {product.price.toLocaleString("vi-VN")}₫
                        </del>
                      </>
                    ) : (
                      <span className="text-success fs-3 fw-bold">
                        {displayPrice.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </p>
                  {/* Mô tả */}
                  {product.description && (
                    <div className="mb-4">
                      <h5 className="fw-semibold text-success">Mô tả</h5>
                      <p className="text-muted">{product.description}</p>
                    </div>
                  )}

                  {/* Thông tin bổ sung */}
                  <div className="row mb-4">
                    {product.brands?.length > 0 && (
                      <div className="col-sm-6 mb-2">
                        <strong>Thương hiệu:</strong>{" "}
                        {product.brands.join(", ")}
                      </div>
                    )}
                    {product.types?.length > 0 && (
                      <div className="col-sm-6 mb-2">
                        <strong>Danh mục:</strong> {product.types.join(", ")}
                      </div>
                    )}
                    {product.colors?.length > 0 && (
                      <div className="col-sm-6 mb-2">
                        <strong>Màu sắc:</strong> {product.colors.join(", ")}
                      </div>
                    )}
                    {product.tag?.length > 0 && (
                      <div className="col-sm-6 mb-2">
                        <strong>Tag:</strong> {product.tag.join(", ")}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary me-2"
                  >
                    Thêm vào giỏ
                  </button>
                  <Link to="/" className="btn btn-secondary">
                    Tiếp tục mua sắm
                  </Link>

                  {/* Fake sale badge */}
                  {product.falseSale && (
                    <div className="mt-3">
                      <span className="badge bg-danger fs-6">
                        Giảm giá sốc!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
