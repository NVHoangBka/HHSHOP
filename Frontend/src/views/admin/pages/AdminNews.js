// src/admin/pages/AdminNews.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // TÌM KIẾM: CHỈ BẤM ENTER MỚI LỌC
  const [searchInput, setSearchInput] = useState(""); // ô nhập liệu
  const [searchTerm, setSearchTerm] = useState(""); // từ khoá tìm kiếm chính thức

  // Form tạo/sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
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

  // Load danh sách tin tức
  const fetchNews = async () => {
    try {
      const res = await fetch(`/api/admin/news?page=${page}&search=${search}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNews(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Load tags
  const fetchTags = async () => {
    try {
      const res = await fetch("/api/admin/tags", { credentials: "include" });
      const data = await res.json();
      if (data.success) setTags(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchTags();
  }, [page, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingNews
      ? `/api/admin/news/${editingNews._id}`
      : "/api/admin/news";
    const method = editingNews ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        resetForm();
        fetchNews();
      } else {
      }
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        fetchNews();
      }
    } catch (err) {}
  };

  const openEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      thumbnail: item.thumbnail,
      thumbnailAlt: item.thumbnailAlt || "",
      tags: item.tags.map((t) => t._id || t),
      isPublished: item.isPublished,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      publishedAt: new Date(item.publishedAt).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingNews(null);
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
  };

  const openModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentId(item._id);

      setFormData({ ...item, gallery: galleryString });
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
        flashSale: false,
        highlightSections: [
          { title: "", content: "", icon: "bi-star-fill", order: 0 },
        ],
      });
    }
    setModalOpen(true);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Tin tức</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Thêm bài viết
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
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
                    {format(new Date(item.publishedAt), "dd/MM/yyyy", {
                      locale: vi,
                    })}
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
                      onClick={() => openEdit(item)}
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

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <div>
              Trang {page} / {totalPages}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingNews ? "Sửa bài viết" : "Thêm bài viết mới"}
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
                    {tags.map((tag) => (
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
                    ))}
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingNews ? "Cập nhật" : "Tạo bài viết"}
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
