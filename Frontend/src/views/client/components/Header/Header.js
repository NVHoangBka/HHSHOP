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
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);

  // State cho 3 popup
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

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

  const languages = (i18n.options.supportedLngs || ["vi", "en"]).filter(
    (lng) => lng !== "cimode"
  );

  const languageNames = {
    vi: "Tiếng Việt",
    en: "English",
  };

  return (
    <header className="header shadow-sm bg-white sticky-top">
      <div className="header-top py-2 py-md-3">
        <div className="container ">
          <div className="d-flex justify-content-between align-items-center">
            {/* Left: Menu */}
            <div className="header-top-left d-flex align-items-center">
              <button
                className="btn btn-outline-secondary border rounded-circle"
                onClick={toggleMenu}
              >
                <i className="bi bi-list fs-5"></i>
              </button>
              <span className="header-top-left-text ms-1 	d-none d-xl-block">
                {t("header.product_category")}
              </span>
            </div>
            {/* Center: Logo */}
            <div
              className="header-top-center text-center"
              onClick={goHome}
              style={{ background: "transparent", cursor: "pointer" }}
            >
              <img
                src={`/img/logo/LOGO.png`}
                alt="logo"
                class="img-fluid w-50 w-md-50 w-lg-75 p-3"
              />
            </div>

            {/* Right: Search, Account, Cart */}
            <div className="d-flex align-items-center justify-content-end">
              <Dropdown className="dropdown m-xl-3 m-sm-2 my-2 mx-1 ">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="language-dropdown"
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-1 py-2 rounded border"
                  title="Chọn ngôn ngữ"
                >
                  <img
                    src={`/img/flags/${currentLang}.png`}
                    alt={currentLang.toUpperCase()}
                    style={{
                      width: "50%",
                    }}
                    className="me-1 rounded"
                  />
                </Dropdown.Toggle>

                {/* Menu dropdown - dùng class "show" để hiển thị */}
                <Dropdown.Menu className="mt-1 dropdown-menu-end">
                  {languages.map((language, index) => (
                    <Dropdown.Item
                      key={index}
                      className={
                        currentLang === language
                          ? "py-2 bg-secondary-subtle"
                          : "py-2"
                      }
                      onClick={() => {
                        changeLanguage(language);
                      }}
                    >
                      <img
                        className="me-2"
                        src={`/img/flags/${language}.png`}
                        alt={language.toUpperCase()}
                        style={{
                          width: "28px",
                          height: "22px",
                        }}
                      />
                      <span
                        className={currentLang === language ? "fw-bold" : ""}
                      >
                        {languageNames[language]}
                      </span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <button
                className="btn btn-outline-secondary border rounded-circle m-xl-3 m-sm-2 my-2 mx-1"
                onClick={toggleSearch}
              >
                <i className="bi bi-search fs-5"></i>
              </button>

              <button
                className="btn btn-outline-secondary border rounded-circle m-xl-3 m-sm-2 my-2 mx-1 d-none d-md-block"
                onClick={goToAccount}
              >
                <i className="bi bi-person fs-5"></i>
              </button>
              <div>
                <button
                  className="btn btn-outline-secondary border m-xl-3 m-sm-2 my-2 mx-1 position-relative d-flex align-items-center"
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

      {/* Header Bottom - Navigation */}
      <div className="header-bottom bg-success d-none d-xl-block">
        <div className="container">
          <ul className="navbar justify-content-center list-unstyled row ms-5 me-5 p-3 text-white mb-0">
            {[
              { name: t("header.introduce"), path: "/introduce" },
              { name: t("header.flash_sale"), path: "/flash-sale" },
              { name: t("header.news"), path: "/news" },
              { name: t("header.check_order"), path: "/check-order" },
              { name: t("header.contact"), path: "/contact" },
              { name: t("header.instruct"), path: "/instruct" },
            ].map((item, index) => (
              <li key={index} className="nav-item hover col-2 text-center">
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
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {currentUser ? `Xin chào, ${currentUser.firstName}` : "Menu"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Menu
            isOpen={showMenu}
            onClose={() => setShowMenu(false)}
            user={currentUser}
            titleController={titleController}
            useTranslation={useTranslation}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ==================== SEARCH FULLSCREEN (Modal) ==================== */}
      <Offcanvas
        show={showSearch}
        onHide={() => setShowSearch(false)}
        placement="end"
      >
        <Offcanvas.Body className="p-0">
          <Search
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            productController={productController}
            titleController={titleController}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ==================== CART SIDEBAR (Offcanvas phải) ==================== */}
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
      >
        <Offcanvas.Body className="p-0 d-flex flex-column">
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
