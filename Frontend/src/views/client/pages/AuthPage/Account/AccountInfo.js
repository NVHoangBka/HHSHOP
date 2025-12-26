import React from "react";
import { useTranslation } from "react-i18next";

const AccountInfo = ({ currentUser }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="fs-3 fw-semibold mb-xl-3">{t("account.info.title")}</h1>
      <div className="form-signup name-account ps-xl-4">
        <p className="fs-6">
          <span className="fw-semibold">{t("account.info.full-name")}:</span>{" "}
          {currentUser.firstName} {currentUser.lastName}
        </p>
        <p className="fs-6">
          <span className="fw-semibold">Email:</span> {currentUser.email}
        </p>
        <p className="fs-6">
          <span className="fw-semibold">{t("account.info.phone")}:</span>{" "}
          {currentUser.phoneNumber || ""}
        </p>
      </div>
    </div>
  );
};

export default AccountInfo;
