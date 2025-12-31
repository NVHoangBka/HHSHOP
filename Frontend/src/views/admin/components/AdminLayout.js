import React from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ onLogoutAdmin }) => {
  const [t, i18n] = useTranslation();
  const handleLogout = (e) => {
    e.preventDefault();
    onLogoutAdmin();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: lưu vào localStorage để nhớ lần sau
    localStorage.setItem("i18n_lang_admin", lng);
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
    <div className="h-100 bg-light ">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid row justify-content-between">
          <span className="navbar-brand col">MINIMART – QUẢN TRỊ</span>
          <div className="d-flex align-items-center justify-content-end col-xl-4">
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
                      src={`/img/flags/${currentLang}.png`}
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
                          className={currentLang === language ? "fw-bold" : ""}
                        >
                          {languageNames[language]}
                        </span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-xl-5">
                <span className="text-white me-3">
                  {t("admin.welcome")}, Admin
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                >
                  {t("admin.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-2 bg-white shadow-sm p-0">
            <div className="list-group list-group-flush">
              <Link
                to="/admin/dashboard"
                className="list-group-item list-group-item-action py-3"
              >
                {t("admin.dashboard")}
              </Link>
              <Link
                to="/admin/products"
                className="list-group-item list-group-item-action py-3"
              >
                {t("admin.products.title")}
              </Link>
              <Link
                to="/admin/orders"
                className="list-group-item list-group-item-action py-3 "
              >
                {t("admin.orders.title")}
              </Link>
              <Link
                to="/admin/users"
                className="list-group-item list-group-item-action py-3 "
              >
                {t("admin.users.title")}
              </Link>
              <Link
                to="/admin/news"
                className="list-group-item list-group-item-action py-3 "
              >
                {t("admin.news.title")}
              </Link>
              <Link
                to="/admin/tags"
                className="list-group-item list-group-item-action py-3 "
              >
                {t("admin.tags.title")}
              </Link>
              <Link
                to="/admin/setting"
                className="list-group-item list-group-item-action py-3 "
              >
                {t("admin.settings")}
              </Link>
            </div>
          </div>

          <div className="col-10 p-4 bg-success-subtle">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
