// src/admin/pages/Products.jsx → PHIÊN BẢN MODAL SIÊU ĐẸP
import React, { useEffect, useState, useRef } from "react";

const AdminProducts = ({ adminController }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const formRef = useRef({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    loadProducts();
  }, [adminController]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await adminController.getProductsAllAdmin();
      if (result.success) setProducts(result.products || []);
    } catch (err) {
      showToast("Lỗi tải sản phẩm", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      formRef.current = { ...product };
    } else {
      setIsEditing(false);
      setCurrentProduct(null);
      formRef.current = {
        name: "",
        price: "",
        discountPrice: "",
        stock: "",
        image: "",
      };
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setIsEditing(false);
      setCurrentProduct(null);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formRef.current };

    try {
      let result;
      if (isEditing) {
        result = await adminController.updateProductAdmin(
          currentProduct._id,
          data
        );
      } else {
        result = await adminController.createProductAdmin(data);
      }

      if (result.success) {
        showToast(
          isEditing ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!",
          "success"
        );
        closeModal();
        loadProducts();
      }
    } catch (err) {
      showToast("Lỗi: " + (err.message || "Không thể lưu"), "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này? Không thể khôi phục!")) return;
    try {
      const result = await adminController.deleteProductAdmin(id);
      if (result.success) {
        showToast("Xóa thành công!", "success");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast("Xóa thất bại", "danger");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 fs-5">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <div
          className={`alert alert-${
            toast.type === "success" ? "success" : "danger"
          } position-fixed top-0 end-0 m-4 shadow-lg`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
          <button
            type="button"
            className="btn-close float-end"
            onClick={() => setToast({ show: false })}
          ></button>
        </div>
      )}

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Quản lý sản phẩm</h2>
          <button
            className="btn btn-success btn-lg shadow"
            onClick={() => openModal()}
          >
            Thêm sản phẩm mới
          </button>
        </div>

        {/* Table */}
        <div className="card shadow border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-primary text-white">
                  <tr>
                    <th className="ps-4">Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-5 text-muted fs-4"
                      >
                        Chưa có sản phẩm nào
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id}>
                        <td className="ps-4">
                          <img
                            src={p.image || "/placeholder.jpg"}
                            alt={p.name}
                            className="rounded"
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                            }}
                            onError={(e) => (e.target.src = "/placeholder.jpg")}
                          />
                        </td>
                        <td className="fw-bold">{p.name}</td>
                        <td>
                          <div>
                            <del className="text-muted small">
                              {p.price.toLocaleString()}₫
                            </del>
                            <br />
                            <span className="text-danger fw-bold fs-5">
                              {(p.discountPrice || p.price).toLocaleString()}₫
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              p.stock > 10
                                ? "bg-success"
                                : p.stock > 0
                                ? "bg-warning"
                                : "bg-danger"
                            } fs-6`}
                          >
                            {p.stock} cái
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => openModal(p)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p._id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${modalOpen ? "show" : ""}`}
        style={{ display: modalOpen ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg ">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Tên sản phẩm</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formRef.current.name}
                      onChange={(e) => (formRef.current.name = e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Giá gốc (₫)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formRef.current.price}
                      onChange={(e) =>
                        (formRef.current.price = +e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">
                      Giá khuyến mãi (₫)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formRef.current.discountPrice}
                      onChange={(e) =>
                        (formRef.current.discountPrice = e.target.value
                          ? +e.target.value
                          : "")
                      }
                      placeholder="Để trống nếu không có"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Số lượng tồn</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formRef.current.stock}
                      onChange={(e) =>
                        (formRef.current.stock = +e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Link ảnh</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formRef.current.image}
                      onChange={(e) => (formRef.current.image = e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Mô tả sản phẩm</label>
                    <textarea
                      type="text"
                      className="form-control"
                      value={formRef.current.description}
                      onChange={(e) =>
                        (formRef.current.description = e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-success">
                    {isEditing ? "Cập nhật" : "Thêm sản phẩm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {modalOpen && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </>
  );
};

export default AdminProducts;
