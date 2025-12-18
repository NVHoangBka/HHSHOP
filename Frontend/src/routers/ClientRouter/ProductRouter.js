// src/routers/ProductRouter.js
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// =====VIEWS======
import ProductDetail from "../../views/client/pages/ProductDetailPage/ProductDetail";
import Product from "../../views/client/pages/ProductPage/Product";
import SearchResults from "../../views/client/pages/SearchResultsPage/SearchResults";

const ProductRouter = ({ addToCart, productController, titleController }) => {
  const [paths, setPaths] = useState(["all"]);
  const [loading, setLoading] = useState(true);

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
  }, [productController]);

  if (loading) {
    return <div>Đang tải danh mục...</div>; // Hoặc spinner
  }

  return (
    <Routes>
      {paths.map((path, index) => (
        <Route
          key={index}
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
        path={`/slug/:slug`}
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
