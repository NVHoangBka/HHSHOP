// src/admin/pages/AdminNews.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AdminNews = ({ adminController }) => {
  const [t, i18n] = useTranslation();
  const [news, setNews] = useState([]);
  const [tagsNew, setTagsNew] = useState([]);
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
  const [totalNews, setTotalNews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10); // backend mặc định 10

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    thumbnailAlt: "",
    tags: [],
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });

  const pagination = {
    page: currentPage,
    limit,
    search: searchTerm || undefined,
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const result = await adminController.getNewsAllAdmin(pagination);
      if (result.success) {
        setNews(result.news || []);
        setTotalNews(result.paginationData.totalNews);
        setTotalPages(result.paginationData.totalPages);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      showToast("Lỗi tải tin tức", "danger");
    } finally {
      setLoading(false);
    }
  };
  // Load tags
  const fetchTags = async () => {
    try {
      const result = await adminController.getTagsAllAdmin(pagination);
      if (result.success) {
        const tags = result.tags;
        const tagsNew = tags.filter(
          (tag) => tag.type === "article" || tag.type === "both"
        );
        setTagsNew(tagsNew || []);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load lần đầu + khi search hoặc đổi trang
  useEffect(() => {
    setCurrentPage(1);
    fetchNews();
    fetchTags();
  }, [searchTerm]);

  useEffect(() => {
    fetchNews();
    fetchTags();
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
        title: item.title,
        description: item.description || "",
        content: item.content || "",
        thumbnail: item.thumbnail || "",
        thumbnailAlt: item.thumbnailAlt || "",
        tags: item.tags?.map((t) => t._id || t) || [],
        isPublished: item.isPublished,
        metaTitle: item.metaTitle || "",
        metaDescription: item.metaDescription || "",
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        thumbnail: "",
        thumbnailAlt: "",
        tags: [],
        isPublished: true,
        metaTitle: "",
        metaDescription: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      description,
      content,
      thumbnail,
      thumbnailAlt,
      tags,
      isPublished,
      metaTitle,
      metaDescription,
    } = formData;

    const newData = {
      title,
      description,
      content,
      thumbnail,
      thumbnailAlt: thumbnailAlt || title,
      tags,
      isPublished,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description,
    };

    try {
      const result = isEditing
        ? await adminController.updateNewAdmin(currentId, newData)
        : await adminController.createNewAdmin(newData);

      if (result.success) {
        showToast(
          isEditing
            ? t("admin.news.toast.updateSuccess")
            : t("admin.news.toast.createSuccess"),
          "success"
        );
        setModalOpen(false);
        fetchNews();
      }
    } catch (err) {
      showToast("Lỗi: " + (err.message || "Không thể lưu"), "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.news.toast.confirmDelete"))) return;
    try {
      const result = await adminController.deleteNewAdmin(id);
      if (result.success) {
        showToast(t("admin.news.toast.deleteSuccess"), "success");
        setNews((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast(t("admin.news.toast.deleteFailed"), "danger");
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

  // Lọc chỉ theo tên tin tức (không phân biệt hoa thường)
  const filteredNews = news.filter(
    (newpaper) =>
      searchTerm === "" ||
      newpaper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="new-admin py-4">
        <div className="new-admin_header d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-uppercase text-success">
              {t("admin.news.title")}
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
                placeholder={t("admin.news.searchPlaceholder")}
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
              + {t("admin.news.addNews")}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10">{t("admin.news.loading")}</div>
        ) : (
          <div className="bg-white border-0">
            <table className="table table-hover mb-0 align-middle table-bordered">
              <thead className="table-primary text-white text-center">
                <tr className="align-middle">
                  <th>{t("admin.news.table.stt")}</th>
                  <th>{t("admin.news.table.image")}</th>
                  <th>{t("admin.news.table.info")}</th>
                  <th>{t("admin.news.table.tags")}</th>
                  <th>{t("admin.news.table.publishedAt")}</th>
                  <th>{t("admin.news.table.status")}</th>
                  <th>{t("admin.news.table.views")}</th>
                  <th>{t("admin.news.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-muted fs-4"
                    >
                      {searchTerm
                        ? t("admin.news.noResults")
                        : t("admin.news.noNews")}
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td style={{ width: "200px" }}>
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="object-cover rounded w-100"
                        />
                      </td>
                      <td className="col-6">
                        <div className="font-medium text-gray-900">
                          <b>{t("admin.news.table.title")}: </b>
                          {item.title}
                          <br />
                          <b>{t("admin.news.table.description")}: </b>
                          {item.description}
                        </div>
                      </td>
                      <td className="col-1">
                        <div className="d-flex flex-wrap gap-1">
                          {item.tags?.map((tag) => (
                            <p
                              key={tag._id}
                              className="fw-semibold px-2 py-1 rounded m-0"
                            >
                              {tag.name}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="fs-7">
                        {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="fs-7">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isPublished
                            ? t("admin.news.status.published")
                            : t("admin.news.status.draft")}
                        </span>
                      </td>
                      <td className=" text-center fs-7">{item.views}</td>
                      <td className=" text-center col-1">
                        <button
                          onClick={() => openModal(item)}
                          className="btn btn-sm btn-success me-2"
                        >
                          {t("admin.news.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-danger"
                        >
                          {t("admin.news.delete")}
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
      {/* Modal Form */}
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
                    {isEditing ? "Sửa bài viết" : "Thêm bài viết mới"}
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
                        {t("admin.news.form.title")} *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-2 col-12">
                      <label className="form-label fw-bold text-danger">
                        {t("admin.news.form.thumbnailURL")} *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.thumbnail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnail: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">
                        {t("admin.news.form.shortDescription")} *
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
                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">
                        {t("admin.news.form.content")} *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            content: e.target.value,
                          })
                        }
                        className="form-control"
                      ></textarea>
                    </div>
                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">
                        {t("admin.news.form.tags")}
                      </label>
                      <div className="row border rounded p-2 d-flex row-cols-lg-5 g-2">
                        {tagsNew.map((tag) => (
                          <label
                            key={tag._id}
                            className="d-flex align-items-center gap-2"
                          >
                            <input
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
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isPublished: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label fw-bold text-danger">
                          {t("admin.news.status.published")}
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
                      {isEditing
                        ? t("admin.news.updateButton")
                        : t("admin.news.saveButton")}
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

export default AdminNews;
