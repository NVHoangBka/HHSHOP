// src/admin/pages/AdminTags.jsx
import React, { useEffect, useState } from "react";

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "both",
    description: "",
    isActive: true,
  });

  const fetchTags = async () => {
    const res = await fetch("/api/admin/tags", { credentials: "include" });
    const data = await res.json();
    if (data.success) setTags(data.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTag
      ? `/api/admin/tags/${editingTag._id}`
      : "/api/admin/tags";
    const method = editingTag ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const result = await res.json();

    if (result.success) {
      setIsModalOpen(false);
      setEditingTag(null);
      setForm({ name: "", type: "both", description: "", isActive: true });
      fetchTags();
    } else {
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa tag này?")) return;
    const res = await fetch(`/api/admin/tags/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await res.json();
    if (result.success) {
      fetchTags();
    } else {
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Tag</h1>
        <button
          onClick={() => {
            setEditingTag(null);
            setForm({
              name: "",
              type: "both",
              description: "",
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          + Thêm Tag
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className={`p-4 rounded-lg border ${
              tag.isActive ? "bg-white" : "bg-gray-100 opacity-75"
            }`}
          >
            <h3 className="font-bold text-lg">{tag.name}</h3>
            <p className="text-sm text-gray-600">/{tag.slug}</p>
            <div className="text-xs text-gray-500 mt-2">
              <div>
                Bài viết: {tag.newCount} | Sản phẩm: {tag.productCount}
              </div>
              <div>Tổng: {tag.totalCount}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setEditingTag(tag);
                  setForm({
                    name: tag.name,
                    type: tag.type,
                    description: tag.description || "",
                    isActive: tag.isActive,
                  });
                  setIsModalOpen(true);
                }}
                className="text-blue-600 text-sm"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(tag._id)}
                className="text-red-600 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingTag ? "Sửa Tag" : "Thêm Tag mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                required
                placeholder="Tên tag"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-3"
              >
                <option value="both">Cả bài viết & sản phẩm</option>
                <option value="new">Chỉ bài viết</option>
                <option value="product">Chỉ sản phẩm</option>
              </select>
              <textarea
                placeholder="Mô tả (tùy chọn)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
                rows="3"
              ></textarea>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                <span>Hiển thị</span>
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded"
                >
                  {editingTag ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTags;
