import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";

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

  return (
    <header className="header">
      <div className="header-top">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Left: Menu */}
          <div className="header-top-left d-flex align-items-center">
            <button
              className="btn btn-outline-secondary border rounded-circle"
              onClick={toggleMenu}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <span className="header-top-left-text ms-1">Danh mục sản phẩm</span>
          </div>
          {/* Center: Logo */}
          <div
            className="header-top-center text-center"
            onClick={goHome}
            style={{ background: "transparent", cursor: "pointer" }}
          >
            <img
              src="https://www.canva.com/design/DAGwwkhPGJ4/TrjwaRAGmJSgLHZRKbYLGg/view"
              alt="logo"
              className="header-logo h-75 w-50"
            />
          </div>

          {/* Right: Search, Account, Cart */}
          <div className="header-top-right d-flex">
            <button
              className="btn btn-outline-secondary border rounded-circle m-3"
              onClick={toggleSearch}
            >
              <i className="bi bi-search fs-5"></i>
            </button>
            <button
              className="btn btn-outline-secondary border rounded-circle m-3"
              onClick={goToAccount}
            >
              <i className="bi bi-person fs-5"></i>
            </button>
            <div>
              <button
                className="btn btn-outline-secondary border m-3 position-relative"
                onClick={toggleCart}
              >
                <i className="bi bi-cart4 fs-5"></i>
                <span className="ms-1">Giỏ hàng</span>
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

      {/* Header Bottom - Navigation */}
      <div className="header-bottom bg-success">
        <div className="container">
          <ul className="navbar justify-content-center list-unstyled row ms-5 me-5 p-3 text-white mb-0">
            {[
              { name: "Giới thiệu", path: "/introduce" },
              { name: "Khuyến mãi", path: "/flash-sale" },
              { name: "Tin tức", path: "/news" },
              { name: "Kiểm tra đơn hàng", path: "/check-order" },
              { name: "Liên hệ", path: "/contact" },
              { name: "Hướng dẫn", path: "/instruct" },
            ].map((item) => (
              <li className="nav-item hover col-2 text-center" key={item}>
                <Link to={item.path} className="nav-link ">
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
        className="w-25"
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
