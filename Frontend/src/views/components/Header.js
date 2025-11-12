import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import Cart from "./Cart";

const Header = ({
  cartController,
  isAuthenticated,
  cartItems,
  onCartChange,
  authController,
  productController,
}) => {
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [localCartItems, setLocalCartItems] = useState(cartItems || []);

  // Dùng props cartItems trực tiếp → không cần local state (tránh lệch)
  const totalQuantity = localCartItems.reduce(
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

  // Click outside để đóng menu/search/cart
  // Thay thế useEffect click outside hiện tại bằng đoạn này
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      const isInMenu = menuRef.current?.contains(target);
      const isInSearch = searchRef.current?.contains(target);
      const isInCart = cartRef.current?.contains(target);

      // Nếu click VÀO trong menu, search, hoặc cart → KHÔNG đóng
      if (isInMenu || isInSearch || isInCart) {
        return;
      }

      // Click RA NGOÀI → đóng tất cả
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsCartOpen(false);
    };

    // Chỉ thêm listener khi có ít nhất 1 popup đang mở
    if (isMenuOpen || isSearchOpen || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isSearchOpen, isCartOpen]);
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
    setIsMenuOpen((v) => !v);
    setIsSearchOpen(false);
    setIsCartOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen((v) => !v);
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen((v) => !v);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleCartUpdate = useCallback(
    (updatedCart) => {
      onCartChange(updatedCart);
    },
    [onCartChange]
  );

  // Cập nhật localCartItems khi cartItems từ props thay đổi
  React.useEffect(() => {
    setLocalCartItems(cartItems || []);
  }, [cartItems]);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Left: Menu */}
          <div
            className="header-top-left d-flex align-items-center"
            ref={menuRef}
          >
            <button
              className="btn btn-outline-secondary border rounded-circle"
              onClick={toggleMenu}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <span className="header-top-left-text ms-1">Danh mục sản phẩm</span>

            <Menu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              authController={authController}
              isAuthenticated={isAuthenticated}
              user={currentUser}
            />
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
            <div ref={searchRef}>
              <button
                className="btn btn-outline-secondary border rounded-circle m-3"
                onClick={toggleSearch}
              >
                <i className="bi bi-search fs-5"></i>
              </button>
              <Search
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                productController={productController}
              />
            </div>
            <button
              className="btn btn-outline-secondary border rounded-circle m-3"
              onClick={goToAccount}
            >
              <i className="bi bi-person fs-5"></i>
            </button>
            <div ref={cartRef}>
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
              <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={localCartItems}
                cartController={cartController}
                onCartChange={handleCartUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom - Navigation */}
      <div className="header-bottom bg-success">
        <div className="container">
          <ul className="navbar justify-content-center list-unstyled row ms-5 me-5 p-3 text-white mb-0">
            {[
              "Giới thiệu",
              "Khuyến mãi",
              "Tin tức",
              "Kiểm tra đơn hàng",
              "Liên hệ",
              "Hướng dẫn",
            ].map((item) => (
              <li className="nav-item hover col-2 text-center" key={item}>
                <Link to="#" className="nav-link ">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop (chỉ 1 cái, thông minh) */}
      {(isMenuOpen || isSearchOpen || isCartOpen) && (
        <div
          className="position-fixed inset-0 bg-black bg-opacity-50 z-99"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
