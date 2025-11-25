import React, { useState } from "react";
import AdminRouter from "../../routers/AdminRouter/AdminRouter";
import ToastMessage from "../client/components/ToastMessage/ToastMessage";
import HeaderAdmin from "./components/HeaderAdmin";
import AdminController from "../../controllers/AdminController";

const adminController = new AdminController();

const AppAdmin = () => {
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const onLogin = async (email, password) => {
    const result = await adminController.login(email, password);
    if (result.success) {
      setIsAuthenticatedAdmin(true);
      return true;
    } else {
      setIsAuthenticatedAdmin(false);
      return false;
    }
  };

  const onLogout = async () => {
    const result = await adminController.logout();
    if (result.success) {
      setIsAuthenticatedAdmin(false);
    } else {
    }
  };
  return (
    <>
      <HeaderAdmin />
      <div className="">
        <AdminRouter
          onLogin={onLogin}
          onLogout={onLogout}
          adminController={adminController}
          isAuthenticatedAdmin={isAuthenticatedAdmin}
        />
      </div>
      <div className="toast-container position-fixed bottom-0 top-0 end-0">
        <ToastMessage
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </>
  );
};

export default AppAdmin;
