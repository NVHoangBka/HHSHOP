import React, { useEffect, useState } from "react";
import AdminRouter from "../../routers/AdminRouter/AdminRouter";
import AdminController from "../../controllers/AdminController";
import ToastMessage from "../client/components/ToastMessage/ToastMessage";

const adminController = new AdminController();
const AppAdmin = () => {
  // const adminController = useRef(new AdminController()).current;
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      if (isLoggedIn) {
        const user = await adminController.getCurrentAdmin();
        setIsAuthenticatedAdmin(!!user);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const onLoginAdmin = async (email, password) => {
    const result = await adminController.loginAdmin(email, password);
    if (result.success) {
      setIsAuthenticatedAdmin(true);
      return true;
    } else {
      setIsAuthenticatedAdmin(false);
      return false;
    }
  };

  const onLogoutAdmin = async () => {
    const result = await adminController.logoutAdmin();
    if (result.success) {
      setIsAuthenticatedAdmin(false);
      window.location.href = "/admin/login";
    }
  };

  // HIỂN THỊ LOADING KHI ĐANG KIỂM TRA TOKEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <AdminRouter
        onLoginAdmin={onLoginAdmin}
        onLogoutAdmin={onLogoutAdmin}
        adminController={adminController}
        isAuthenticatedAdmin={isAuthenticatedAdmin}
      />

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
