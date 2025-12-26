import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { t } from "i18next";

const Search = ({ isOpen, onClose, productController, titleController }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const categoryRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subTitles, setSubTitles] = useState([]);
  const [titles, setTitles] = useState([]);

  const fetchSubtitle = async () => {
    const arrSubTitle = await titleController.getAllSubTitles();
    setSubTitles(arrSubTitle);
  };

  const fetchTitle = async () => {
    const arrTitles = await titleController.getAllTitles();
    setTitles(arrTitles);
  };

  useEffect(() => {
    fetchSubtitle();

    fetchTitle();
  }, [titleController]);
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
    console.log(product);
    setShowSuggestions(false);
    onClose();
    navigate(`/products/slug/${product.slug}`); // hoặc /search?q=...
  };

  // Focus input khi mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <nav className="d-flex flex-column end-0 h-100" ref={searchRef}>
      <div className="container text-black">
        {/* Header */}
        <div className="mt-xl-3">
          <div className="search-header d-flex align-items-center">
            <button onClick={onClose} className="btn">
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <h4 className="fw-bold m-xl-0 px-xl-3 fs-3">{t("search.title")}</h4>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-xl-4 mx-xl-3">
            <div className="input-group my-xl-3">
              <select
                ref={categoryRef}
                className="form-select border-success py-xl-2 ps-xl-4 rounded-pill"
                defaultValue="all"
                onChange={() => {
                  if (query) debouncedSearch(query, categoryRef.current.value);
                }}
              >
                <option value="all">{t("search.all-categories")}</option>
                {titles?.map((title) => (
                  <option value={title.value}>{title.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group my-xl-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query && setShowSuggestions(true)}
                className="form-control py-xl-2 ps-xl-4 rounded-start-pill"
                placeholder={t("search.product-name")}
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
                className="position-absolute start-0 end-0 bg-white border rounded-bottom shadow-sm mt-xl-1 mx-xl-3"
                style={{
                  zIndex: 1000,
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {loading ? (
                  <div className="p-3 text-center text-muted">
                    <span className="spinner-border spinner-border-sm me-xl-2"></span>
                    Đang tìm...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((product) => {
                    const { id, image, name } = product;
                    const price = product.discountPrice || product.price;
                    return (
                      <div
                        key={id}
                        className="d-flex align-items-center p-xl-3 border-bottom hover-bg-light cursor-pointer "
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img
                          src={image || "/placeholder.jpg"}
                          alt={name}
                          className="me-xl-3"
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
                  <div className="p-xl-3 text-center text-muted">
                    {t("search.no-product")}
                  </div>
                ) : null}
              </div>
            )}
          </form>

          {/* Hot Keywords */}
          <div className="mx-xl-3">
            <p className="text-success fw-semibold mb-xl-2">
              {t("search.popular-keywords")}
            </p>
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
                    className="badge bg-light text-dark border px-xl-3 py-xl-2 text-decoration-none hover-bg-success hover-text-white transition btn"
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
