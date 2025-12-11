// src/admin/pages/AdminNews.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminNews = ({ adminController }) => {
  const [news, setNews] = useState([]);
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
    isPublished: true,
    metaTitle: "",
    metaDescription: "",
    publishedAt: new Date().toISOString().slice(0, 16),
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
      const res = await fetch("/api/admin/tags", { credentials: "include" });
      const data = await res.json();
      // if (data.success) setTags(data.data);
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
    fetchNews(currentPage);
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

  const openModal = (newpaper = null) => {
    if (newpaper) {
      setIsEditing(true);
      setCurrentId(newpaper._id);
      setFormData({ ...newpaper });
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
        publishedAt: new Date().toISOString().slice(0, 16),
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
    };

    try {
      let result;
      if (isEditing) {
        result = await adminController.updateNewAdmin(currentId, data);
      } else {
        result = await adminController.createNewAdmin(data);
      }

      if (result.success) {
        showToast(
          isEditing ? "Cập nhật thành công!" : "Thêm tin tức thành công!",
          "success"
        );
        setModalOpen(false);
        // Reload danh sách

        fetchNews();
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
      const result = await adminController.deleteNewAdmin(id);
      if (result.success) {
        showToast("Xóa thành công!", "success");
        setNews((prev) => prev.filter((p) => p._id !== id));
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

  // Lọc chỉ theo tên sản phẩm (không phân biệt hoa thường)
  const filteredNews = news.filter(
    (newpaper) =>
      searchTerm === "" ||
      newpaper.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="new-admin py-4">
      <div className="new-admin_header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-success">
            Quản lý Tin Tức
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
              placeholder="Tìm tin tức..."
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
            + Thêm tin tức mới
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-100 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Tags</th>
                <th className="px-4 py-3">Ngày đăng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Lượt xem</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">/{item.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag._id}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(item.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.isPublished ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{item.views}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Sửa bài viết" : "Thêm bài viết mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thumbnail URL *
                  </label>
                  <input
                    required
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Mô tả ngắn *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Nội dung bài viết *
                  </label>
                  <textarea
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 font-mono text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                    {/* {tags.map((tag) => (
                      <label key={tag._id} className="flex items-center gap-2">
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
                    ))} */}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                    <span>Đã đăng</span>
                  </label>
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">
                      Ngày đăng
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedAt: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditing ? "Cập nhật" : "Tạo bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
