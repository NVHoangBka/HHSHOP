import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminSetup = ({ adminController }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminController.getSettingsAllAdmin();
      if (res.success) setSettings(res.settings || []);
    } catch (err) {
      showToast("Lỗi tải settings", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleUpdate = async (key, value, file = null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("mainImage", file); // hoặc galleryImages tùy loại
      } else {
        formData.append("value", value);
      }

      const res = await adminController.updateSettingAdmin(key, formData);
      if (res.success) {
        showToast("Cập nhật thành công", "success");
        loadSettings();
      }
    } catch (err) {
      showToast("Cập nhật thất bại: " + err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) handleUpdate(key, null, file);
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-success mb-4">Cài đặt chung (Setup)</h2>

      {toast.show && (
        <div
          className={`alert alert-${toast.type} position-fixed top-0 end-0 m-4 shadow-lg`}
        >
          {toast.message}
          <button
            className="btn-close float-end"
            onClick={() => setToast({ show: false })}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="card shadow">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Giá trị hiện tại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((s) => (
                  <tr key={s.key}>
                    <td>
                      <strong>{s.key}</strong>
                    </td>
                    <td>
                      {s.type === "image" ? (
                        <img
                          src={s.value}
                          alt={s.key}
                          style={{ maxHeight: "80px" }}
                        />
                      ) : s.type === "array_image" ? (
                        <div className="d-flex flex-wrap gap-2">
                          {JSON.parse(s.value || "[]").map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="banner"
                              style={{ maxHeight: "80px" }}
                            />
                          ))}
                        </div>
                      ) : (
                        s.value
                      )}
                    </td>
                    <td>
                      {s.type === "image" || s.type === "array_image" ? (
                        <input
                          type="file"
                          accept="image/*"
                          multiple={s.type === "array_image"}
                          onChange={(e) => handleFileChange(s.key, e)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue={s.value}
                          onBlur={(e) => handleUpdate(s.key, e.target.value)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetup;
