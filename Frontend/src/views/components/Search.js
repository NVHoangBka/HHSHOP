import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import TitleController from "../../controllers/TitleController";

const titleController = new TitleController();

const Search = ({ isOpen, onClose, productController }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const categoryRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subTitles, setSubTitles] = useState([]);

  useEffect(() => {
    const fetchSubtitle = async () => {
      const arrSubTitle = await titleController.getAllSubTitles();
      setSubTitles(arrSubTitle);
    };

    fetchSubtitle();
  }, []);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery, category) => {
      if (!searchQuery) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await productController.search(searchQuery, category);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
      setLoading(false);
    }, 300),
    [productController]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    const category = categoryRef.current?.value || "all";
    debouncedSearch(value, category);
  };

  // Submit form
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      const category = categoryRef.current?.value || "all";
      navigate(
        `/products/search?q=${encodeURIComponent(query)}&category=${category}`
      );
    }
  };

  // Click gợi ý
  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    onClose();
    navigate(`/products/${product.id}`); // hoặc /search?q=...
  };

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
          <form onSubmit={handleSearch} className="mb-4 mx-3">
            <div className="input-group my-3">
              <select
                ref={categoryRef}
                className="form-select border-success py-2 ps-4 rounded-pill"
                defaultValue="all"
                onChange={() => {
                  if (query) debouncedSearch(query, categoryRef.current.value);
                }}
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
                value={query}
                onChange={handleInputChange}
                onFocus={() => query && setShowSuggestions(true)}
                className="form-control py-2 ps-4 rounded-start-pill"
                placeholder="Tìm theo sản phẩm"
              />
              <button
                type="submit"
                className="btn btn-outline-secondary rounded-end-circle bg-success d-flex align-items-center"
              >
                <i className="bi bi-search text-white"></i>
              </button>
            </div>

            {/* GỢI Ý TÌM KIẾM */}
            {showSuggestions && (
              <div
                className="position-absolute start-0 end-0 bg-white border rounded-bottom shadow-sm mt-1 mx-3"
                style={{
                  zIndex: 1000,
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {loading ? (
                  <div className="p-3 text-center text-muted">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang tìm...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((product) => {
                    const { id, image, name } = product;
                    const price = product.discountPrice || product.price;
                    return (
                      <div
                        key={id}
                        className="d-flex align-items-center p-3 border-bottom hover-bg-light cursor-pointer "
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img
                          src={image || "/placeholder.jpg"}
                          alt={name}
                          className="me-3"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-dark text-hover">
                            {name}
                          </div>
                          <div className="text-success small">
                            {price.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : query ? (
                  <div className="p-3 text-center text-muted">
                    Không tìm thấy sản phẩm nào
                  </div>
                ) : null}
              </div>
            )}
          </form>

          {/* Hot Keywords */}
          <div className="mx-3">
            <p className="text-success fw-semibold mb-2">Từ khóa phổ biến</p>
            <div className="d-flex flex-wrap gap-2">
              {subTitles
                .filter((sub) => sub.regular === true)
                .map((sub, index) => (
                  <Link
                    key={index}
                    to={`/products/search?q=${encodeURIComponent(
                      sub.name
                    )}&category=all`}
                    onClick={onClose}
                    className="badge bg-light text-dark border px-3 py-2 text-decoration-none hover-bg-success hover-text-white transition btn"
                  >
                    {sub.name}
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
