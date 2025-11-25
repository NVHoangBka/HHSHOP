// src/admin/pages/Products.jsx
import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || d));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    window.location.reload();
  };

  const deleteProduct = async (id) => {
    // if (confirm("Xóa sản phẩm này?")) {
    //   await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    //   setProducts((prev) => prev.filter((p) => p._id !== id));
    // }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý sản phẩm</h2>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          + Thêm sản phẩm mới
        </button>
      </div>

      {showForm && (
        <div className="card shadow-lg mb-4">
          <div className="card-body">
            <h5>Thêm sản phẩm mới</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tên sản phẩm"
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Giá gốc"
                    required
                    onChange={(e) =>
                      setForm({ ...form, price: +e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Giá khuyến mãi (nếu có)"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountPrice: +e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Số lượng tồn"
                    required
                    onChange={(e) =>
                      setForm({ ...form, stock: +e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Link ảnh (hoặc base64)"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success me-2">
                Lưu
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                    className="rounded"
                  />
                </td>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>
                  {p.discountPrice ? (
                    <>
                      <del>{p.price.toLocaleString()}₫</del>
                      <br />
                      <span className="text-danger fw-bold">
                        {p.discountPrice.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    <span>{p.price.toLocaleString()}₫</span>
                  )}
                </td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2">Sửa</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
