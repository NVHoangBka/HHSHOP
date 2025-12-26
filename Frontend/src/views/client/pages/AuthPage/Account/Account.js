import React, { useState, useEffect } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import AccountInfo from "./AccountInfo";
import OrderList from "./OrderList";
import ChangePassword from "./ChangePassword";
import AddressList from "./AddressList";
import { useTranslation } from "react-i18next";

const Account = ({ onLogin, authController, orderController }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    async function fetchUser() {
      const user = await authController.getCurrentUser();
      setLoading(false);
      if (!user) {
        navigate("/account/login");
        return;
      }
      setCurrentUser(user);

      const addressResult = await authController.getAddressCount(user._id);
      if (addressResult.success) {
        setAddressCount(addressResult.count);
      } else {
        console.error("Fetch address count error:", addressResult.message);
        setAddressCount(addressCount);
      }
    }
    fetchUser();
  }, [authController, navigate, addressCount]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setError("");
    try {
      await authController.logout();
      setTimeout(() => {
        window.location.href = "/account/login";
      }, 1000);
    } catch (err) {
      setError(t("system.logout.error"));
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">{t("system.loading")}</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-xl-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("header.home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("header.home")}
              </Link>
              <span className="mx-xl-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">
                {t("account.page-customer")}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <section className="section section-main-account">
        <div className="container">
          <div>
            <div className="row pb-xl-5">
              {/* Sidebar */}
              <div className="col-xl-2 border-end border-secondary-subtle">
                <div className="block-account">
                  <h5
                    className="title-account font-semibold fs-4"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {t("account.page")}
                  </h5>
                  <p>
                    Xin chào,{" "}
                    <span className="fw-semibold">
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    !
                  </p>
                  <ul className="space-y-3 mt-2 list-disc pl-4">
                    <li className="mt-2">
                      <NavLink
                        className={({ isActive }) =>
                          `title-info link fw-semibold text-decoration-none fs-7 ${
                            isActive ? "text-active" : "text-black text-hover"
                          }`
                        }
                        to="/account/info"
                      >
                        {t("account.info.title")}
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <NavLink
                        className={({ isActive }) =>
                          `title-info link fw-semibold text-decoration-none fs-7 ${
                            isActive ? "text-active" : "text-black text-hover"
                          }`
                        }
                        to="/account/orders"
                      >
                        {t("account.orders.title")}
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <NavLink
                        className={({ isActive }) =>
                          `title-info link fw-semibold text-decoration-none fs-7 ${
                            isActive ? "text-active" : "text-black text-hover"
                          }`
                        }
                        to="/account/changepassword"
                      >
                        {t("account.change-password.title")}
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <NavLink
                        className={({ isActive }) =>
                          `title-info link fw-semibold text-decoration-none fs-7 ${
                            isActive ? "text-active" : "text-black text-hover"
                          }`
                        }
                        to="/account/address"
                      >
                        {t("account.address.list")} ({addressCount})
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <button
                        className="title-info link fw-semibold text-danger fs-7 text-hover"
                        onClick={handleLogout}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                        }}
                      >
                        {t("system.logout.title")}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-10 mb-xl-6">
                <div className="bg-white px-xl-3 py-xl-4 rounded-4">
                  {error}
                  <Routes>
                    <Route
                      path="info"
                      element={<AccountInfo currentUser={currentUser} />}
                    />
                    <Route
                      path="orders"
                      element={
                        <OrderList
                          authController={authController}
                          orderController={orderController}
                        />
                      }
                    />
                    <Route
                      path="changepassword"
                      element={
                        <ChangePassword authController={authController} />
                      }
                    />
                    <Route
                      path="address"
                      element={<AddressList authController={authController} />}
                    />
                    {/* Default tab */}
                    <Route
                      index
                      element={<AccountInfo currentUser={currentUser} />}
                    />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
