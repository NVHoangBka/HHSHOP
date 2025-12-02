// src/admin/pages/Products.jsx → FORM THÊM/SỬA SẢN PHẨM ĐỈNH CAO NHẤT 2025
import React, { useEffect, useState, useRef } from "react";

const AdminProducts = ({ adminController }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // TÌM KIẾM: CHỈ BẤM ENTER MỚI LỌC
  const [searchInput, setSearchInput] = useState(""); // ô nhập liệu
  const [searchTerm, setSearchTerm] = useState(""); // từ khoá tìm kiếm chính thức

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10); // backend mặc định 10

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    image: "",
    gallery: "",
    shortDescription: "",
    description: "",
    types: [],
    tags: [],
    brand: "",
    colors: [],
    titles: [],
    subTitles: [],
    inStock: true,
    falseSale: false,
    highlightSections: [
      { title: "", content: "", icon: "bi-star-fill", order: 0 },
    ],
  });

  const pagination = {
    page: currentPage,
    limit,
    search: searchTerm || undefined,
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await adminController.getProductsAllAdmin(pagination);
      if (result.success) {
        setProducts(result.products || []);
        setTotalProducts(result.paginationData.totalProducts);
        setTotalPages(result.paginationData.totalPages);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      showToast("Lỗi tải sản phẩm", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu + khi search hoặc đổi trang
  useEffect(() => {
    setCurrentPage(1);
    loadProducts();
  }, [searchTerm]);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const popularTypes = ["hot", "new", "flashsale", "best-seller"];
  const popularTags = [
    "nước-giat",
    "nuoc-rua-chen",
    "huu-co",
    "tiet-kiem",
    "thom-lau",
  ];
  const popularBrands = [
    "Sunlight",
    "Comfort",
    "Omo",
    "Downy",
    "Lifebuoy",
    "Vim",
  ];
  const popularColors = ["Vàng", "Xanh", "Hồng", "Trắng", "Đỏ", "Tím", "Đen"];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentId(product._id);
      // CHUYỂN ĐỔI GALLERY TỪ ARRAY → STRING (mỗi link 1 dòng)
      const galleryString = Array.isArray(product.gallery)
        ? product.gallery.join("\n")
        : product.gallery || "";

      setFormData({ ...product, gallery: galleryString });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: "",
        price: "",
        discountPrice: "",
        image: "",
        gallery: "",
        shortDescription: "",
        description: "",
        types: [],
        tags: [],
        brand: "",
        colors: [],
        titles: [],
        subTitles: [],
        inStock: true,
        falseSale: false,
        highlightSections: [
          { title: "", content: "", icon: "bi-star-fill", order: 0 },
        ],
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const galleryArray = formData.gallery
      ? formData.gallery
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : [];

    const data = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : undefined,
      gallery: galleryArray,
      types: formData.types,
      tags: formData.tags,
      colors: formData.colors,
      inStock: Boolean(formData.inStock),
      falseSale: Boolean(formData.falseSale),
    };

    try {
      let result;
      if (isEditing) {
        result = await adminController.updateProductAdmin(currentId, data);
      } else {
        result = await adminController.createProductAdmin(data);
      }

      if (result.success) {
        showToast(
          isEditing ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!",
          "success"
        );
        setModalOpen(false);
        // Reload danh sách

        loadProducts();
      }
    } catch (err) {
      showToast("Lỗi: " + (err.message || "Không thể lưu"), "danger");
    }
  };

  const toggleArray = (arr, value) => {
    return arr.includes(value)
      ? arr.filter((i) => i !== value)
      : [...arr, value];
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

  const handleUploadSingle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await adminController.uploadSingle(file);
      setFormData({ ...formData, image: url });
      showToast("Upload ảnh chính thành công!", "success");
    } catch (err) {
      showToast("Upload thất bại: " + err.message, "danger");
    } finally {
      setLoading(false);
    }
  };
  const handleUploadMultiple = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setLoading(true);
      const urls = await adminController.uploadMultiple(files);

      const currentGallery = formData.gallery || "";
      const newGallery = currentGallery
        ? currentGallery + "\n" + urls.join("\n")
        : urls.join("\n");

      setFormData({ ...formData, gallery: newGallery });
      showToast("Upload ảnh chính thành công!", "success");
    } catch (err) {
      showToast("Upload thất bại: " + err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  // === LỌC KHI BẤM ENTER ===
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(searchInput.trim());
    }
    if (e.key === "Escape") {
      setSearchInput("");
      setSearchTerm("");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // Lọc chỉ theo tên sản phẩm (không phân biệt hoa thường)
  const filteredProducts = products.filter(
    (product) =>
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  console.log(totalPages);
  // console.log(currentPage);
  // console.log(totalProducts);

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
          <div>
            <h2 className="fw-bold text-primary">Quản lý sản phẩm</h2>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div
              className="me-3 position-relative border rounded-pill py-1 bg-white py-2"
              style={{ width: "300px" }}
            >
              <input
                type="text"
                className="input-group border-0 mx-1 px-3 fs-6 outline-0 no-focus"
                placeholder="Tìm sản phẩm..."
                value={searchInput}
                style={{ maxWidth: "230px" }}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <i className="bi bi-search position-absolute top-50 end-0 translate-middle fs-5"></i>

              {searchInput && (
                <button
                  type="button"
                  className="btn-close position-absolute top-50 end-0 translate-middle-y py-0 px-3 me-4 fs-7"
                  onClick={clearSearch}
                ></button>
              )}
            </div>
            <button
              className="btn btn-success shadow "
              onClick={() => openModal()}
            >
              + Thêm sản phẩm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-primary text-white">
                  <tr>
                    <th className="text-center">STT</th>
                    <th className="ps-4">Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-5 text-muted fs-4"
                      >
                        {searchTerm
                          ? "Không tìm thấy sản phẩm nào"
                          : "Chưa có sản phẩm"}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, index) => (
                      <tr key={p._id}>
                        <td className="fw-bold text-center">{index + 1}</td>
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
                        <td>
                          <p className="mb-1">
                            <b>Tên sản phẩm: </b>
                            {p.name}
                          </p>
                          <span className="">
                            <b>Mô tả: </b>
                            {p.description}
                          </span>
                        </td>
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
                            {p.stock || 0} cái
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

        {/* PHÂN TRANG ĐẸP */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation" className="mt-5">
            <div className="pagination d-flex justify-content-center">
              <button
                className="btn bg-white mx-1"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn bg-white mx-1 ${
                    currentPage === index + 1
                      ? "btn-outline-danger text-danger"
                      : "text-black"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn bg-white mx-1"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* MODAL SIÊU ĐẸP – HIỆN GIỮA MÀN HÌNH */}
      {modalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setModalOpen(false)}
          ></div>
          <div
            className="modal show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">
                    {isEditing ? "SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div
                    className="modal-body px-5"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <div className="row g-3">
                      {/* TÊN + GIÁ */}
                      <div className="col-12">
                        <label className="form-label fw-bold text-danger">
                          Tên sản phẩm *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          Giá gốc (₫) *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
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
                          value={formData.discountPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPrice: e.target.value,
                            })
                          }
                          placeholder="Để trống nếu không giảm"
                        />
                      </div>

                      <div className="col-4">
                        <label className="form-label fw-bold">
                          Thương hiệu
                        </label>
                        <select
                          className="form-select"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                        >
                          <option value="">Chọn thương hiệu</option>
                          {popularBrands.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ẢNH CHÍNH */}
                      <div className="col-12 mb-4">
                        <label className="form-label fw-bold text-danger">
                          Ảnh chính *
                        </label>

                        {/* Input dán link */}
                        <div className="input-group mb-2">
                          <input
                            type="url"
                            className="form-control"
                            placeholder="Dán link ảnh vào đây[](https://...)"
                            value={formData.image || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.value,
                              })
                            }
                          />
                          <span className="input-group-text">HOẶC</span>
                        </div>

                        {/* Upload file */}
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={handleUploadSingle}
                        />

                        {/* Preview ảnh chính */}
                        {formData.image && (
                          <div className="mt-3 text-center">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="rounded shadow border"
                              style={{ maxHeight: "320px", maxWidth: "100%" }}
                              onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                                e.target.alt =
                                  "Link lỗi hoặc ảnh không tồn tại";
                              }}
                            />
                            <div className="mt-2">
                              <small className="text-muted">
                                Link hiện tại:
                              </small>
                              <br />
                              <code className="bg-light p-1 rounded">
                                {formData.image}
                              </code>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger mt-2"
                              onClick={() =>
                                setFormData({ ...formData, image: "" })
                              }
                            >
                              Xóa ảnh chính
                            </button>
                          </div>
                        )}
                      </div>

                      {/* GALLERY – CẢ DÁN NHIỀU LINK + UPLOAD NHIỀU ẢNH */}
                      <div className="col-12">
                        <label className="form-label fw-bold">
                          Gallery (
                          {formData.gallery
                            ? formData.gallery.split("\n").filter(Boolean)
                                .length
                            : 0}{" "}
                          ảnh)
                        </label>

                        {/* Dán nhiều link (mỗi link 1 dòng) */}
                        <textarea
                          className="form-control mb-3"
                          rows="4"
                          placeholder="Dán nhiều link ảnh, mỗi link 1 dòng...&#10;HOẶC dùng nút upload bên dưới"
                          value={formData.gallery || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gallery: e.target.value,
                            })
                          }
                        />

                        {/* Upload nhiều ảnh */}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="form-control mb-3"
                          onChange={handleUploadMultiple}
                        />

                        {/* Preview Gallery đẹp lung linh */}
                        {formData.gallery && (
                          <div className="row g-3">
                            {formData.gallery
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((url, i) => (
                                <div
                                  key={i}
                                  className="col-6 col-md-4 col-lg-3 position-relative"
                                >
                                  <img
                                    src={url}
                                    alt={`Gallery ${i + 1}`}
                                    className="img-fluid rounded shadow"
                                    style={{
                                      height: "180px",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) =>
                                      (e.target.src = "/placeholder.jpg")
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      padding: 0,
                                    }}
                                    onClick={() => {
                                      const lines = formData.gallery
                                        .split("\n")
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                                      lines.splice(i, 1);
                                      setFormData({
                                        ...formData,
                                        gallery: lines.join("\n"),
                                      });
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* MÔ TẢ */}
                      <div className="col-12">
                        <label className="form-label fw-bold">Mô tả ngắn</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={formData.shortDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">
                          Mô tả chi tiết (HTML)
                        </label>
                        <textarea
                          className="form-control"
                          rows="5"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* PHÂN LOẠI CHECKBOX */}
                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">
                          Loại sản phẩm
                        </label>
                        <div className="d-flex mx-3">
                          {popularTypes.map((t) => (
                            <div key={t} className="col-3 form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.types.includes(t)}
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    types: toggleArray(formData.types, t),
                                  })
                                }
                              />
                              <label className="form-check-label text-capitalize">
                                {t}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Màu sắc</label>
                        <div className="d-flex flex-wrap mx-3">
                          {popularColors.map((color, index) => (
                            <div key={index} className="col-3 form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.colors.includes(color)}
                                onChange={() =>
                                  setFormData({
                                    ...formData,
                                    colors: toggleArray(formData.colors, color),
                                  })
                                }
                              />
                              <label className="form-check-label text-capitalize">
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TAGS */}
                      <div className="col-12">
                        <label className="form-label fw-bold">
                          Tags (gõ rồi Enter)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="nước-giat, huu-co..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.target.value.trim();
                              if (val && !formData.tags.includes(val)) {
                                formData.tags.push(val);
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                        {/* <div className="mt-2">
                          {formData.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="badge bg-secondary me-2 mb-2"
                            >
                              {tag}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                onClick={() =>
                                  (formData.tags = formData.tags.filter(
                                    (_, j) => j !== i
                                  ))
                                }
                              ></button>
                            </span>
                          ))}
                        </div> */}
                      </div>

                      {/* CÁC TRƯỜNG KHÁC */}

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Còn hàng?</label>
                        <select
                          className="form-select"
                          value={formData.inStock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inStock: e.target.value,
                            })
                          }
                        >
                          <option value={true}>Có hàng</option>
                          <option value={false}>Hết hàng</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.falseSale}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                falseSale: e.target.checked,
                              })
                            }
                          />
                          <label className="form-check-label fw-bold text-danger">
                            Hiển thị Flash Sale giả
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-lg"
                      onClick={() => setModalOpen(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-success btn-lg">
                      {isEditing ? "CẬP NHẬT" : "THÊM MỚI"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminProducts;
