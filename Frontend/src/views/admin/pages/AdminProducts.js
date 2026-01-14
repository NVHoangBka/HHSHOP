// src/admin/pages/Products.jsx → FORM THÊM/SỬA SẢN PHẨM ĐỈNH CAO NHẤT 2025
import React, { useEffect, useState } from "react";
import tagController from "../../../controllers/TagController";
import { useTranslation } from "react-i18next";

const AdminProducts = ({ adminController }) => {
  const [t, i18n] = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang_admin") || "en";

  const [products, setProducts] = useState([]);
  const [tagsProduct, setTagsProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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
    name: { vi: "", en: "", cz: "" },
    price: "",
    discountPrice: "",
    image: "",
    gallery: "",
    shortDescription: "",
    description: { vi: "", en: "", cz: "" },
    category: "",
    subCategories: [],
    types: [],
    tags: [],
    brand: "",
    colors: [],
    titles: [],
    subTitles: [],
    inStock: true,
    flashSale: false,
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
        setTotalProducts(result.paginationData?.totalProducts || 0);
        setTotalPages(result.paginationData?.totalPages || 0);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      showToast(t("admin.products.toast.errorLoadingProducts"), "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchTagsProduct = async () => {
    try {
      const result = await tagController.getAllTags();
      if (result.success) {
        const tags = result.tags;
        const tagsProduct = tags.filter(
          (tag) => tag.type === "product" || tag.type === "both"
        );

        setTagsProduct(tagsProduct);
      }
    } catch (error) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await adminController.getCategoriesAllAdmin();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error("Lỗi load categories:", err);
    }
  };

  // Load lần đầu + khi search hoặc đổi trang
  useEffect(() => {
    setCurrentPage(1);
    loadProducts();
    fetchTagsProduct();
    fetchCategories();
  }, [searchTerm]);

  useEffect(() => {
    loadProducts();
    fetchTagsProduct();
    fetchCategories();
  }, [currentPage]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

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

      // 1. Lấy categoryId từ sản phẩm
      const catId = product.category?._id || product.category || "";

      // 2. Tìm danh sách subcategory tương ứng
      let subs = [];
      if (catId) {
        const selectedCat = categories.find((c) => c._id === catId);
        subs = selectedCat?.children || [];
      }

      // 3. Chuẩn hóa dữ liệu đa ngôn ngữ
      const normalizeLang = (obj) => {
        if (typeof obj === "string") return { vi: obj, en: "", cz: "" };
        if (!obj || typeof obj !== "object") return { vi: "", en: "", cz: "" };
        return {
          vi: obj.vi || "",
          en: obj.en || "",
          cz: obj.cz || "",
        };
      };

      // 4. Chuẩn hóa subCategories thành mảng ObjectId string
      let selectedSubIds = [];
      if (product.subCategories) {
        selectedSubIds = Array.isArray(product.subCategories)
          ? product.subCategories.map((s) => s?._id || s)
          : product.subCategories?._id
          ? [product.subCategories._id]
          : [];
      } else if (product.subCategory) {
        // Fallback nếu model cũ dùng subCategory single
        selectedSubIds = [
          product.subCategory?._id || product.subCategory,
        ].filter(Boolean);
      }

      setFormData({
        ...product,
        name: normalizeLang(product.name),
        description: normalizeLang(product.description),
        gallery: galleryString,
        category: catId,
        subCategories: selectedSubIds,
        inStock: product.inStock !== false,
        flashSale: !!product.flashSale,
        highlightSections: product.highlightSections?.length
          ? product.highlightSections
          : [{ title: "", content: "", icon: "bi-star-fill", order: 0 }],
      });

      setSubCategories(subs);
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: { vi: "", en: "", cz: "" },
        price: "",
        discountPrice: "",
        image: "",
        gallery: "",
        shortDescription: "",
        description: { vi: "", en: "", cz: "" },
        category: "",
        subCategories: [],
        types: [],
        tags: [],
        brand: "",
        colors: [],
        titles: [],
        subTitles: [],
        inStock: true,
        flashSale: false,
        highlightSections: [
          { title: "", content: "", icon: "bi-star-fill", order: 0 },
        ],
      });
      setSubCategories([]);
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

    const submitData = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : undefined,
      gallery: galleryArray,
      category: formData.category || undefined,
      subCategories:
        formData.subCategories.length > 0 ? formData.subCategories : undefined,
      types: formData.types,
      tags: formData.tags,
      colors: formData.colors,
      inStock: Boolean(formData.inStock),
      flashSale: Boolean(formData.flashSale),
    };

    try {
      let result;
      if (isEditing) {
        result = await adminController.updateProductAdmin(
          currentId,
          submitData
        );
      } else {
        result = await adminController.createProductAdmin(submitData);
      }

      if (result.success) {
        showToast(
          isEditing
            ? t("admin.products.toast.updateSuccess")
            : t("admin.products.toast.addSuccess"),
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
    if (!window.confirm(t("admin.products.toast.confirmDelete"))) return;
    try {
      const result = await adminController.deleteProductAdmin(id);
      if (result.success) {
        showToast(t("admin.products.toast.deleteSuccess"), "success");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast(t("admin.products.toast.deleteFailed"), "danger");
    }
  };

  const handleUploadSingle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await adminController.uploadSingle(file);
      setFormData({ ...formData, image: url });
      showToast(t("admin.products.toast.uploadSuccess"), "success");
    } catch (err) {
      showToast(t("admin.products.toast.uploadFailed"), "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMultiple = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setLoading(true);
    try {
      const urls = await adminController.uploadMultiple(files);

      const currentGallery = formData.gallery || "";
      const newGallery = currentGallery
        ? currentGallery + "\n" + urls.join("\n")
        : urls.join("\n");

      setFormData({ ...formData, gallery: newGallery });
      showToast(t("admin.products.toast.uploadSuccess"), "success");
    } catch (err) {
      showToast(t("admin.products.toast.uploadFailed"), "danger");
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

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  // Lọc chỉ theo tên sản phẩm (không phân biệt hoa thường)
  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return getTranslated(p.name, "").toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 fs-5">{t("admin.products.loading")}</p>
      </div>
    );
  }

  const translateText = async (text, lang) => {
    if (!text) return "";
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${lang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();
      return data?.[0]?.[0]?.[0] || text;
    } catch (err) {
      console.error("Dịch lỗi:", err);
      return text; // fallback
    }
  };

  const autoTranslateAll = async () => {
    if (!formData.name?.vi.trim()) {
      showToast("Vui lòng nhập tên tiếng Việt trước!", "warning");
      return;
    }

    showToast("Đang dịch tự động sang EN & CZ...", "info");

    const [nameEn, nameCz, descEn, descCz] = await Promise.all([
      translateText(formData.name.vi, "en"),
      translateText(formData.name.vi, "cs"),
      translateText(formData.description?.vi || "", "en"),
      translateText(formData.description?.vi || "", "cs"),
    ]);

    setFormData((prev) => ({
      ...prev,
      name: { ...prev.name, en: nameEn, cz: nameCz },
      description: { ...prev.description, en: descEn, cz: descCz },
    }));

    showToast("Đã dịch xong! Kiểm tra và chỉnh sửa nếu cần.", "success");
  };

  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setFormData({ ...formData, category: catId });
    // Tự động load subcategory
    const selected = categories.find((c) => c._id === catId);

    setSubCategories(selected?.children || []);
    setFormData((prev) => ({
      ...prev,
      subCategories: [],
    }));
  };

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
            <h2 className="fw-bold text-success text-uppercase">
              {t("admin.products.title")}
            </h2>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div
              className="me-3 position-relative border rounded-pill py-1 bg-white py-2"
              style={{ width: "300px" }}
            >
              <input
                type="text"
                className="input-group border-0 mx-1 px-3 fs-6 outline-0 no-focus"
                placeholder={t("admin.products.searchPlaceholder")}
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
              + {t("admin.products.addProduct")}
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
                    <th className="text-center">
                      {t("admin.products.table.stt")}
                    </th>
                    <th className="ps-4">{t("admin.products.table.image")}</th>
                    <th>{t("admin.products.table.info")}</th>
                    <th>{t("admin.products.table.price")}</th>
                    <th>{t("admin.products.table.stock")}</th>
                    <th className="text-center">
                      {t("admin.products.table.actions")}
                    </th>
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
                          ? t("admin.products.noResults")
                          : t("admin.products.noProducts")}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, index) => (
                      <tr key={p._id}>
                        <td className="fw-bold text-center">{index + 1}</td>
                        <td className="ps-4">
                          <img
                            src={p.image || "/placeholder.jpg"}
                            alt={getTranslated(p.name, "Chưa đặt tên")}
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
                            <b>{t("admin.products.table.name")}: </b>
                            {getTranslated(p.name, "Chưa đặt tên")}
                          </p>
                          <span className="">
                            <b>{t("admin.products.table.description")}: </b>
                            {getTranslated(p.description, "")}
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
                            {p.stock || 0} {t("admin.products.table.unit")}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => openModal(p)}
                          >
                            {t("btn.edit")}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p._id)}
                          >
                            {t("btn.delete")}
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
                    {isEditing
                      ? t("admin.products.editProduct")
                      : t("admin.products.addProduct")}
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
                        <div className="d-flex">
                          <div className="mb-4 col-xl-10">
                            <label className="form-label fw-bold text-danger">
                              {t("admin.products.form.name")} *
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              value={formData.name?.vi || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: {
                                    ...formData.name,
                                    vi: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary mb-4 ms-3 align-self-end"
                            onClick={autoTranslateAll}
                          >
                            {t("admin.products.form.autoTranslate")}
                          </button>
                        </div>
                      </div>

                      {/* Giá */}
                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.price")} (₫) *
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

                      {/**Giá khuyến mãi */}
                      <div className="col-md-4">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.priceSale")} (₫)
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
                          placeholder={t("admin.products.form.priceSaleHint")}
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.brand")}
                        </label>
                        <select
                          className="form-select"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                        >
                          <option value="">
                            {t("admin.products.form.selectBrand")}
                          </option>
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
                          {t("admin.products.form.image")} *
                        </label>

                        {/* Input dán link */}
                        <div className="input-group mb-2">
                          <input
                            type="url"
                            className="form-control"
                            placeholder={t(
                              "admin.products.form.imagePlaceholderLink"
                            )}
                            value={formData.image || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.value,
                              })
                            }
                          />
                          <span className="input-group-text">
                            {t("admin.products.form.or")}
                          </span>
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
                                e.target.alt = t(
                                  "admin.products.form.imageLoadError"
                                );
                              }}
                            />
                            <div className="mt-2">
                              <small className="text-muted">
                                {t("admin.products.form.imagePreview")}:
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
                              {t("admin.products.form.removeImage")}
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
                          {t("admin.products.form.countImage")})
                        </label>

                        {/* Dán nhiều link (mỗi link 1 dòng) */}
                        <textarea
                          className="form-control mb-3"
                          rows="4"
                          placeholder={t(
                            "admin.products.form.galleryPlaceholder"
                          )}
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
                        <label className="form-label fw-bold">
                          {t("admin.products.form.shortDescription")}
                        </label>
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
                          {t("admin.products.form.description")}
                        </label>
                        <textarea
                          className="form-control"
                          rows="5"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: {
                                ...formData.description,
                                vi: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      {/* DANH MỤC CHÍNH */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.category")} *
                        </label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={handleCategoryChange}
                          required
                        >
                          <option value="">
                            {t("admin.products.form.selectCategory")}
                          </option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {getTranslated(cat.name)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DANH MỤC CON - CHECKBOX */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.subCategory")}{" "}
                          {formData.subCategories?.length > 0 &&
                            `(${formData.subCategories.length} đã chọn)`}
                        </label>
                        {subCategories.length === 0 ? (
                          <div className="text-muted small fst-italic">
                            {formData.category
                              ? t("admin.products.form.noSubCategory")
                              : t("admin.products.form.selectCategoryFirst")}
                          </div>
                        ) : (
                          <div
                            className="border rounded p-3 bg-light"
                            style={{ maxHeight: "220px", overflowY: "auto" }}
                          >
                            {subCategories.map((sub) => (
                              <div key={sub._id} className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`subcat-${sub._id}`}
                                  checked={formData.subCategories.includes(
                                    sub._id
                                  )}
                                  onChange={(e) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      subCategories: e.target.checked
                                        ? [...prev.subCategories, sub._id]
                                        : prev.subCategories.filter(
                                            (id) => id !== sub._id
                                          ),
                                    }));
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`subcat-${sub._id}`}
                                >
                                  {getTranslated(sub.name)}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.color")}
                        </label>
                        <div className="d-flex flex-wrap px-3 py-2 rounded border align-items-center">
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
                      <div className="col-12 ">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.tags")}
                        </label>
                        <div className="d-flex flex-wrap px-3 py-2 rounded border align-items-center">
                          {tagsProduct.map((tag) => (
                            <div key={tag._id} className="col-3 form-check ">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.tags.includes(tag._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      tags: [...formData.tags, tag._id],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      tags: formData.tags.filter(
                                        (t) => t !== tag._id
                                      ),
                                    });
                                  }
                                }}
                              />
                              <span>{tag.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CÁC TRƯỜNG KHÁC */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          {t("admin.products.form.isStock")}
                        </label>
                        <select
                          className="form-select"
                          value={formData.inStock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inStock: e.target.value === "true",
                            })
                          }
                        >
                          <option value={true}>
                            {t("admin.products.form.inStock")}
                          </option>
                          <option value={false}>
                            {t("admin.products.form.outOfStock")}
                          </option>
                        </select>
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.flashSale}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                flashSale: e.target.checked,
                              })
                            }
                          />
                          <label className="form-check-label fw-bold text-danger">
                            {t("admin.products.form.flashSale")}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary fw-semibold"
                      onClick={() => setModalOpen(false)}
                    >
                      {t("btn.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success fw-semibold"
                    >
                      {isEditing ? t("btn.update") : t("btn.add")}
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
