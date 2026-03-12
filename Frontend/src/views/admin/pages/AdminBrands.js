// src/admin/pages/AdminBrands.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminBrands = ({ adminController }) => {
  const [t] = useTranslation();
  const [brands, setBrands] = useState([]);
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
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10); // backend mặc định 10

  const [formData, setFormData] = useState({
    name: "",
    logoFile: null,
    logo: "",
    description: "",
    isActive: true,
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  const pagination = {
    page: currentPage,
    limit,
    search: searchTerm || undefined,
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const result = await adminController.getBrandsAllAdmin(pagination);
      if (result.success) {
        setBrands(result.brands || []);
        setTotalBrands(result.paginationData.totalBrands);
        setTotalPages(result.paginationData.totalPages);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      showToast("Lỗi tải brands", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu + khi search hoặc đổi trang
  useEffect(() => {
    setCurrentPage(1);
    fetchBrands();
  }, [searchTerm]);

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentId(item._id);
      setFormData({
        name: item.name,
        logo: item.logo,
        logoFile: null,
        description: item.description,
        isActive: item.isActive,
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: "",
        logo: "",
        logoFile: null,
        description: "",
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Vui lòng chọn file ảnh (jpg, png, webp...)", "danger");
        return;
      }
      setFormData({ ...formData, logoFile: file });
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Tên thương hiệu là bắt buộc", "danger");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("description", formData.description.trim());
    data.append("isActive", formData.isActive);

    if (formData.logoFile) {
      data.append("logo", formData.logoFile);
    }

    try {
      const result = isEditing
        ? await adminController.updateBrandAdmin(currentId, data)
        : await adminController.createBrandAdmin(data);

      if (result.success) {
        showToast(
          isEditing
            ? t("admin.brands.toast.updateSuccess")
            : t("admin.brands.toast.addSuccess"),
          "success",
        );
        setModalOpen(false);
        setPreviewLogo(null);
        fetchBrands();
      } else {
        showToast(result.message || "Lưu thất bại", "danger");
      }
    } catch (err) {
      showToast(
        "Lỗi: " + (err.message || "Không thể lưu thương hiệu"),
        "danger",
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.brands.toast.confirmDelete"))) return;
    try {
      const result = await adminController.deleteBrandAdmin(id);
      if (result.success) {
        showToast(t("admin.brands.toast.deleteSuccess"), "success");
        setBrands((prev) => prev.filter((b) => b._id !== id));
      } else {
        showToast(result.message || "Xóa thất bại", "danger");
      }
    } catch (err) {
      showToast(t("admin.brands.toast.deleteFailed"), "danger");
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

  // Lọc chỉ theo tên brandss (không phân biệt hoa thường)
  const filteredBrands = brands.filter(
    (brand) =>
      searchTerm === "" ||
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="brand-admin">
        <div className="new-admin_header d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-uppercase text-success">
              {t("admin.brands.title")}
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
                placeholder={t("admin.brands.searchPlaceholder")}
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
              + {t("admin.brands.addBrand")}
            </button>
          </div>
        </div>
        {/* Table */}
        {loading ? (
          <div className="text-center py-10">{t("admin.brands.loading")}</div>
        ) : (
          <div className="bg-white border-0">
            <table className="table table-hover mb-0 align-middle table-bordered">
              <thead className="table-primary text-white text-center">
                <tr className="align-middle">
                  <th>{t("admin.brands.table.stt")}</th>
                  <th>{t("admin.brands.table.logo")}</th>
                  <th>{t("admin.brands.table.name")}</th>
                  <th>{t("admin.brands.table.description")}</th>
                  <th>{t("admin.brands.table.status")}</th>
                  <th>{t("admin.brands.table.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBrands.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-muted fs-4"
                    >
                      {searchTerm
                        ? t("admin.brands.noResults")
                        : t("admin.brands.noBrands")}
                    </td>
                  </tr>
                ) : (
                  filteredBrands.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td className="text-center">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.name}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "contain",
                              borderRadius: "6px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80?text=No+Logo";
                              e.target.alt = "Logo lỗi";
                            }}
                          />
                        ) : (
                          <span className="text-muted">Empty logo</span>
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td className="col-6">{item.description}</td>

                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive
                            ? t("admin.brands.status.active")
                            : t("admin.brands.status.inactive")}
                        </span>
                      </td>
                      <td className=" text-center col-1">
                        <button
                          onClick={() => openModal(item)}
                          className="btn btn-sm btn-success me-2"
                        >
                          {t("btn.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-danger"
                        >
                          {t("btn.delete")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
        )}
      </div>

      {/* Modal */}
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
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">
                    {isEditing
                      ? t("admin.brands.editBrand")
                      : t("admin.brands.addBrand")}
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
                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold text-danger">
                        {t("admin.brands.form.name")} *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label fw-bold text-danger">
                        {t("admin.brands.form.logo")} *
                      </label>
                      {previewLogo && (
                        <div className="text-center mb-3 p-2 border rounded bg-light">
                          <img
                            src={previewLogo}
                            alt="Preview logo"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "150px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleLogoChange}
                        // required={!isEditing}
                      />
                    </div>

                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">
                        {t("admin.brands.form.description")} *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="form-control"
                      ></textarea>
                    </div>
                    <div className="mb-2 col-12">
                      <label className="form-label fw-bold text-danger">
                        {t("admin.brands.form.logo")} *
                      </label>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label fw-bold text-danger">
                          {t("admin.brands.status.active")}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end py-2 bg-secondary-subtle">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="btn-dark btn me-3"
                    >
                      {t("btn.cancel")}
                    </button>
                    <button type="submit" className="btn btn-success me-4">
                      {isEditing ? t("btn.update") : t("btn.add")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBrands;
