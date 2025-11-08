import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Search = ({ isOpen, onClose }) => {
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input khi mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <nav className={`search ${isOpen ? "active" : ""}`} ref={searchRef}>
      <div className="container text-black">
        {/* Header */}
        <div className="mt-3">
          <div className="search-header d-flex align-items-center">
            <button onClick={onClose} className="btn">
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <h4 className="fw-bold m-0 px-3 fs-3">Tìm Kiếm</h4>
          </div>

          {/* Search Bar */}
          <form action="/search" method="get" className="mb-4">
            <div className="input-group my-3">
              <select
                className="form-select border-success py-2 ps-4 rounded-pill"
                id="inputGroupSelect02"
                defaultValue="all"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="personal-care">Chăm sóc cá nhân</option>
                <option value="baby-care">Chăm sóc bé</option>
                <option value="household-cleaning">Vệ sinh nhà cửa</option>
                <option value="food-beverages">Thực phẩm & Đồ uống</option>
              </select>
            </div>
            <div className="input-group my-3">
              <input
                ref={inputRef}
                type="text"
                name="inputSearch"
                className="form-control py-2 ps-4 rounded-start-pill"
                placeholder="Tìm theo sản phẩm"
                aria-label="Tìm theo sản phẩm"
                aria-describedby="btn-search"
              />
              <button
                type="submit"
                className="btn btn-outline-secondary rounded-end-circle bg-success d-flex align-items-center"
              >
                <i className="bi bi-search text-white"></i>
              </button>
            </div>
          </form>

          {/* Hot Keywords */}
          <div>
            <p className="text-success fw-semibold mb-2">Từ khóa phổ biến</p>
            <div className="d-flex flex-wrap gap-2">
              {[
                "Nước giặt",
                "Sữa tắm",
                "Dầu gội",
                "Bỉm trẻ em",
                "Khăn giấy",
              ].map((kw) => (
                <Link
                  key={kw}
                  to={`/search?q=${kw}`}
                  onClick={onClose}
                  className="badge bg-light text-dark border px-3 py-2 text-decoration-none hover-bg-success hover-text-white transition"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Search;
