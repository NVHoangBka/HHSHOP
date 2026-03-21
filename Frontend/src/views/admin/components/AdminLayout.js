import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation, Outlet } from "react-router-dom";

const AdminLayout = ({ onLogoutAdmin }) => {
  const [t, i18n] = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    onLogoutAdmin();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18n_lang_admin", lng);
  };

  // Đóng sidebar khi chuyển route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Đóng sidebar khi click ra ngoài (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest("#hamburger-btn")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const currentLang = i18n.language || "vi";
  const languages = (i18n.options.supportedLngs || ["vi", "en", "cz"]).filter(
    (lng) => lng !== "cimode",
  );
  const languageNames = {
    vi: t("language.vi"),
    en: t("language.en"),
    cz: t("language.cz"),
  };

  const navLinks = [
    { to: "/admin/dashboard", label: t("admin.dashboard") },
    { to: "/admin/products", label: t("admin.products.title") },
    { to: "/admin/orders", label: t("admin.orders.title") },
    { to: "/admin/users", label: t("admin.users.title") },
    { to: "/admin/news", label: t("admin.news.title") },
    { to: "/admin/tags", label: t("admin.tags.title") },
    { to: "/admin/brands", label: t("admin.brands.title") },
    { to: "/admin/setup", label: t("admin.setups") },
    { to: "/admin/setting", label: t("admin.settings") },
  ];

  return (
    <div className="vh-100 d-flex flex-column bg-light">
      {/* ── Navbar ── */}
      <nav className="navbar navbar-dark bg-dark px-3 flex-shrink-0">
        {/* Hamburger — chỉ hiện trên mobile */}
        <button
          id="hamburger-btn"
          className="btn btn-sm navbar-toggler border-0 d-md-none me-2"
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <i className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        <span className="navbar-brand me-auto text-truncate">
          MINIMART – ADMIN
        </span>

        {/* Right controls */}
        <div className="d-flex align-items-center gap-2">
          {/* Language switcher */}
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              id="language-dropdown"
              className="d-flex align-items-center p-1 border rounded"
              title="Chọn ngôn ngữ"
            >
              <img
                src={`/img/flags/${currentLang}.png`}
                alt={currentLang.toUpperCase()}
                style={{ width: 26, height: 20, objectFit: "cover" }}
                className="rounded"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end mt-1">
              {languages.map((language, index) => (
                <Dropdown.Item
                  key={index}
                  className={`py-2 ${currentLang === language ? "bg-secondary-subtle" : ""}`}
                  onClick={() => changeLanguage(language)}
                >
                  <img
                    src={`/img/flags/${language}.png`}
                    alt={language.toUpperCase()}
                    className="me-2 rounded"
                    style={{ width: 26, height: 20, objectFit: "cover" }}
                  />
                  <span className={currentLang === language ? "fw-bold" : ""}>
                    {languageNames[language]}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Welcome — ẩn trên xs */}
          <span className="text-white d-none d-sm-inline small text-nowrap">
            {t("admin.welcome")}, Admin
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm"
          >
            {t("admin.logout")}
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex-grow-1 d-flex overflow-hidden position-relative">
        {/* Overlay — chỉ hiện trên mobile khi sidebar mở */}
        {sidebarOpen && (
          <div
            className="d-md-none position-fixed w-100 h-100 bg-dark bg-opacity-50"
            style={{ top: 56, left: 0, zIndex: 1040 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          ref={sidebarRef}
          className={`bg-white shadow-sm flex-shrink-0 ${sidebarOpen ? "d-flex" : "d-none"} d-md-flex flex-column`}
          style={{
            width: 220,
            position: sidebarOpen ? "fixed" : "static",
            top: 56,
            left: 0,
            bottom: 0,
            zIndex: 1045,
            overflowY: "auto",
          }}
        >
          <div className="list-group list-group-flush">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`list-group-item list-group-item-action py-3 ${
                  location.pathname.startsWith(to) ? "active" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-grow-1 p-3 p-md-4 bg-success-subtle overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
