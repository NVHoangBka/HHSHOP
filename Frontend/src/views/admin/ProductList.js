import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này thật chứ?")) return;
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách sản phẩm ({filtered.length})</h2>
        <div>
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="form-control d-inline-block w-auto me-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/admin/products/new" className="btn btn-success">
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th width="80">Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} width="60" className="rounded" />
                </td>
                <td>
                  <strong>{p.name}</strong>
                  {p.variants?.length > 0 && (
                    <small className="text-muted d-block">
                      {p.variants.length} biến thể
                    </small>
                  )}
                </td>
                <td>
                  {p.discountPrice ? (
                    <>
                      <del>{p.price.toLocaleString()}₫</del>
                      <span className="text-danger fw-bold">
                        {" "}
                        {p.discountPrice.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    p.price.toLocaleString() + "₫"
                  )}
                </td>
                <td>{p.variants?.reduce((a, v) => a + v.stock, 0) || "—"}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${p._id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="btn btn-sm btn-danger"
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

export default ProductList;
