import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({
  isOpen,
  menuRef,
  onClose,
  user,
  titleController,
  useTranslation,
}) => {
  const { t, i18n } = useTranslation();
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = user ? `${user.firstName} ${user.lastName}` : null;

  useEffect(() => {
    async function loadTitles() {
      const data = await titleController.getAllTitles();
      setTitles(data);
      setLoading(false);
    }
    loadTitles();
  }, [titleController]);

  const handleItemClick = () => {
    onClose(false);
  };

  if (loading) return <div>Đang tải menu...</div>;

  return (
    <nav ref={menuRef} className={`menu ${isOpen ? "active" : ""}`}>
      <div className="menu-container">
        <div className="menu-header d-flex justify-content-between py-3 px-4 align-items-center">
          <Link
            to={"/account/login"}
            className="header-icon-group text-reset d-flex text-decoration-none py-1 px-2 menu-hover"
          >
            <div className="header-icon align-content-center me-2">
              <i className="bi bi-person fs-3 border px-1"></i>
            </div>
            {user ? (
              <div className="lh-sm d-flex align-items-center ms-1">
                <p className="fw-bold fs-6 m-0">{fullName}</p>
              </div>
            ) : (
              <div className="lh-sm">
                <p className="mb-1 fs-6">{t("system.account")}</p>
                <span className="fw-bold fs-6">{t("system.login")}</span>
              </div>
            )}
          </Link>
          <button
            className="btn border rounded-circle px-1 py-0 h-50"
            onClick={() => onClose(false)}
          >
            <i className="bi bi-x fs-4"></i>
          </button>
        </div>
        <div className="menu-content">
          <ul className="menu-list">
            <li>
              <Link
                to="/products/all"
                onClick={handleItemClick}
                className="menu-hover"
              >
                <span className="fw-medium">{t("product.product_all")}</span>
              </Link>
            </li>
            {Array.isArray(titles) && titles.length > 0 ? (
              titles.map((title, index) => (
                <li key={index} className="dropdown-submenu">
                  <Link
                    to={`/products/${title.path}`}
                    className="d-flex justify-content-between menu-hover"
                    aria-haspopup="true"
                    aria-expanded={
                      title.subTitles?.length > 0 ? "false" : undefined
                    }
                  >
                    <span className="fw-medium">{title.name}</span>
                    {title.subTitles?.length > 0 && (
                      <i className="bi bi-caret-right-fill d-flex align-items-center"></i>
                    )}
                  </Link>
                  {title.subTitles?.length > 0 && (
                    <ul className="menu-list">
                      {title.subTitles.map((subTitle, index) => (
                        <li key={index} className="menu-hover">
                          <Link
                            to={`/products/${title.path}/${subTitle.value}`}
                            onClick={handleItemClick}
                          >
                            {subTitle.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))
            ) : (
              <li>Không có danh mục để hiển thị.</li>
            )}
          </ul>
          <ul className="menu-list">
            <li>
              <Link
                to="/introduce"
                onClick={handleItemClick}
                className="menu-hover"
              >
                Giới thiệu
              </Link>
            </li>
            <li className="dropdown-submenu">
              <Link
                to="#"
                title="Thực phẩm tươi sống"
                className="d-flex justify-content-between menu-hover"
              >
                <span>Khuyến mãi</span>
                <i className="bi bi-caret-right-fill d-flex align-items-center"></i>
              </Link>
              <ul className="menu-list">
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    Flash Sale 1 khung giờ
                  </Link>
                </li>
                <li className="menu-hover">
                  <Link to="#" onClick={handleItemClick}>
                    Flash Sale nhiều khung giờ
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/news" onClick={handleItemClick} className="menu-hover">
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                to="/check-order"
                onClick={handleItemClick}
                className="menu-hover"
              >
                Kiểm tra đơn hàng
              </Link>
            </li>
            <li>
              <Link to="#" onClick={handleItemClick} className="menu-hover">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-footer row mx-0 border-top pt-2">
          <div className="col-6 py-4 menu-hover">
            <i className="bi bi-shop border p-2"></i>
            <span className="ps-2">Hệ thống cửa hàng</span>
          </div>
          <div className="col-6 py-4 menu-hover">
            <i className="bi bi-telephone-outbound border p-2"></i>
            <span className="ps-2">Holine: 0999999998</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
