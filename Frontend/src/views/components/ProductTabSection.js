import React, { useEffect, useState } from 'react';
import ProductController from '../../controllers/ProductController';
import ProductItem from './ProductItem';
import { Link } from 'react-router-dom';

const productController = new ProductController();

const ProductTabSection = ({path, title, addToCart }) => {
  // Lấy tất cả titles từ TitleModel
  // const titles = TitleModel.getTitlesByPath(path);
  const tabSets = {
    'Chăm sóc gia đình': [
      { label: 'Nước giặt quần áo', value: 'nuoc-giat' },
      { label: 'Nước lau nhà', value: 'nuoc-lau-nha' },
      { label: 'Xịt phòng, sáp thơm', value: 'sap-thom' }
    ],
    'Sản phẩm được quan tâm': [
      { label: 'Hot nhất hè này', value: 'hot' },
      { label: 'Săn deal sốc', value: 'san-deal' },
      { label: 'Đồng giá 9k', value: 'dong-gia-9k' }
    ],
    'Thực phẩm tươi sống': [
      { label: 'Rau củ', value: 'rau-cu' },
      { label: 'Hoa quả', value: 'hoa-quả' }
    ],
    'Văn phòng phẩm': [
      { label: 'Bút viết', value: 'but-viet' },
      { label: 'Giấy và sổ tay', value: 'giay-so-tay' },
      { label: 'Dụng cụ vẽ', value: 'dung-cu-ve' }
    ]
  };

  const tabs = tabSets[title] || [];
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let products;
        if (activeTab === 'sap-thom') {
          const allProducts = await productController.getAllProducts();
          products = allProducts.filter(product => 
            product.types.includes('sap-thom') || product.types.includes('xit-phong')
          ).slice(0, 5);
        } else {
          products = await productController.getProductsByType(activeTab);
          products = products.slice(0, 5);
        }
        setFilteredProducts(products);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <div className="section-product-tabs mt-5">
      <div className="container">
        <div className="heading-bar position-relative d-flex">
          <h2 className="w-auto mx-auto text-center position-relative z-2 bg-success-subtle d-inline px-3">
            <Link to="#" className="text-decoration-none fs-1 fw-semibold text-success">
              {title}
            </Link>
          </h2>
        </div>
        <div className="heading-tabs mx-5 mt-4 row justify-content-center">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`btn product-tab col-2 mx-3 ${activeTab === tab.value ? 'active' : 'bg-white border'} hover`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content mt-4">
          <div className="product-list row bg-white py-3 justify-content-center m-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                 <div className='col-2'>
                    <ProductItem key={product.id} product={product} addToCart={addToCart} productController = {productController}/>
                </div>
              ))
            ) : (
              <p className="text-center">Không có sản phẩm nào trong danh mục này.</p>
            )}
          </div>
          <Link 
            to={`/products/${path}`}
            alt="Xem thêm"  
            className="bg-white w-100 d-flex mt-4 p-2 justify-content-center text-decoration-none text-success hover rounded-2" 
          >
            Xem tất cả <i className="ms-1 bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductTabSection;