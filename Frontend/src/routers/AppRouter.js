import React from "react";
import { Routes, Route } from "react-router-dom";

import AppAdmin from "../views/admin/AppAdmin";
import AppClient from "../views/client/AppClient";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AppAdmin />} />
      <Route path="/*" element={<AppClient />} />
    </Routes>
  );
};

export default AppRouter;
