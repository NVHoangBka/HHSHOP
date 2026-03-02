import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";

const Menu = ({ menuRef, onClose, categoryController, getTranslated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchCategories = async () => {
    const result = await categoryController.getCategories();
    if (result.success) {
      const categories = result.categories;
      setCategories(categories);
    }
    setLoading(false);
    return result;
  };

  useEffect(() => {
    fetchCategories();
  }, [categoryController]);

  const handleItemClick = () => {
    onClose(false);
  };

  const handleToggle = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading)
    return <div className="text-center py-4">{t("menu.loading")}</div>;

  return (
    <nav ref={menuRef} className="h-100 ">
      <div className="menu-container">
        <div className="menu-content">
          <ul className="menu-list list-unstyled mb-0">
            <li>
              <Link
                to="/products/all"
                onClick={handleItemClick}
                className="d-block menu-hover fw-medium"
              >
                <span className="fw-medium">{t("menu.allProducts")}</span>
              </Link>
            </li>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <li key={index} className="dropdown-submenu">
                  <div className="d-flex justify-content-between align-items-center menu-hover cursor-pointer ">
                    <Link
                      to={`/products/${getTranslated(category.slug)}`}
                      className="d-flex justify-content-between menu-hover"
                      onClick={handleItemClick}
                    >
                      <span className="fw-medium">
                        {getTranslated(category.name)}
                      </span>
                    </Link>
                    {category.children?.length > 0 && (
                      <i
                        className={`bi bi-chevron-right fs-5 ms-2 pe-lg-3 transition-transform ${
                          openIndex === index ? "rotate-0" : ""
                        }`}
                        onClick={(e) => handleToggle(index, e)}
                        role="button"
                      ></i>
                    )}
                  </div>
                  {/* Submenu <tablet*/}
                  {category.children?.length > 0 && (
                    <div
                      className={`submenu-container position-absolute top-0 start-0 bottom-0 end-0 bg-white 
                      ${openIndex === index ? "d-block" : "d-none"} d-lg-none`}
                      style={{ zIndex: "2000" }}
                    >
                      <div
                        className="d-flex justify-content-center align-items-center p-3 border-bottom cursor-pointer bg-light"
                        onClick={(e) => handleToggle(index, e)}
                      >
                        <i
                          className={`bi bi-chevron-left fs-6 mx-2 transition-transform`}
                        ></i>
                        <h2 className="text-center mb-1 fw-semibold fs-5">
                          {getTranslated(category.name)}
                        </h2>
                      </div>
                      <ul className="menu-list pt-0">
                        {category.children.map((subCategory, index) => (
                          <li
                            key={index}
                            className="menu-hover border-bottom py-1"
                          >
                            <Link
                              to={`/products/${getTranslated(
                                category.slug,
                              )}/${getTranslated(subCategory.slug)}`}
                              onClick={handleItemClick}
                            >
                              {getTranslated(subCategory.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Submenu*/}
                  {category.children?.length > 0 && (
                    <div
                      className={`submenu-container position-absolute top-0 start-100 bottom-0 bg-white w-100 border
                      ${openIndex === index ? "d-lg-flex" : "d-lg-none"} d-none`}
                      style={{ zIndex: "2000" }}
                    >
                      <ul className="menu-list pt-0">
                        {category.children.map((subCategory, index) => (
                          <li
                            key={index}
                            className="menu-hover border-bottom py-1"
                          >
                            <Link
                              to={`/products/${getTranslated(
                                category.slug,
                              )}/${getTranslated(subCategory.slug)}`}
                              onClick={handleItemClick}
                            >
                              {getTranslated(subCategory.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li>{t("menu.noCategory")}</li>
            )}
          </ul>
          <ul className="menu-list">
            <li>
              <Link
                to="/introduce"
                onClick={handleItemClick}
                className="menu-hover"
              >
                {t("menu.introduce")}
              </Link>
            </li>
            <li className="dropdown-submenu">
              <Link
                to="#"
                title={t("menu.flashSale")}
                className="d-flex justify-content-between menu-hover"
              >
                <span>{t("menu.flashSale")}</span>
                <i
                  className={`bi bi-chevron-right fs-5 ms-2 transition-transform }`}
                  role="button"
                ></i>
              </Link>
              <ul className="menu-list">
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    {t("menu.flashSaleSingleSlot")}
                  </Link>
                </li>
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    {t("menu.flashSaleMultipleSlots")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/news" onClick={handleItemClick} className="menu-hover">
                {t("menu.news")}
              </Link>
            </li>
            <li>
              <Link
                to="/check-order"
                onClick={handleItemClick}
                className="menu-hover"
              >
                {t("menu.checkOrder")}
              </Link>
            </li>
            <li>
              <Link to="#" onClick={handleItemClick} className="menu-hover">
                {t("menu.contact")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-footer row mx-xl-0 border-top pt-xl-2 mx-0 pt-2 align-items-center">
          <div className="col-xl-6 py-xl-4 col-6 py-3 menu-hover">
            <i className="bi bi-shop border p-xl-2 p-1"></i>
            <span className="ps-2">{t("menu.storeSystem")}</span>
          </div>
          <div className="col-xl-6 py-xl-4 col-6 py-2 menu-hover ">
            <i className="bi bi-telephone-outbound border p-xl-2 p-1"></i>
            <span className="ps-xl-2">Holine: 0999999998</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
