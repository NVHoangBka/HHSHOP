import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Select from "react-select";

const Store = () => {
  const [t] = useTranslation();
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  const storeOptions = [
    {
      value: "thanhhoa",
      label: "Chi nhánh Thanh Hoá",
      address: "91 Lê Hoàn, P. Lam Sơn, TP Thanh Hoá",
      phoneNumber: "1900 8686",
      map: "https://www.google.com/maps?q=91+Lê+Hoàn+Thanh+Hóa&output=embed",
    },
    {
      value: "hanoi",
      label: "Chi nhánh Hà Nội",
      address: "1 Tràng Tiền, Hoàn Kiếm, Hà Nội",
      phoneNumber: "1900 8686",
      map: "https://www.google.com/maps?q=1+Tràng+Tiền+Hà+Nội&output=embed",
    },
    {
      value: "hcm",
      label: "Chi nhánh Hồ Chí Minh",
      address: "135 Nguyễn Huệ, Quận 1, TP Hồ Chí Minh",
      phoneNumber: "1900 8686",
      map: "https://www.google.com/maps?q=135+Nguyễn+Huệ+Quận+1+HCM&output=embed",
    },
    {
      value: "danang",
      label: "Chi nhánh Đà Nẵng",
      address: "254 Bạch Đằng, Hải Châu, Đà Nẵng",
      phoneNumber: "1900 8686",
      map: "https://www.google.com/maps?q=254+Bạch+Đằng+Đà+Nẵng&output=embed",
    },
  ];

  useEffect(() => {
    setSelectedStore(storeOptions[0]);
  }, []);

  const displayStores = selectedInput
    ? storeOptions.filter((s) => s.value === selectedStore.value)
    : storeOptions;

  return (
    <div className="bg-success-subtle">
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb pt-md-2 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("header.home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("header.home")}
              </Link>
              <span className="mx-1">&nbsp;/&nbsp;</span>
            </li>

            <li>
              <span className="text-secondary">{t("menu.storeSystem")}</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="section main-page pb-xl-5 pb-md-3">
        <div className="container">
          <h2 className="fw-semibold text-center mb-lg-4 mb-md-3">
            {t("menu.storeSystem")}
          </h2>

          <div className="mb-xl-5 mb-md-3 px-xl-4 px-md-3 pt-xl-2 pt-md-2 pb-xl-4 pb-md-3">
            <div className="row pt-lg-4 align-items-stretch">
              {/* STORE LIST */}
              <div
                className="bg-white col-lg-4 col-md-6 col-12 py-lg-4 py-md-3 px-md-3 overflow-auto border border-secondary rounded"
                style={{
                  maxHeight: window.innerWidth >= 992 ? "820px" : "320px",
                }}
              >
                <h5 className="fw-semibold mb-lg-3 mb-2">
                  {t("info.store.search")}
                </h5>

                {/* SEARCH */}
                <div>
                  <label>{t("info.store.selectStore")}</label>

                  <Select
                    options={storeOptions}
                    placeholder="Chọn hoặc nhập chi nhánh"
                    isSearchable
                    onChange={(store) => {
                      setSelectedStore(store);
                      setSelectedInput(store);
                    }}
                  />
                </div>

                {/* STORE LIST */}
                <div className="my-lg-4 my-md-3">
                  {displayStores.map((s) => (
                    <div
                      key={s.value}
                      className={`border rounded py-lg-3 py-md-2 px-lg-3 px-md-2 my-md-2 cursor-pointer ${
                        selectedStore?.value === s.value
                          ? "border-success shadow"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedStore(s)}
                    >
                      <h6 className="fw-semibold">{s.label}</h6>

                      <div className="address mt-1 ms-2">
                        <i className="bi bi-geo-alt text-secondary"></i>

                        <span className="ms-1">{s.address}</span>
                      </div>

                      <div className="phone-number mt-1 ms-2">
                        <i className="bi bi-telephone-forward-fill text-secondary"></i>

                        <span className="fw-semibold ms-1">
                          {s.phoneNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAP */}
              <div className="col-lg-8 col-md-6 col-12 mt-3 mt-md-0">
                <div className="ratio ratio-1x1 rounded overflow-hidden shadow-lg">
                  <iframe
                    src={
                      selectedStore?.map ||
                      "https://www.google.com/maps?q=Việt+Nam&output=embed"
                    }
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store Map"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;
