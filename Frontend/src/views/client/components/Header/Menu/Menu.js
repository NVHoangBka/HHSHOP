import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";

const Menu = ({ menuRef, onClose, titleController }) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>{t("menu.loading")}</div>;

  return (
    <nav ref={menuRef} className="h-100">
      <div className="menu-container">
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
        <div className="menu-footer row mx-xl-0 border-top pt-xl-2">
          <div className="col-xl-6 py-xl-4 menu-hover">
            <i className="bi bi-shop border p-xl-2"></i>
            <span className="ps-2">Hệ thống cửa hàng</span>
          </div>
          <div className="col-xl-6 py-xl-4 menu-hover">
            <i className="bi bi-telephone-outbound border p-xl-2"></i>
            <span className="ps-xl-2">Holine: 0999999998</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
