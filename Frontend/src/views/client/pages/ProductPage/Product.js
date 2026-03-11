import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
import { Link, useParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import { useTranslation } from "react-i18next";
import categoryController from "../../../../controllers/CategoryController";
import tagController from "../../../../controllers/TagController";

const Product = ({ path, addToCart, productController }) => {
  const currentLanguage = localStorage.getItem("i18n_lang");
  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };
  const [t] = useTranslation();
  const params = useParams();
  const titlePath = params.subCategorySlug || params.categorySlug || path;

  const [titlePathCover, setTitlePathConver] = useState();
  const [activeTab, setActiveTab] = useState(path || "all");
  const [title, setTitle] = useState();
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  // state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: [],
    brand: [],
    type: [],
    tag: [],
    color: [],
  });
  const filtersLength = Object.values(filters).flat().length;

  const [showFilter, setShowFilter] = useState(false);
  const [tags, setTags] = useState();
  const [types, setTypes] = useState();
  const [colors, setColors] = useState();
  const [brands, setBrands] = useState();

  // === 1. CẬP NHẬT TITLE + activeTab ===
  const updateTitleAndActiveTab = async () => {
    if (titlePath !== "all") {
      setActiveTab(titlePath);
      let result;
      if (params.subCategorySlug) {
        result = await categoryController.getCategoriesByValue(titlePath);
        setSubCategoryId(result?.category?._id);
      } else {
        result = await categoryController.getCategoriesByValue(titlePath);
        setCategoryId(result?.category?._id);
        setSubCategoryId(null);
      }
      if (result?.success) {
        const category = result.category;
        const titleName = category?.name;
        setTitlePathConver(getTranslated(titleName));
        setTitle(getTranslated(titleName));
      } else {
        setTitlePathConver(titlePath);
        setTitle(getTranslated(titlePath));
      }
    } else {
      setActiveTab("all");
      setTitle("Tất cả sản phẩm");
      setTitlePathConver("Tất cả sản phẩm");
    }
  };

  useEffect(() => {
    updateTitleAndActiveTab();
  }, [categoryController, activeTab, titlePath]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, typesRes, colorsRes, brandsRes] = await Promise.all([
          tagController.getAllTags(),
          tagController.getAllTypes(),
          tagController.getAllColors(),
          tagController.getAllBrands(),
        ]);

        if (tagsRes.success) {
          setTags(
            tagsRes.tags.filter(
              (tag) => tag.type === "product" || tag.type === "both",
            ),
          );
        }
        setTypes(typesRes?.types || []);
        if (colorsRes?.success) setColors(colorsRes.colors || []);
        if (brandsRes?.success) setBrands(brandsRes.brands || []);
      } catch (error) {
        console.error("Lỗi fetch filter data:", error);
      }
    };
    fetchData();
  }, []);

  // ============= Đồng bộ priceRange ===================
  useEffect(() => {
    const min = priceRange[0];
    const max = priceRange[1];

    let label = "";
    let value = `${min}:${max >= 10000000 ? "max" : max}`;

    if (min === 0 && max >= 10000000) {
      setFilters((prev) => ({ ...prev, price: [] }));
      return;
    }

    if (max >= 10000000) {
      label = `${min.toLocaleString("vi-VN")} ₫ - 10tr+`;
    } else if (max === 0) {
      label = `${min.toLocaleString("vi-VN")} ₫`;
    } else {
      label = `${min.toLocaleString("vi-VN")} ₫ - ${max.toLocaleString("vi-VN")} ₫`;
    }

    // Tránh cập nhật không cần thiết → ngăn loop vô hạn
    const current = filters.price?.[0];
    if (current?.value === value && current?.label === label) return;

    setFilters((prev) => ({
      ...prev,
      price: [{ value, label }],
    }));
  }, [priceRange]);

  const resetAllFilters = () => {
    setFilters({
      price: [],
      brand: [],
      type: [],
      color: [],
    });

    // Bỏ tích tất cả checkbox & radio
    document
      .querySelectorAll('input[type="checkbox"], input[type="radio"]')
      .forEach((input) => {
        input.checked = false;
      });
  };

  // Hàm thay đổi filter
  const handleFilterChange = (key, e) => {
    const { type, checked, value } = e.target;

    let label, item;
    switch (key) {
      case "type":
        item = types.filter((t) => t._id === value);
        break;
      case "color":
        item = colors.filter((c) => c._id === value);
        break;
      case "brand":
        item = brands.filter((b) => b._id === value);
        break;
      default:
        break;
    }
    label = getTranslated(item[0]?.name);

    setFilters((prev) => {
      let updated = { ...prev };

      if (type === "checkbox") {
        // --- Checkbox: có thể chọn nhiều ---
        if (checked) {
          // 🔒 Kiểm tra trùng trước khi push
          const exist = updated[key]?.some((item) => item.value === value);

          if (!exist) {
            updated[key] = [...(updated[key] || []), { value, label }];
          }
        } else {
          updated[key] = (updated[key] || []).filter(
            (item) => item.value !== value,
          );
        }

        if (updated[key].length === 0) delete updated[key];
      }

      if (type === "radio") {
        // --- Radio: chỉ chọn 1 ---
        updated[key] = [{ value, label }];
      }

      return updated;
    });
  };

  const removeFilterItem = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      updated[key] = updated[key].filter((item) => item.value !== value);
      if (updated[key].length === 0) delete updated[key];
      return updated;
    });

    // Bỏ tích / bỏ chọn input tương ứng
    const input = document.querySelector(
      `input[name="${key}"][value="${value}"]`,
    );
    if (input) input.checked = false;
  };

  // Áp dụng filter khi filters thay đổi
  useEffect(() => {
    let isMounted = true;

    async function loadAndFilter() {
      setLoading(true);
      try {
        // B1: Lấy sản phẩm theo category/subCategory nếu có
        let products = [];
        if (subCategoryId) {
          products =
            activeTab === "all"
              ? await productController.getAllProducts()
              : await productController.getProductsBySubCategory(subCategoryId);
        } else {
          products =
            activeTab === "all"
              ? await productController.getAllProducts()
              : await productController.getProductsByCategory(categoryId);
        }
        // B3: Áp dụng các filter
        if (filters.price?.length > 0) {
          const [min, max] = filters.price[0].value
            .split(":")
            .map((v) => (v === "max" ? Infinity : Number(v)));
          products = products.filter((p) => {
            const priceToCheck =
              p.discountPrice !== null && p.discountPrice !== undefined
                ? p.discountPrice
                : p.price;

            if (priceToCheck === null || priceToCheck === undefined)
              return false;

            return (
              priceToCheck >= min && (max === Infinity || priceToCheck <= max)
            );
          });
        }

        if (filters.brand?.length > 0) {
          const brands = filters.brand.map((b) => b.value);
          products = products.filter((p) =>
            p.brands?.some((b) => brands.includes(b)),
          );
        }

        if (filters.type?.length > 0) {
          const types = filters.type.map((t) => t.value);
          products = products.filter((p) =>
            p.types?.some((t) => types.includes(t)),
          );
        }

        if (filters.color?.length > 0) {
          const colors = filters.color.map((c) => c.value);
          products = products.filter((p) =>
            p.colors?.some((c) => colors.includes(c)),
          );
        }

        if (filters.tag?.length > 0) {
          const tags = filters.tag.map((t) => t.value);
          products = products.filter((p) =>
            p.tag?.some((t) => tags.includes(t)),
          );
        }

        if (isMounted) {
          setFilteredProducts(products);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        if (isMounted) setFilteredProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAndFilter();

    return () => {
      isMounted = false;
    };
  }, [
    activeTab,
    titlePath,
    filters,
    categoryId,
    subCategoryId,
    productController,
  ]);

  // tính toán vị trí sản phẩm
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onColorChange = (e) => handleFilterChange("color", e);
  const onTypeChange = (e) => handleFilterChange("type", e);
  const onBrandChange = (e) => handleFilterChange("brand", e);
  const onPriceChange = (e) => handleFilterChange("price", e);
  const onTagChange = (e) => handleFilterChange("tag", e);

  return (
    <div className="product bg-success-subtle">
      <div className="container">
        <div className="breadcrumbs">
          <ul className="breadcrumb d-flex flex-wrap align-items-center py-xl-3 py-lg-3 py-md-2 py-1 mb-0 ">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("product.breadcrumb.home")}
                style={{ textDecoration: "none", color: "black" }}
              >
                <span>{t("product.breadcrumb.home")}</span>
              </Link>
              <span className="mx-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span style={{ color: "#BFBFBF" }}>{titlePathCover}</span>
            </li>
          </ul>
        </div>
        <section className="section section-collection-banner">
          <div className="collection_banner container text-center mb-xl-5 mb-lg-5 mb-md-4 mb-3 px-0">
            <Link className="banner" to="#" title={t("product.allProducts")}>
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="//bizweb.dktcdn.net/thumb/large/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617"
                />
                <img
                  className="object-contain mx-auto"
                  src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617"
                  width="1432"
                  height="120"
                  alt={t("product.allProducts")}
                  style={{ height: "auto", width: "100%" }}
                />
              </picture>
            </Link>
          </div>
        </section>
        <section className="section grid w-100" id="product-list-0">
          <div className="row mx-0">
            <div className="content-product-left col-xl-9 col-lg-9 col-12 pe-0">
              <h2 className="text-success fs-1 fw-semibold text-center text-md-start">
                {title}
              </h2>
              <div className="d-left flex-row-reverse align-items-center mb-xl-2 mb-lg-2 mb-md-1 mb-1">
                <div className="d-flex justify-content-between justify-content-md-end">
                  <button
                    className="btn btn-outline-dark d-lg-none rounded-pill d-flex align-items-center me-2 bg-white border-0"
                    onClick={() => setShowFilter(true)}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    {t("product.filter.title")}
                    <span className="filter-count inline-flex align-items-center justify-content-center text-white rounded-circle ms-2 bg-danger px-2">
                      {filtersLength}
                    </span>
                  </button>
                  <div className="sort-mobile whitespace-nowrap d-flex align-items-center me-xl-3 me-lg-3 me-md-2 me-1">
                    <label
                      htmlFor="sort-mobile"
                      className="labbel text-light-emphasis me-2"
                    >
                      {t("product.sort.label")}
                    </label>
                    <sort-by data-collection="0">
                      <select
                        name="sort_by"
                        id="sort-mobile"
                        className="form-select bg-white rounded-2"
                      >
                        <option value="manual">
                          {t("product.sort.default")}
                        </option>
                        <option value="name:asc">
                          {t("product.sort.nameAsc")}
                        </option>
                        <option value="name:desc">
                          {t("product.sort.nameDesc")}
                        </option>
                        <option value="price_min:asc">
                          {t("product.sort.priceAsc")}
                        </option>
                        <option value="price_min:desc">
                          {t("product.sort.priceDesc")}
                        </option>
                        <option value="created_on:desc">
                          {t("product.sort.newest")}
                        </option>
                        <option value="created_on:asc">
                          {t("product.sort.oldest")}
                        </option>
                      </select>
                    </sort-by>
                  </div>
                </div>
                <div className="filter-items w-100 d-flex flex-wrap mb-xl-3 mb-lg-3 mb-md-2 mb-1 mt-3 align-items-center">
                  {Object.entries(filters || {}).flatMap(([key, items]) =>
                    Array.isArray(items)
                      ? items.map((item) => (
                          <div
                            key={`${key}-${item.value}`}
                            className="filter-item bg-white d-flex fw-semibold items-center justify-content-center border rounded-1 py-1 px-xl-3 px-lg-2 px-md-2 px-2 relative cursor-pointer link mx-1 hover"
                          >
                            {item.label}
                            <span
                              className="js-remove-filter cursor-pointer ms-2"
                              onClick={() => removeFilterItem(key, item.value)}
                            >
                              <i className="bi bi-x"></i>
                            </span>
                          </div>
                        ))
                      : [],
                  )}

                  {/* Nút reset tất cả */}
                  {Object.values(filters).some(
                    (v) => Array.isArray(v) && v.length > 0,
                  ) && (
                    <div
                      className="filter-item text-danger border rounded-1 py-1 px-xl-3 px-lg-2 px-md-2 px-2 mx-1 my-1 cursor-pointer fw-semibold"
                      onClick={resetAllFilters}
                    >
                      {t("product.filter.resetAll")}
                    </div>
                  )}
                </div>
              </div>
              <div className="product-list grid mt-4 me-xl-2 me-lg-2 me-md-2 me-3">
                <div className="product-items">
                  <div className="row">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <div
                          className="col-xl-3 col-lg-3 col-md-4 col-6 my-xl-3 my-lg-3 my-md-2 my-2"
                          key={product.id}
                        >
                          <ProductItem
                            product={product}
                            addToCart={addToCart}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-center bg-light py-3 rounded-3">
                        {t("product.noProducts")}
                      </p>
                    )}
                  </div>
                </div>
                {/* phân trang */}
                <div className="pagination d-flex justify-content-center my-4">
                  {/* Nút mũi tên trái */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="btn bg-white mx-1"
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {/* Nút số trang */}
                  {Array.from({ length: totalPages }, (_, index) => (
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

                  {/* Nút mũi tên phải */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn bg-white mx-1"
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`col-xl-3 col-lg-3 col-md-4 ${
                showFilter
                  ? `d-block position-fixed position-md-static top-0 end-0 bg-white overflow-auto p-3`
                  : "d-none"
              }  
              content-product-right pe-0 d-lg-block h-100`}
              style={{ zIndex: showFilter ? "2000" : "1000" }}
            >
              <div className="d-flex justify-content-between align-items-center py-2 ms-2 me-3 border-bottom">
                <h3 className="mb-0 fw-bold">{t("product.filter.title")}</h3>
                <button
                  className="btn-close d-lg-none"
                  onClick={() => setShowFilter(false)}
                ></button>
              </div>
              <facet-drawer data-collection="0">
                <div className="collection-filter bg-white pb-4 mb-lg-4 rounded-3">
                  <div className="facet-inner overflow-auto h-100 px-xl-2 px-md-3 px-3">
                    <form className="facet-form">
                      <div className="filter-container d-flex flex-column rounded-sm ps-xl-4 pt-xl-4 ps-lg-3 pt-lg-3 ps-md-2 ps-2 pt-md-2 ps-1 pt-1">
                        {/* Giá */}
                        <aside
                          className="aside-item filter-price py-xl-2"
                          style={{ order: "4" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-xl-3 fs-6">
                              {t("product.filter.price")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group px-3 pb-4">
                            <div className="d-flex justify-content-between mb-3 fw-medium">
                              <span>
                                {priceRange[0].toLocaleString("vi-VN")} ₫
                              </span>
                              <span>
                                {priceRange[1] >= 10000000
                                  ? "10tr+"
                                  : priceRange[1].toLocaleString("vi-VN") +
                                    " ₫"}
                              </span>
                            </div>

                            <ReactSlider
                              className="horizontal-slider mt-4"
                              thumbClassName="thumb"
                              trackClassName="track"
                              value={priceRange}
                              onChange={setPriceRange}
                              min={0}
                              max={10000000}
                              step={50000}
                              pearling
                              minDistance={0}
                            />
                          </div>
                        </aside>
                        {/* Hãng sản xuất */}
                        <aside
                          className="aside-item filter-vendor py-xl-2"
                          style={{ order: "3" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-xl-3 fs-6">
                              {t("product.filter.brand")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              {brands?.length > 0 &&
                                brands?.map((brand, index) => (
                                  <li
                                    className="filter-item link filter-item--check-box mb-1 d-flex align-items-center"
                                    key={index}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox form-checkbox_md"
                                      id={`filter-${brand._id}`}
                                      value={`${brand._id}`}
                                      data-operator="OR"
                                      name="vendor"
                                      onChange={onBrandChange}
                                    />
                                    <label
                                      className="custom-checkbox ms-2 fw-100"
                                      htmlFor={`filter-${brand._id}`}
                                    >
                                      {brand.name}
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </aside>
                        {/*Loại sản phẩm  */}
                        <aside
                          className="aside-item filter-type py-2 "
                          style={{ order: "2" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.type")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              {types?.length > 0 &&
                                types?.map((type, index) => (
                                  <li
                                    className="filter-item link filter-item--check-box mb-1 d-flex align-items-center"
                                    key={index}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox form-checkbox_md"
                                      id={`filter-type-${type._id}`}
                                      value={type._id}
                                      name="type"
                                      onChange={onTypeChange}
                                    />
                                    <label
                                      className="custom-checkbox ms-2 fw-100"
                                      htmlFor={`filter-type-${type._id}`}
                                    >
                                      {getTranslated(type.name)}
                                    </label>
                                  </li>
                                ))}

                              <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 text-hover text-danger fw-bold">
                                {t("product.features.showMore")}{" "}
                                <i className="bi bi-chevron-down"></i>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/* Màu sắc */}
                        <aside
                          className="aside-item filter-tag1 py-2 "
                          style={{ order: "0" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.color")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              {colors?.length > 0 &&
                                colors?.map((color, index) => (
                                  <li
                                    className="filter-item link filter-item--check-box mb-1 d-flex align-items-center"
                                    key={index}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox form-checkbox_md"
                                      id={`filter-${color._id}`}
                                      value={`${color._id}`}
                                      data-operator="OR"
                                      name="color"
                                      onChange={onColorChange}
                                    />
                                    <label
                                      className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100"
                                      htmlFor={`filter-${color._id}`}
                                    >
                                      {getTranslated(color?.name)}
                                    </label>
                                  </li>
                                ))}

                              <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 text-hover text-danger fw-bold">
                                {t("product.features.showMore")}
                                <i className="bi bi-chevron-down"></i>
                              </li>
                            </ul>
                          </div>
                        </aside>
                        {/* Tag */}
                        <aside
                          className="aside-item filter-tag1 py-2"
                          style={{ order: "1" }}
                        >
                          <div className="aside-title">
                            <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                              {t("product.filter.tag")}
                            </h2>
                          </div>
                          <div className="aside-content filter-group">
                            <ul className="space-y-3 ps-0">
                              {tags?.length > 0 &&
                                tags?.map((tag, index) => (
                                  <li
                                    className="filter-item link filter-item--check-box mb-1 d-flex align-items-center"
                                    key={index}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox form-checkbox_md"
                                      id={`filter-${tag._id}`}
                                      value={`${tag._id}`}
                                      data-operator="OR"
                                      name="tag"
                                      onChange={onTagChange}
                                    />
                                    <label
                                      className="custom-checkbox ms-2 fw-100"
                                      htmlFor={`filter-${tag._id}`}
                                    >
                                      {tag?.name}
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </aside>
                      </div>
                    </form>
                  </div>
                </div>
              </facet-drawer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;
