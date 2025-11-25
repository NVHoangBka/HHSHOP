import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminRouter from "../../routers/AdminRouter/AdminRouter";
import ToastMessage from "../client/components/ToastMessage/ToastMessage";
import HeaderAdmin from "./components/HeaderAdmin";
import AdminController from "../../controllers/AdminController";

const adminController = new AdminController();

const AppAdmin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const onLogin = async (email, password) => {
    const result = await adminController.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      return true;
    } else {
      setIsAuthenticated(false);
      return false;
    }
  };

  const onLogout = async () => {
    const result = await adminController.logout();
    if (result.success) {
      setIsAuthenticated(false);
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
