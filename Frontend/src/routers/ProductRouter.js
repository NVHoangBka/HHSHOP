// src/routers/ProductRouter.js
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProductDetail from "../views/components/ProductDetail";
import Product from "../views/pages/Product";
import ProductController from "../controllers/ProductController";
import SearchResults from "../views/pages/SearchResults";
import TitleController from "../controllers/TitleController";

const productController = new ProductController();
const titleController = new TitleController();

const ProductRouter = ({ isAuthenticated, addToCart }) => {
  const [paths, setPaths] = useState(["all"]);
  const [loading, setLoading] = useState(true);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    async function loadPaths() {
      try {
        const products = await productController.getAllProducts();
        const uniqueTitles = [
          ...new Set(products.map((p) => p.titles[0]).filter(Boolean)),
        ];
        setPaths(["all", ...uniqueTitles]);
      } catch (error) {
        console.error("Lỗi tải paths:", error);
        setPaths(["all"]);
      } finally {
        setLoading(false);
      }
    }
    loadPaths();
  }, []);

  if (loading) {
    return <div>Đang tải danh mục...</div>; // Hoặc spinner
  }

  return (
    <Routes>
      {paths.map((path) => (
        <Route
          key={path}
          path={`/${path}/:subTitlePath?`}
          element={
            <Product
              addToCart={addToCart}
              path={path}
              productController={productController}
            />
          }
        />
      ))}

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail
              addToCart={addToCart}
              productController={productController}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <SearchResults
            productController={productController}
            titleController={titleController}
          />
        }
      />
    </Routes>
  );
};

export default ProductRouter;
