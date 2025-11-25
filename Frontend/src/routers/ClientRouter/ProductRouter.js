// src/routers/ProductRouter.js
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// =====VIEWS======
import ProductDetail from "../../views/client/pages/ProductDetailPage/ProductDetail";
import Product from "../../views/client/pages/ProductPage/Product";
import SearchResults from "../../views/client/pages/SearchResultsPage/SearchResults";

const ProductRouter = ({
  isAuthenticated,
  addToCart,
  productController,
  titleController,
}) => {
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
              titleController={titleController}
            />
          }
        />
      ))}

      <Route
        path={`/:id`}
        element={
          <ProductDetail
            addToCart={addToCart}
            productController={productController}
          />
        }
      />
      <Route
        path="/search"
        element={
          <SearchResults
            productController={productController}
            titleController={titleController}
            addToCart={addToCart}
          />
        }
      />
    </Routes>
  );
};

export default ProductRouter;
