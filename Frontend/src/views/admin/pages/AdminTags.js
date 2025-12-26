// src/admin/pages/AdminTags.jsx
import React, { useEffect, useState } from "react";

const AdminTags = ({ adminController }) => {
  const [tags, setTags] = useState([]);
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
  const [totalTags, setTotalTags] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10); // backend mặc định 10

  const [formData, setFormData] = useState({
    name: "",
    type: "both",
    description: "",
    isActive: true,
  });

  const pagination = {
    page: currentPage,
    limit,
    search: searchTerm || undefined,
  };

  const fetchTags = async () => {
    try {
      setLoading(true);
      const result = await adminController.getTagsAllAdmin(pagination);
      if (result.success) {
        setTags(result.tags || []);
        setTotalTags(result.paginationData.totalTags);
        setTotalPages(result.paginationData.totalPages);
        setCurrentPage(currentPage);
      }
    } catch (err) {
      showToast("Lỗi tải tags", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu + khi search hoặc đổi trang
  useEffect(() => {
    setCurrentPage(1);
    fetchTags();
  }, [searchTerm]);

  useEffect(() => {
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
        name: item.name,
        type: item.type,
        description: item.description,
        isActive: item.isActive,
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: "",
        type: "both",
        description: "",
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, description, isActive } = formData;

    const tagData = {
      name,
      type,
      description,
      isActive,
    };

    try {
      const result = isEditing
        ? await adminController.updateTagAdmin(currentId, tagData)
        : await adminController.createTagAdmin(tagData);
      if (result.success) {
        showToast(
          isEditing ? "Cập nhật thành công!" : "Thêm tags thành công!",
          "success"
        );
        setModalOpen(false);
        fetchTags();
      }
    } catch (err) {
      showToast("Lỗi: " + (err.message || "Không thể lưu"), "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này? Không thể khôi phục!")) return;
    try {
      const result = await adminController.deleteTagAdmin(id);
      if (result.success) {
        showToast("Xóa thành công!", "success");
        setTags((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast("Xóa thất bại", "danger");
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

  // Lọc chỉ theo tên tagss (không phân biệt hoa thường)
  const filteredTags = tags.filter(
    (tag) =>
      searchTerm === "" ||
      tag.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTagType = (type) => {
    switch (type) {
      case "article":
        return "Chỉ bài viết";
      case "product":
        return "Chỉ sản phẩm";
      default:
        return "Cả sản phẩm & bài viết";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="tag-admin">
        <div className="new-admin_header d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-uppercase text-success">
              Quản lý Tags
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
                placeholder="Tìm tag..."
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
              + Thêm tag mới
            </button>
          </div>
        </div>
        {/* Table */}
        {loading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : (
          <div className="bg-white border-0">
            <table className="table table-hover mb-0 align-middle table-bordered">
              <thead className="table-primary text-white text-center">
                <tr className="align-middle">
                  <th>STT</th>
                  <th>Tên Tag</th>
                  <th>Loại tag</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTags.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5 text-muted fs-4"
                    >
                      {searchTerm
                        ? "Không tìm thấy tags nào"
                        : "Chưa có tags nào"}
                    </td>
                  </tr>
                ) : (
                  filteredTags.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{renderTagType(item.type)}</td>
                      <td className="col-6">{item.description}</td>

                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive ? "Hiển thị" : "Chưa"}
                        </span>
                      </td>
                      <td className=" text-center col-1">
                        <button
                          onClick={() => openModal(item)}
                          className="btn btn-sm btn-success me-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Xóa
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
                        Tên tag *
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

                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">Mô tả ngắn *</label>
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
                        Loại tag *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-100 border rounded px-3 py-2 mb-3"
                      >
                        <option value="both">Cả bài viết & sản phẩm</option>
                        <option value="article">Chỉ bài viết</option>
                        <option value="product">Chỉ sản phẩm</option>
                      </select>
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
                          Hiển thị
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
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-success me-4">
                      {isEditing ? "Cập nhật" : "Tạo bài viết"}
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

export default AdminTags;
