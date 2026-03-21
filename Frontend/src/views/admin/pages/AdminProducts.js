// src/admin/pages/Products.jsx → FORM THÊM/SỬA SẢN PHẨM ĐỈNH CAO NHẤT 2025
import React, { useCallback, useEffect, useRef, useState } from "react";
import tagController from "../../../controllers/TagController";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/format";

const AdminProducts = ({ adminController }) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem("i18n_lang_admin") || "en";

  const [products, setProducts] = useState([]);
  const [tagsProduct, setTagsProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // TÌM KIẾM: CHỈ BẤM ENTER MỚI LỌC
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  const objectUrlsRef = useRef([]);

  const emptyProduct = {
    name: { vi: "", en: "", cz: "" },
    price: "",
    discountPrice: "",
    imageFile: null,
    image: "",
    gallery: "",
    galleryFiles: [],
    shortDescription: "",
    description: { vi: "", en: "", cz: "" },
    categories: [],
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
    variants: [],
  };

  const [formData, setFormData] = useState(emptyProduct);

  // ====================== LOAD DỮ LIỆU FILTER ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, typesRes, categoriesRes, colorsRes, brandsRes] =
          await Promise.all([
            tagController.getAllTags(),
            tagController.getAllTypes(),
            adminController.getCategoriesAllAdmin(),
            adminController.getColorsAllAdmin(),
            adminController.getBrandsAllAdmin(),
          ]);

        if (tagsRes.success) {
          const tagsProduct = tagsRes.tags.filter(
            (tag) => tag.type === "product" || tag.type === "both",
          );
          setTagsProduct(tagsProduct);
        }

        if (typesRes.success) {
          setTypes(typesRes.types);
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories || []);
        }
        if (colorsRes.success) {
          setColors(colorsRes.colors || []);
        }
        if (brandsRes.success) {
          setBrands(brandsRes.brands || []);
        }
      } catch (error) {
        console.error("Lỗi load dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // ====================== LOAD SẢN PHẨM ======================
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminController.getProductsAllAdmin({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
      });
      if (result.success) {
        setProducts(result.products || []);
        setTotalProducts(result.paginationData?.totalProducts || 0);
        setTotalPages(result.paginationData?.totalPages || 0);
      }
    } catch (err) {
      showToast(t("admin.products.toast.errorLoadingProducts"), "danger");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ====================== TOAST ======================
  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // ====================== PHÂN TRANG ======================
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // === LỌC KHI BẤM ENTER ===
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      setSearchTerm(searchInput.trim());
    }
    if (e.key === "Escape") {
      setSearchInput("");
      setSearchTerm("");
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // ====================== MODAL ======================
  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentId(product._id);

      // CHUYỂN ĐỔI GALLERY TỪ ARRAY → STRING (mỗi link 1 dòng)
      const galleryString = Array.isArray(product.gallery)
        ? product.gallery.join("\n")
        : product.gallery || "";

      // Chuẩn hóa dữ liệu đa ngôn ngữ
      const normalizeLang = (obj) => {
        if (typeof obj === "string") return { vi: obj, en: "", cz: "" };
        if (!obj || typeof obj !== "object") return { vi: "", en: "", cz: "" };
        return {
          vi: obj.vi || "",
          en: obj.en || "",
          cz: obj.cz || "",
        };
      };

      //Chuẩn hóa variants nếu có
      const normalizedVariants =
        product.variants?.map((v) => ({
          value: v.value || "",
          price: v.price || "",
          discountPrice: v.discountPrice || "",
          stock: v.stock || 0,
          image: v.image || "",
          sku: v.sku || "",
        })) || [];

      let selectedCategories = [];
      if (product.categories) {
        selectedCategories = Array.isArray(product.categories)
          ? product.categories.map((c) => c?._id || c).filter(Boolean)
          : [product.categories?._id || product.categories].filter(Boolean);
      } else if (product.category) {
        // Fallback nếu model cũ dùng single category
        selectedCategories = [product.category?._id || product.category].filter(
          Boolean,
        );
      }

      // Chuẩn hóa subCategories thành mảng ObjectId string
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

      // Chuẩn hóa colors thành mảng ID string
      let selectedColors = [];
      if (product.colors) {
        selectedColors = Array.isArray(product.colors)
          ? product.colors.map((c) => c?._id || c).filter(Boolean)
          : [product.colors?._id || product.colors].filter(Boolean);
      }

      setFormData({
        ...product,
        name: normalizeLang(product.name),
        description: normalizeLang(product.description),
        gallery: galleryString,
        categories: selectedCategories,
        subCategories: selectedSubIds,
        colors: selectedColors,
        types: product.types || [],
        brands: product.brands || [],
        tags: product.tags || [],
        inStock: product.inStock !== false,
        flashSale: !!product.flashSale,
        highlightSections: product.highlightSections?.length
          ? product.highlightSections
          : [{ title: "", content: "", icon: "bi-star-fill", order: 0 }],
        variants: normalizedVariants,
        imageFile: null,
        galleryFiles: [],
      });

      loadAllSubCategories(selectedCategories);
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData(emptyProduct);
      setSubCategories([]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    // Revoke tất cả object URLs khi đóng modal
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setModalOpen(false);
  };

  // Load tất cả subCategories từ mảng category IDs đã chọn
  const loadAllSubCategories = async (catIds) => {
    if (!catIds || catIds.length === 0) {
      setSubCategories([]);
      return;
    }

    try {
      const allSubs = [];
      for (const catId of catIds) {
        const res = await adminController.getSubCategoriesByCategory(catId);
        if (res.success) {
          allSubs.push(...(res.subCategories || []));
        }
      }

      const uniqueSubs = Array.from(
        new Map(allSubs.map((s) => [s._id, s])).values(),
      );
      setSubCategories(uniqueSubs);
    } catch (err) {
      console.error("Lỗi load subCategories:", err);
      setSubCategories([]);
    }
  };

  const toggleArray = (arr, value) => {
    return arr.includes(value)
      ? arr.filter((i) => i !== value)
      : [...arr, value];
  };

  // ====================== CRUD ======================
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

    const previewUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(previewUrl);
    setFormData((prev) => ({ ...prev, imageFile: file, image: previewUrl }));
  };

  const handleUploadMultiple = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((f) => {
      const url = URL.createObjectURL(f);
      objectUrlsRef.current.push(url);
      return url;
    });

    setFormData((prev) => ({
      ...prev,
      galleryFiles: [...prev.galleryFiles, ...files],
      gallery: prev.gallery
        ? prev.gallery + "\n" + newPreviews.join("\n")
        : newPreviews.join("\n"),
    }));
  };

  const handleUploadVariantImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(previewUrl);

    // Lưu cả file lẫn preview vào variant
    updateVariant(index, "imageFile", file); // file để upload sau
    updateVariant(index, "image", previewUrl); // preview để hiển thị
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = async (catId) => {
    setFormData((prev) => {
      const updated = toggleArray(prev.categories, catId);
      loadAllSubCategories(updated);
      return { ...prev, categories: updated, subCategories: [] };
    });
  };

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let mainImageUrl = formData.image;
    let galleryArray = formData.gallery
      ? formData.gallery
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    if (formData.imageFile) {
      mainImageUrl = await adminController.uploadSingle(formData.imageFile);
    }
    if (formData.galleryFiles.length > 0) {
      const newUrls = await adminController.uploadMultiple(
        formData.galleryFiles,
      );
      galleryArray = [...galleryArray, ...newUrls];
    }

    const variants = await Promise.all(
      (formData.variants || []).map(async (v) => {
        let imageUrl = v.image;

        if (v.imageFile) {
          // Chỉ upload lên server khi submit
          imageUrl = await adminController.uploadSingle(v.imageFile);
        }

        return {
          value: v.value,
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
          stock: Number(v.stock),
          image: imageUrl,
          sku: v.sku || "",
        };
      }),
    );

    const submitData = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : undefined,
      image: mainImageUrl,
      gallery: galleryArray,
      imageFile: undefined,
      galleryFiles: [],
      categories:
        formData.categories.length > 0 ? formData.categories : undefined,
      subCategories:
        formData.subCategories.length > 0 ? formData.subCategories : undefined,
      types: formData.types,
      tags: formData.tags,
      colors: formData.colors,
      inStock: Boolean(formData.inStock),
      flashSale: Boolean(formData.flashSale),
      variants,
    };

    try {
      const result = isEditing
        ? await adminController.updateProductAdmin(currentId, submitData)
        : await adminController.createProductAdmin(submitData);

      if (result.success) {
        showToast(
          isEditing
            ? t("admin.products.toast.updateSuccess")
            : t("admin.products.toast.addSuccess"),
          "success",
        );
        closeModal();
        // Reload danh sách
        loadProducts();
      }
    } catch (err) {
      showToast("Lỗi: " + (err.message || "Không thể lưu"), "danger");
    }
  };

  // ====================== DỊCH TỰ ĐỘNG ======================
  const translateText = async (text, lang) => {
    if (!text) return "";
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${lang}&dt=t&q=${encodeURIComponent(
          text,
        )}`,
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

      <div className="container-fluid py-3">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">
          <h5 className="fw-bold text-success text-uppercase mb-0">
            {t("admin.products.title")}
          </h5>

          <div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
            <div className="input-group flex-grow-1" style={{ maxWidth: 320 }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={t("admin.products.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchInput ? (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearSearch}
                >
                  <i className="bi bi-x" />
                </button>
              ) : (
                <span className="input-group-text">
                  <i className="bi bi-search" />
                </span>
              )}
            </div>

            {/* Add button */}
            <button
              className="btn btn-success shadow "
              onClick={() => openModal()}
            >
              + {t("admin.products.addProduct")}
            </button>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="card shadow border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle table-fixed">
                <thead className="table-primary">
                  <tr>
                    <th className="text-center">
                      {t("admin.products.table.stt")}
                    </th>
                    <th>{t("admin.products.table.image")}</th>
                    <th>{t("admin.products.table.info")}</th>
                    {/* Ẩn cột giá & tồn kho trên màn nhỏ */}
                    <th className="d-none d-md-table-cell">
                      {t("admin.products.table.price")}
                    </th>
                    <th className="d-none d-md-table-cell">
                      {t("admin.products.table.stock")}
                    </th>
                    <th className="text-center">
                      {t("admin.products.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        {searchTerm
                          ? t("admin.products.noResults")
                          : t("admin.products.noProducts")}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, index) => (
                      <tr key={p._id}>
                        <td className="fw-bold text-center ps-3">
                          {index + 1}
                        </td>
                        <td>
                          <img
                            src={p.image || "/placeholder.jpg"}
                            alt={getTranslated(p.name, "Chưa đặt tên")}
                            className="rounded"
                            style={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                            }}
                            onError={(e) => (e.target.src = "/placeholder.jpg")}
                          />
                        </td>
                        <td>
                          <p className="mb-0 fw-semibold small">
                            {getTranslated(p.name, "Chưa đặt tên")}
                          </p>
                          {/* Hiện giá + tồn kho ngay trong cột info trên mobile */}
                          <div className="d-md-none mt-1">
                            <span className="text-danger fw-bold small me-2">
                              {formatPrice(p.discountPrice || p.price)}
                            </span>
                            <span
                              className={`badge ${(p.totalStock || p.stock || 0) > 10 ? "bg-success" : (p.totalStock || p.stock || 0) > 0 ? "bg-warning" : "bg-danger"}`}
                            >
                              {p.totalStock || p.stock || 0}
                            </span>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          {p.variants?.length > 0 ? (
                            <>
                              <span className="text-danger fw-bold">
                                {formatPrice(p.price)}
                              </span>
                              <span className="badge bg-info text-dark ms-1 small">
                                {p.variants.length} loại
                              </span>
                            </>
                          ) : (
                            <>
                              {p.discountPrice && (
                                <del className="text-muted small d-block">
                                  {formatPrice(p.price)}
                                </del>
                              )}
                              <span className="text-danger fw-bold">
                                {formatPrice(p.discountPrice || p.price)}
                              </span>
                            </>
                          )}
                        </td>
                        <td className="d-none d-md-table-cell">
                          <span
                            className={`badge ${(p.totalStock || p.stock || 0) > 10 ? "bg-success" : (p.totalStock || p.stock || 0) > 0 ? "bg-warning text-dark" : "bg-danger"}`}
                          >
                            {p.totalStock || p.stock || 0}{" "}
                            {t("admin.products.table.unit")}
                          </span>
                        </td>
                        <td className="text-center text-nowrap">
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() => openModal(p)}
                          >
                            <i className="bi bi-pencil d-md-none" />
                            <span className="d-none d-md-inline">
                              {t("btn.edit")}
                            </span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p._id)}
                          >
                            <i className="bi bi-trash d-md-none" />
                            <span className="d-none d-md-inline">
                              {t("btn.delete")}
                            </span>
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
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination pagination-sm flex-wrap mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left" />
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* MODAL SIÊU ĐẸP – HIỆN GIỮA MÀN HÌNH */}
      {modalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={closeModal}></div>
          <div className="modal show d-block" style={{ overflowY: "auto" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-success text-white py-2">
                  <h6 className="modal-title fw-bold mb-0">
                    {isEditing
                      ? t("admin.products.editProduct")
                      : t("admin.products.addProduct")}
                  </h6>
                  <button
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body px-3 px-md-4">
                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-3" role="tablist">
                      <li className="nav-item">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#basic"
                          type="button"
                          role="tab"
                        >
                          Thông tin cơ bản
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#variants"
                          type="button"
                          role="tab"
                        >
                          Phân loại ({formData.variants?.length || 0})
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content">
                      {/* TAB THÔNG TIN CƠ BẢN */}
                      <div
                        className="tab-pane fade show active"
                        id="basic"
                        role="tabpanel"
                      >
                        <div className="row g-3">
                          {/* TÊN + GIÁ */}
                          <div className="col-12">
                            <label className="form-label fw-bold text-danger">
                              {t("admin.products.form.name")} *
                            </label>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control"
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
                              <button
                                type="button"
                                className="btn btn-primary btn-sm text-nowrap"
                                onClick={autoTranslateAll}
                              >
                                {t("admin.products.form.autoTranslate")}
                              </button>
                            </div>
                          </div>

                          {/* Giá + Giá KM + Thương hiệu */}
                          <div className="col-6 col-md-4">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.price")} (₫) *
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/**Giá khuyến mãi */}
                          <div className="col-6 col-md-4">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.priceSale")} (₫)
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={formData.discountPrice}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  discountPrice: e.target.value,
                                })
                              }
                              placeholder={t(
                                "admin.products.form.priceSaleHint",
                              )}
                            />
                          </div>

                          {/* Thương hiệu*/}
                          <div className="col-12 col-md-4">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.brand")}
                            </label>
                            <select
                              className="form-select form-select-sm"
                              value={formData.brand}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  brand: e.target.value,
                                })
                              }
                            >
                              <option value="">
                                {t("admin.products.form.selectBrand")}
                              </option>
                              {brands.map((b) => (
                                <option key={b._id} value={b.slug}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* ẢNH CHÍNH */}
                          <div className="col-12">
                            <label className="form-label fw-bold text-danger small">
                              {t("admin.products.form.image")} *
                            </label>

                            {/* Input dán link */}
                            <div className="input-group input-group-sm mb-2">
                              <input
                                type="url"
                                className="form-control"
                                placeholder={t(
                                  "admin.products.form.imagePlaceholderLink",
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
                              className="form-control form-control-sm"
                              onChange={handleUploadSingle}
                            />

                            {/* Preview ảnh chính */}
                            {formData.image && (
                              <div className="mt-2 text-center">
                                <img
                                  src={formData.image}
                                  alt="Preview"
                                  className="rounded shadow border"
                                  style={{ maxHeight: 200, maxWidth: "100%" }}
                                  onError={(e) =>
                                    (e.target.src = "/placeholder.jpg")
                                  }
                                />
                                <div className="mt-1">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        image: "",
                                        imageFile: null,
                                      })
                                    }
                                  >
                                    {t("admin.products.form.removeImage")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* GALLERY – CẢ DÁN NHIỀU LINK + UPLOAD NHIỀU ẢNH */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              Gallery (
                              {formData.gallery
                                ? formData.gallery.split("\n").filter(Boolean)
                                    .length
                                : 0}{" "}
                              {t("admin.products.form.countImage")})
                            </label>

                            {/* Dán nhiều link (mỗi link 1 dòng) */}
                            <textarea
                              className="form-control form-control-sm mb-2"
                              rows="3"
                              placeholder={t(
                                "admin.products.form.galleryPlaceholder",
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
                              className="form-control form-control-sm mb-2"
                              onChange={handleUploadMultiple}
                            />

                            {/* Preview Gallery đẹp lung linh */}
                            {formData.gallery && (
                              <div className="row g-2">
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
                                          height: 140,
                                          width: "100%",
                                          objectFit: "cover",
                                        }}
                                        onError={(e) =>
                                          (e.target.src = "/placeholder.jpg")
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          width: 26,
                                          height: 26,
                                          padding: 0,
                                          fontSize: 14,
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

                          {/* Mô tả ngắn */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.shortDescription")}
                            </label>
                            <textarea
                              className="form-control form-control-sm"
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

                          {/* Mô tả đầy đủ */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.description")}
                            </label>
                            <textarea
                              className="form-control form-control-sm"
                              rows="4"
                              value={formData.description?.vi || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  description: {
                                    ...prev.description,
                                    vi: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>

                          {/* DANH MỤC CHÍNH */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.category")} *
                            </label>
                            {categories.length === 0 ? (
                              <p className="text-muted small fst-italic">
                                {t("admin.products.form.noCategory")}
                              </p>
                            ) : (
                              <div
                                className="border rounded p-2 bg-light"
                                style={{ maxHeight: 200, overflowY: "auto" }}
                              >
                                {categories.map((cat) => (
                                  <div
                                    key={cat._id}
                                    className="form-check mb-1"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`cat-${cat._id}`}
                                      checked={formData.categories.includes(
                                        cat._id,
                                      )}
                                      onChange={() =>
                                        handleCategoryChange(cat._id)
                                      }
                                    />
                                    <label
                                      className="form-check-label small"
                                      htmlFor={`cat-${cat._id}`}
                                    >
                                      {getTranslated(cat.name)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* DANH MỤC CON - CHECKBOX */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.subCategory")}
                              {formData.subCategories?.length > 0 &&
                                ` (${formData.subCategories.length} đã chọn)`}
                            </label>
                            {subCategories.length === 0 ? (
                              <p className="text-muted small fst-italic">
                                {formData.categories.length
                                  ? t("admin.products.form.noSubCategory")
                                  : t(
                                      "admin.products.form.selectCategoryFirst",
                                    )}
                              </p>
                            ) : (
                              <div
                                className="border rounded p-2 bg-light"
                                style={{ maxHeight: 200, overflowY: "auto" }}
                              >
                                {subCategories.map((sub) => (
                                  <div
                                    key={sub._id}
                                    className="form-check mb-1"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`subcat-${sub._id}`}
                                      checked={formData.subCategories.includes(
                                        sub._id,
                                      )}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          subCategories: e.target.checked
                                            ? [...prev.subCategories, sub._id]
                                            : prev.subCategories.filter(
                                                (id) => id !== sub._id,
                                              ),
                                        }))
                                      }
                                    />
                                    <label
                                      className="form-check-label small"
                                      htmlFor={`subcat-${sub._id}`}
                                    >
                                      {getTranslated(sub.name)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* MÀU SẮC */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.color")}
                            </label>
                            <div className="border rounded p-2">
                              {colors.length === 0 ? (
                                <span className="text-muted small fst-italic">
                                  Đang tải danh sách màu...
                                </span>
                              ) : (
                                <div className="row g-1">
                                  {colors.map((color) => (
                                    <div
                                      key={color._id}
                                      className="col-6 col-sm-4 col-md-3 form-check ps-4"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`color-${color._id}`}
                                        checked={formData.colors.includes(
                                          color._id,
                                        )}
                                        onChange={() =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            colors: toggleArray(
                                              prev.colors,
                                              color._id,
                                            ),
                                          }))
                                        }
                                      />
                                      <label
                                        className="form-check-label small text-capitalize"
                                        htmlFor={`color-${color._id}`}
                                      >
                                        {getTranslated(color.name)}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* TAGS */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.tags")}
                            </label>
                            <div className="border rounded p-2">
                              <div className="row g-1">
                                {tagsProduct.map((tag) => (
                                  <div
                                    key={tag._id}
                                    className="col-6 col-sm-4 col-md-3 form-check ps-4"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={formData.tags.includes(tag._id)}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          tags: e.target.checked
                                            ? [...formData.tags, tag._id]
                                            : formData.tags.filter(
                                                (id) => id !== tag._id,
                                              ),
                                        })
                                      }
                                    />
                                    <span className="form-check-label small">
                                      {tag.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* TYPES */}
                          <div className="col-12">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.type")}
                            </label>
                            <div className="border rounded p-2">
                              <div className="row g-1">
                                {types.map((type) => (
                                  <div
                                    key={type._id}
                                    className="col-6 col-sm-4 col-md-3 form-check ps-4"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={formData.types.includes(
                                        type._id,
                                      )}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          types: e.target.checked
                                            ? [...formData.types, type._id]
                                            : formData.types.filter(
                                                (id) => id !== type._id,
                                              ),
                                        })
                                      }
                                    />
                                    <span className="form-check-label small">
                                      {getTranslated(type.name)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Tình trạng + Flash sale */}
                          <div className="col-12 col-sm-6">
                            <label className="form-label fw-bold small">
                              {t("admin.products.form.isStock")}
                            </label>
                            <select
                              className="form-select form-select-sm"
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

                          <div className="col-12 col-sm-6 d-flex align-items-end">
                            <div className="form-check form-switch mb-1">
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
                              <label className="form-check-label fw-bold text-danger small">
                                {t("admin.products.form.flashSale")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TAB VARIANT */}
                      <div
                        className="tab-pane fade"
                        id="variants"
                        role="tabpanel"
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm mb-3"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              variants: [
                                ...(prev.variants || []),
                                {
                                  value: "",
                                  price: "",
                                  discountPrice: "",
                                  image: "",
                                  imageFile: null,
                                  stock: 0,
                                  sku: "",
                                },
                              ],
                            }))
                          }
                        >
                          + {t("admin.products.form.addClassification")}
                        </button>

                        {formData.variants?.map((variant, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 mb-3 bg-light"
                          >
                            <div className="row g-2">
                              <div className="col-12 col-sm-6 col-md-3">
                                <label className="form-label small mb-1">
                                  {t("admin.products.form.nameClassification")}
                                </label>
                                <input
                                  className="form-control form-control-sm"
                                  value={variant.value || ""}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "value",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-6 col-md-2">
                                <label className="form-label small mb-1">
                                  {t("admin.products.form.price")}
                                </label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={variant.price}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "price",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-6 col-md-2">
                                <label className="form-label small mb-1">
                                  {t("admin.products.form.priceSale")}
                                </label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={variant.discountPrice}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "discountPrice",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-6 col-md-2">
                                <label className="form-label small mb-1">
                                  {t("admin.products.table.stock")}
                                </label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={variant.stock}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "stock",
                                      Number(e.target.value),
                                    )
                                  }
                                />
                              </div>

                              <div className="col-12 col-sm-6 col-md-2">
                                <label className="form-label small mb-1">
                                  {t("admin.products.form.image")}
                                </label>
                                <input
                                  type="file"
                                  className="form-control form-control-sm"
                                  onChange={(e) =>
                                    handleUploadVariantImage(e, index)
                                  }
                                />
                              </div>

                              <div className="col-6 col-md-1 d-flex align-items-end">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm w-100"
                                  onClick={() => removeVariant(index)}
                                >
                                  <i className="bi bi-trash" />
                                </button>
                              </div>
                            </div>
                            {variant.image && (
                              <img
                                src={variant.image}
                                className="mt-2 rounded"
                                style={{ maxHeight: 80 }}
                                alt=""
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer py-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setModalOpen(false)}
                    >
                      {t("btn.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-1" />
                      ) : null}
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
