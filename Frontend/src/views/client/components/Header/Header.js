import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Menu from "./Menu/Menu";
import Search from "./Search/Search";
import Cart from "./CartHeader/CartHeader";

const Header = ({
  cartController,
  isAuthenticated,
  cartItems,
  onCartChange,
  authController,
  productController,
  titleController,
  categoryController,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const currentLanguage = localStorage.getItem("i18n_lang") || "en";

  // State cho 3 popup
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const getTranslated = (obj, fallback = "") => {
    return obj?.[currentLanguage] || obj?.vi || obj?.en || obj?.cz || fallback;
  };

  // Lấy user khi mount hoặc authController thay đổi
  useEffect(() => {
    const fetchUser = async () => {
      const user = await authController.getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [authController]);

  // Handler
  const goHome = () => navigate("/");
  const goToAccount = () => {
    if (isAuthenticated) {
      navigate("/account/info");
    } else {
      navigate("/account/login");
    }
  };

  const toggleMenu = () => {
    setShowMenu((v) => !v);
    setShowSearch(false);
    setShowCart(false);
  };

  const toggleSearch = () => {
    setShowSearch((v) => !v);
    setShowMenu(false);
    setShowCart(false);
  };

  const toggleCart = () => {
    setShowCart((v) => !v);
    setShowMenu(false);
    setShowSearch(false);
  };

  const handleCartUpdate = useCallback(
    (updatedCart) => {
      onCartChange(updatedCart);
    },
    [onCartChange]
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: lưu vào localStorage để nhớ lần sau
    localStorage.setItem("i18n_lang", lng);
  };

  const currentLang = i18n.language || "vi";

  const languages = (i18n.options.supportedLngs || ["vi", "en", "cz"]).filter(
    (lng) => lng !== "cimode"
  );

  const languageNames = {
    vi: t("language.vi"),
    en: t("language.en"),
    cz: t("language.cz"),
  };

  return (
    <header
      className="header shadow-sm bg-white sticky-top "
      style={{ zIndex: "1500" }}
    >
      <div className="header-top py-xl-2">
        <div className="container ">
          <div className="d-flex justify-content-between align-items-center row py-xl-1">
            {/* Left: Menu */}
            <div className="header-top-left d-flex align-items-center col-xl-3">
              <button
                className="btn btn-outline-secondary border rounded-circle"
                onClick={toggleMenu}
              >
                <i className="bi bi-list fs-5"></i>
              </button>
              <span className="header-top-left-text ms-xl-1 	d-none d-xl-block">
                {t("header.product_category")}
              </span>
            </div>
            {/* Center: Logo */}
            <div
              className="header-top-center text-center col-xl-4 "
              onClick={goHome}
              style={{ background: "transparent", cursor: "pointer" }}
            >
              <img
                src={`/img/logo/LOGO.png`}
                alt="logo"
                class="img-fluid col-8"
              />
            </div>

            {/* Right: Search, Account, Cart */}
            <div className="d-flex align-items-center justify-content-end col-xl-5">
              <div className="row justify-content-end align-items-center">
                <div className="col-xl-2">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="language-dropdown"
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded border"
                      title="Chọn ngôn ngữ"
                    >
                      <img
                        src={
                          `/img/flags/${currentLang}.png` ||
                          `/img/flags/${currentLang}.jpg`
                        }
                        alt={currentLang.toUpperCase()}
                        className="me-xl-1 rounded col-xl-12"
                      />
                    </Dropdown.Toggle>

                    {/* Menu dropdown - dùng class "show" để hiển thị */}
                    <Dropdown.Menu className="mt-xl-1 dropdown-menu-end">
                      {languages.map((language, index) => (
                        <Dropdown.Item
                          key={index}
                          className={
                            currentLang === language
                              ? "py-xl-2 bg-secondary-subtle"
                              : "py-xl-2"
                          }
                          onClick={() => {
                            changeLanguage(language);
                          }}
                        >
                          <img
                            className="me-xl-2"
                            src={`/img/flags/${language}.png`}
                            alt={language.toUpperCase()}
                            style={{
                              width: "28px",
                              height: "22px",
                            }}
                          />
                          <span
                            className={
                              currentLang === language ? "fw-bold" : ""
                            }
                          >
                            {languageNames[language]}
                          </span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="col-xl-2">
                  <button
                    className="btn btn-outline-secondary border rounded-circle"
                    onClick={toggleSearch}
                  >
                    <i className="bi bi-search fs-5"></i>
                  </button>
                </div>
                <div className="col-xl-2">
                  <button
                    className="btn btn-outline-secondary border rounded-circle d-none d-md-block"
                    onClick={goToAccount}
                  >
                    <i className="bi bi-person fs-5"></i>
                  </button>
                </div>
                <div className="col-xl-4">
                  <button
                    className="btn btn-outline-secondary border position-relative d-flex align-items-center"
                    onClick={toggleCart}
                  >
                    <i className="bi bi-cart4 fs-5"></i>
                    <span className="ms-1 d-none d-xl-block">
                      {t("header.cart")}
                    </span>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {totalQuantity}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom - Navigation */}
      <div className="header-bottom bg-success d-none d-xl-block">
        <div className="container">
          <ul className="navbar justify-content-center list-unstyled row ms-xl-5 me-xl-5 p-xl-3 text-white mb-xl-0">
            {[
              { name: t("header.introduce"), path: "/introduce" },
              { name: t("header.flash_sale"), path: "/flash-sale" },
              { name: t("header.news"), path: "/news" },
              { name: t("header.check_order"), path: "/check-order" },
              { name: t("header.contact"), path: "/contact" },
              { name: t("header.instruct"), path: "/instruct" },
            ].map((item, index) => (
              <li key={index} className="nav-item hover col-xl-2 text-center">
                <Link to={item.path} className="nav-link fw-semibold">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ==================== MENU MOBILE (Offcanvas trái) ==================== */}
      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
        style={{ zIndex: "3000" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Link
              to={"/account/login"}
              className="header-icon-group text-reset d-flex align-items-center text-decoration-none py-xl-1 px-xl-2 menu-hover"
            >
              <div className="header-icon align-content-center me-xl-2">
                <i className="bi bi-person fs-3 border px-1"></i>
              </div>
              {currentUser ? (
                <div>
                  {`Xin chào, ${currentUser.firstName} ${currentUser.lastName}`}
                </div>
              ) : (
                <div className="lh-sm">
                  <p className="mb-xl-1 fs-6">{t("account.title")}</p>
                  <span className="fw-bold fs-6">
                    {t("system.login.title")}
                  </span>
                </div>
              )}
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-xl-0">
          <Menu
            isOpen={showMenu}
            onClose={() => setShowMenu(false)}
            user={currentUser}
            titleController={titleController}
            useTranslation={useTranslation}
            categoryController={categoryController}
            getTranslated={getTranslated}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ==================== SEARCH FULLSCREEN (Modal) ==================== */}
      <Offcanvas
        show={showSearch}
        onHide={() => setShowSearch(false)}
        placement="end"
        style={{ zIndex: "3000" }}
      >
        <Offcanvas.Body className="p-xl-0">
          <Search
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            productController={productController}
            titleController={titleController}
            categoryController={categoryController}
            getTranslated={getTranslated}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ==================== CART SIDEBAR (Offcanvas phải) ==================== */}
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
        style={{ zIndex: "3000" }}
      >
        <Offcanvas.Body className="p-xl-0 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">
            <Cart
              isOpen={showCart}
              onClose={(e) => {
                setShowCart(false);
              }}
              cartItems={cartItems}
              cartController={cartController}
              titleController={titleController}
              onCartChange={handleCartUpdate}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
