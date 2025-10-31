import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductItem from '../components/ProductItem';
import ProductController from '../../controllers/ProductController';
import TitleController from '../../controllers/TitleController';

const productController = new ProductController();
const titleController = new TitleController();

const Product = ({ path, addToCart }) => {
    const params = useParams();
    const fullPath = params['*'];
    const [titlePath, subTitlePath] = fullPath ? fullPath.split('/') : [path, null];
    const [titlePathCover, setTitlePathConver] = useState();
    const [activeTab, setActiveTab] = useState(path|| 'all');
    const [title, setTitle] = useState();
    const [titlesLoaded, setTitlesLoaded] = useState(false);

    // state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        price: null,
        brand: [],
        type: [],
        color: [],
    });

    // TẢI DANH MỤC TRƯỚC
    useEffect(() => {
        async function loadTitles() {
        await titleController.getAllTitles(); // TẢI VÀO BỘ NHỚ
        setTitlesLoaded(true);
        }
        loadTitles();
    }, []);

   // === 1. CẬP NHẬT TITLE + activeTab ===
    useEffect(() => {
        if (titlePath !== 'all') {
            setActiveTab(titlePath);
            const titleObj = titleController.getTitlesByPath(titlePath)[0];
            const titleName = titleObj?.name || titlePath;
            // Nếu có subcategory thì hiển thị song song
            if (subTitlePath) {
                const subTitleObj = titleController.getSubTitlesByPath(titlePath, subTitlePath);
                const subTitleName = subTitleObj?.name || subTitlePath;
                setTitlePathConver(`${titleName} / ${subTitleName}`);
                setTitle(subTitleName);
            } else {
                setTitlePathConver(titleName);
                setTitle(titleName);
            }
        }
        else {
            setActiveTab('all');
            setTitle('Tất cả sản phẩm');
            setTitlePathConver('Tất cả sản phẩm');
        }
    }, [titlePath, subTitlePath]);

    const resetAllFilters = () => {
        setFilters({
            price: null,
            brand: [],
            type: [],
            color: [],
        });
        
       // Bỏ tích tất cả checkbox & radio
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
    };


    // Hàm thay đổi filter
    const handleFilterChange = (key, e) => {
        const { type, checked, value } = e.target;
        const label = e.target.getAttribute('data-value');

        setFilters((prev) => {
            let updated = { ...prev };

            if (type === 'checkbox') {
                // --- Checkbox: có thể chọn nhiều ---
                if (checked) {
                    // 🔒 Kiểm tra trùng trước khi push
                    const exist = updated[key]?.some((item) => item.value === value);
                    if (!exist) {
                    updated[key] = [...(updated[key] || []), { value, label }];
                    }
                } else {
                    updated[key] = (updated[key] || []).filter(
                    (item) => item.value !== value
                    );
                }

                if (updated[key].length === 0) delete updated[key];
            }

            if (type === 'radio') {
                // --- Radio: chỉ chọn 1 ---
                updated[key] = [{ value, label }];
            }

            return updated;
        });
    };

    const removeFilterItem = (key, value) => {
        setFilters((prev) => {
            const updated = { ...prev };
            updated[key] = updated[key].filter((item) => item.value !== value);
            if (updated[key].length === 0) delete updated[key];
            return updated;
        });

        // Bỏ tích / bỏ chọn input tương ứng
        const input = document.querySelector(
            `input[name="${key}"][value="${value}"]`
        );
        if (input) input.checked = false;
    };

    // Áp dụng filter khi filters thay đổi
    useEffect(() => {
        let isMounted = true;

        async function loadAndFilter() {
            setLoading(true);
            try {
                // B1: Lấy danh sách sản phẩm (await)
                let products = activeTab === 'all'
                ? await productController.getAllProducts()
                : await productController.getProductsByTitle(activeTab);

                // B2: Lọc theo subTitle (nếu có)
                if (subTitlePath) {
                products = products.filter(p => p.subTitles?.includes(subTitlePath));
                }

                // B3: Áp dụng các filter
                if (filters.price?.length > 0) {
                const [min, max] = filters.price[0].value.split(':').map(v => v === 'max' ? Infinity : Number(v));
                products = products.filter(p =>
                    (p.price >= min && (max === Infinity || p.price <= max)) ||
                    (p.discountPrice >= min && (max === Infinity || p.discountPrice <= max))
                );
                }

                if (filters.brand?.length > 0) {
                const brands = filters.brand.map(b => b.value);
                products = products.filter(p => p.brands?.some(b => brands.includes(b)));
                }

                if (filters.type?.length > 0) {
                const types = filters.type.map(t => t.value);
                products = products.filter(p => p.types?.some(t => types.includes(t)));
                }

                if (filters.color?.length > 0) {
                const colors = filters.color.map(c => c.value);
                products = products.filter(p => p.colors?.some(c => colors.includes(c)));
                }

                if (filters.tag?.length > 0) {
                const tags = filters.tag.map(t => t.value);
                products = products.filter(p => p.tag?.some(t => tags.includes(t)));
                }

                if (isMounted) {
                setFilteredProducts(products);
                setCurrentPage(1);
                }
            } catch (error) {
                console.error('Lỗi tải sản phẩm:', error);
                if (isMounted) setFilteredProducts([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAndFilter();

        return () => { isMounted = false; };
    }, [activeTab, subTitlePath, filters]);

    // tính toán vị trí sản phẩm
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onColorChange = (e) => handleFilterChange('color', e);
    const onTypeChange = (e) => handleFilterChange('type', e);
    const onBrandChange = (e) => handleFilterChange('brand', e);
    const onPriceChange = (e) => handleFilterChange('price', e);
    const onTagChange = (e) => handleFilterChange('tag', e);

  return (
    <div className="product bg-success-subtle">
        <div className="container">
            <div className='breadcrumbs'>
                <ul className="breadcrumb py-3 flex flex-wrap items-center text-xs md:text-sm">
                    <li className="home">
                        <Link className="link hover" to="/" title="Trang chủ" style={{textDecoration: 'none', color: 'black'}}><span>Trang chủ</span></Link>
                        <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
                    </li>
                    <li>
                        <span style={{ color: '#BFBFBF' }}>{titlePathCover}</span>
                    </li>          
                </ul>
            </div>
            <section className="section section-collection-banner">
                <div className="collection_banner mb-5 md:mb-5  container text-center px-0">
                    <Link className="banner" to="#" title="Tất cả sản phẩm">
                        <picture>
                            <source media="(max-width: 767px)" srcset="//bizweb.dktcdn.net/thumb/large/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617"/>
                            <img className="object-contain mx-auto" src="https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/collection_main_banner.jpg?1758526220617" width="1432" height="120" alt="Tất cả sản phẩm" style={{height: 'auto', width: '100%'}}/>
                        </picture>
                    </Link>
                </div>
            </section>
            <section className='section grid w-100' id="product-list-0">
                <div className='row mx-0'>
                    <div className='col-9 content-product-left'>
                        <h2 className='text-success fs-1 fw-semibold'>{title}</h2>
                        <div className='d-left flex-row-reverse align-items-center mb-2'>                           
                            <div className="d-flex justify-content-end">
                                <button className="btn d-flex d-lg-none bg-white border align-items-center" type="button" data-toggle-facet="" hidden>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon w-4" viewBox="0 0 20 20" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.79166 6.45835C9.79166 5.53788 10.5379 4.79169 11.4583 4.79169C12.3788 4.79169 13.125 5.53788 13.125 6.45835C13.125 7.37883 12.3788 8.12502 11.4583 8.12502C10.5379 8.12502 9.79166 7.37883 9.79166 6.45835ZM8.60878 7.08335C8.89489 8.39384 10.062 9.37502 11.4583 9.37502C12.8546 9.37502 14.0218 8.39384 14.3079 7.08335H17.5C17.8452 7.08335 18.125 6.80353 18.125 6.45835C18.125 6.11317 17.8452 5.83335 17.5 5.83335H14.3079C14.0218 4.52286 12.8546 3.54169 11.4583 3.54169C10.062 3.54169 8.89489 4.52286 8.60878 5.83335H2.5C2.15482 5.83335 1.875 6.11317 1.875 6.45835C1.875 6.80353 2.15482 7.08335 2.5 7.08335H8.60878ZM4.79166 13.125C4.79166 12.2045 5.53786 11.4583 6.45833 11.4583C7.3788 11.4583 8.125 12.2045 8.125 13.125C8.125 14.0455 7.3788 14.7917 6.45833 14.7917C5.53786 14.7917 4.79166 14.0455 4.79166 13.125ZM6.45833 16.0417C5.06203 16.0417 3.8949 15.0605 3.60879 13.75H2.5C2.15482 13.75 1.875 13.4702 1.875 13.125C1.875 12.7798 2.15482 12.5 2.5 12.5H3.60879C3.8949 11.1895 5.06203 10.2083 6.45833 10.2083C7.85463 10.2083 9.02176 11.1895 9.30787 12.5H17.5C17.8452 12.5 18.125 12.7798 18.125 13.125C18.125 13.4702 17.8452 13.75 17.5 13.75H9.30787C9.02176 15.0605 7.85463 16.0417 6.45833 16.0417Z" fill="currentColor" fill-opacity="0.1"></path>
                                    </svg>
                                    Lọc
                                    <span className="filter-count w-5 h-5 md:w-6 md:h-6 inline-flex items-center justify-center bg-[#EE1926] text-white rounded-full  ml-1">0</span>
                                </button>
                                <div className="sort-mobile whitespace-nowrap d-flex align-items-center gap-2 ml-auto me-3">
                                    <label htmlFor="sort-mobile" className="labbel text-light-emphasis"> Sắp xếp </label>
                                    <sort-by data-collection="0">
                                        <select name="sort_by" id="sort-mobile" className="form-select  bg-white rounded-pill">
                                            <option value="manual">Mặc định</option>
                                            <option value="name:asc">Tên A → Z</option>
                                            <option value="name:desc">Tên Z → A</option>
                                            <option value="price_min:asc">Giá tăng dần</option>
                                            <option value="price_min:desc">Giá giảm dần</option>
                                            <option value="created_on:desc">Mới nhất</option>
                                            <option value="created_on:asc">Cũ nhất</option>
                                        </select>
                                    </sort-by>
                                </div>
                            </div>
                            <div className="filter-items w-100 d-flex flex-wrap mb-3">
                                {Object.entries(filters || {}).flatMap(([key, items]) =>
                                    Array.isArray(items)
                                        ? items.map((item) => (
                                            <div
                                            key={`${key}-${item.value}`}
                                            className="filter-item bg-white d-flex fw-semibold items-center justify-content-center border rounded-1 py-1 px-3 relative cursor-pointer link mx-1 hover"
                                            >
                                            {item.label}
                                            <span
                                                className="js-remove-filter cursor-pointer"
                                                onClick={() => removeFilterItem(key, item.value)}
                                            >
                                                <i className="bi bi-x"></i>
                                            </span>
                                            </div>
                                        ))
                                        : [] // 👈 nếu items = null hoặc không phải mảng thì bỏ qua
                                )}

                                 {/* Nút reset tất cả */}
                                {Object.values(filters).some(v => Array.isArray(v) && v.length > 0) && (
                                    <div
                                        className="filter-item text-danger border rounded-1 py-1 px-3 mx-1 my-1 cursor-pointer"
                                        onClick={resetAllFilters}
                                    >
                                        Xóa tất cả
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='product-list grid me-2'>
                            <div className='product-items' style={{minHeight: '1200px'}}>
                                <div className='row'>
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((product) => (
                                            <div className='col-3 my-3' key={product.id}>
                                            <ProductItem product={product} addToCart={addToCart} />
                                            </div>
                                        ))
                                        ) : (
                                        <p className="text-center">Không có sản phẩm nào trong danh mục này.</p>
                                    )}
                                </div>

                            </div>
                            {/* phân trang */}
                            <div className="pagination d-flex justify-content-center my-4">
                                    {/* Nút mũi tên trái */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="btn bg-white mx-1"
                                    disabled={currentPage === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                {/* Nút số trang */}
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`btn bg-white mx-1 ${currentPage === index + 1 ? 'btn-outline-danger text-danger' : 'text-black'}`}
                                    >
                                    {index + 1}
                                    </button>
                                ))}

                                {/* Nút mũi tên phải */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="btn bg-white mx-1"
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 content-product-right pe-0'>
                        <facet-drawer data-collection="0">
                            <div className="collection-filter bg-white pb-5 rounded-3">
                                <div className="facet-inner overflow-auto bg-background  h-full px-2 z-10 relative ml-auto">
                                    <form className="facet-form">
                                        <div className="filter-container d-flex flex-column rounded-sm ps-4 pt-4 ">      
                                            {/* Giá */}   
                                            <aside className="aside-item filter-price py-2" style={{order: '4'}}>
                                                <div className="aside-title">
                                                <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                                                    Giá
                                                </h2>
                                                </div>
                                                <div className="aside-content filter-group">
                                                    <ul className="space-y-3 ps-0">
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input 
                                                                className="form-radio form-radio_md" 
                                                                name="price_min" type="radio" id="filter-lower-1000000" 
                                                                data-group="price" 
                                                                data-field="price_min" 
                                                                data-value="Giá dưới 1.000.000₫" 
                                                                value="0:1000000" data-operator="OR" 
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-lower-1000000">
                                                            Giá dưới 1.000.000₫
                                                            </label>
                                                        </li>                   
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input 
                                                                className="form-radio form-radio_md" 
                                                                name="price_min" type="radio" 
                                                                id="filter-1000000-2000000" 
                                                                data-group="price" data-field="price_min" data-value="1.000.000₫ - 2.000.000₫" 
                                                                value="1000000:2000000" 
                                                                data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-1000000-2000000">
                                                            1.000.000₫ - 2.000.000₫
                                                            </label>
                                                        </li>               
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input 
                                                                className="form-radio form-radio_md" name="price_min" type="radio" 
                                                                id="filter-2000000-3000000" data-group="price" data-field="price_min" data-value="2.000.000₫ - 3.000.000₫" 
                                                                value="2000000:3000000" data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-2000000-3000000">
                                                            2.000.000₫ - 3.000.000₫
                                                            </label>
                                                        </li>                
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input className="form-radio form-radio_md" name="price_min" type="radio" 
                                                                id="filter-3000000-5000000" data-group="price" data-field="price_min" data-value="3.000.000₫ - 5.000.000₫" 
                                                                value="3000000:5000000" data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-3000000-5000000">
                                                            3.000.000₫ - 5.000.000₫
                                                            </label>
                                                        </li>                  
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input className="form-radio form-radio_md" name="price_min" type="radio" 
                                                                id="filter-5000000-7000000" data-group="price" data-field="price_min" data-value="5.000.000₫ - 7.000.000₫" 
                                                                value="5000000:7000000" data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-5000000-7000000">
                                                            5.000.000₫ - 7.000.000₫
                                                            </label>
                                                        </li>                    
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input className="form-radio form-radio_md" name="price_min" type="radio" 
                                                                id="filter-7000000-10000000" 
                                                                data-group="price" data-field="price_min" data-value="7.000.000₫ - 10.000.000₫" 
                                                                value="7000000:10000000" data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-7000000-10000000">
                                                            7.000.000₫ - 10.000.000₫
                                                            </label>
                                                        </li>
                                                        <li className="filter-item filter-item--check-box link mb-1 d-flex align-items-center">
                                                            <input className="form-radio form-radio_md" name="price_min" type="radio" 
                                                                id="filter-upper-10000000" data-group="price" data-field="price_min" data-value="Giá trên 10.000.000₫" 
                                                                value="10000000:max" data-operator="OR"
                                                                onChange={onPriceChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-upper-10000000">
                                                            Giá trên 10.000.000₫
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </aside>
                                            {/* Hãng sản xuất */}
                                            <aside className="aside-item filter-vendor py-2" style={{order: '3'}}>
                                                <div className="aside-title">
                                                <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                                                    Hãng sản xuất
                                                </h2>
                                                </div>
                                                <div className="aside-content filter-group">
                                                    <ul className="space-y-3 ps-0">
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-vendor-minimart" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-value="Minimart" 
                                                                value="Minimart" data-operator="OR" name="vendor"
                                                                onChange={onBrandChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-vendor-minimart">
                                                                Minimart
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-vendor-ega" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-value="EGA" 
                                                                value="EGA" data-operator="OR" name="vendor"
                                                                onChange={onBrandChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-vendor-ega">
                                                                EGA
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-vendor-ega-green" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-value="EGA GREEN" 
                                                                value="EGA GREEN" data-operator="OR" name="vendor"
                                                                onChange={onBrandChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-vendor-ega-green">
                                                                EGA GREEN
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-vendor-khac" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-value="Khác" 
                                                                value="Khác" data-operator="OR" name="vendor"
                                                                onChange={onBrandChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-vendor-khac">
                                                                Khác
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </aside>
                                            {/*Loại sản phẩm  */}
                                            <aside className="aside-item filter-type py-2 " style={{order: '2'}}>
                                                <div className="aside-title">
                                                    <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                                                        Loại sản phẩm
                                                    </h2>
                                                </div>
                                                <div className="aside-content filter-group">
                                                    <ul className="space-y-3 ps-0">
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-lam-thom" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Làm thơm" 
                                                                value="Làm thơm" data-operator="OR" name="type" 
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-lam-thom">
                                                                Làm thơm
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-chat-tay-rua" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Chất tẩy rửa" 
                                                                value="Chất tẩy rửa" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-chat-tay-rua">
                                                                Chất tẩy rửa
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-do-dung-hoc-tap" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Đồ dùng học tập" 
                                                                value="Đồ dùng học tập" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-do-dung-hoc-tap">
                                                                Đồ dùng học tập
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-van-phong" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Văn phòng" 
                                                                value="Văn phòng" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-van-phong">
                                                                Văn phòng
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-nhap-khau" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Nhập khẩu"
                                                                value="Nhập khẩu" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-nhap-khau">
                                                                Nhập khẩu
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-nong-san-viet" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Nông sản Việt" 
                                                                value="Nông sản Việt" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-nong-san-viet">
                                                                Nông sản Việt
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-nhiet-doi" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Nhiệt đới" 
                                                                value="Nhiệt đới" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-nhiet-doi">
                                                                Nhiệt đới
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-thuc-pham-tuoi-song" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Thực phẩm tươi sống" 
                                                                value="Thực phẩm tươi sống" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-thuc-pham-tuoi-song">
                                                                Thực phẩm tươi sống
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md"
                                                                id="filter-type-thuc-pham" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Thực phẩm" 
                                                                value="Thực phẩm" data-operator="OR" name="type"
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-thuc-pham">
                                                                Thực phẩm
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-type-khac" data-group="PRODUCT_TYPE" data-field="type.filter_key" data-value="Khác" 
                                                                value="Khác" data-operator="OR" name="type"
                                                                
                                                                onChange={onTypeChange}/>
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-type-khac">
                                                                Khác
                                                            </label>
                                                        </li>  
                                                        <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 hover text-danger fw-bold">
                                                            Xem thêm <i className="bi bi-chevron-down"></i>
                                                        </li>
                                                                
                                                    </ul>
                                                </div>
                                            </aside>
                                            {/* Màu sắc */}
                                            <aside className="aside-item filter-tag1 py-2 " style={{order: '0'}}>
                                                <div className="aside-title">
                                                <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                                                    Màu sắc
                                                </h2>
                                                </div>
                                                <div className="aside-content filter-group">
                                                    <ul className="space-y-3 ps-0">
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-trang" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Trắng" value="white" 
                                                                    data-operator="OR" name="color" 
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-trang">Trắng</label>
                                                            </li>
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-den" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Đen" 
                                                                    value="black" data-operator="OR" name="color"
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-den">Đen</label>
                                                            </li>
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-hong" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Hồng" 
                                                                    value="pink" data-operator="OR" name="color"
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-hong">Hồng</label>
                                                            </li>
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-xam" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Xám"
                                                                    value="gray" data-operator="OR" name="color"
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-xam">Xám</label>
                                                            </li>
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-xanh" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Xanh" 
                                                                    value="blue" data-operator="OR" name="color"
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-xanh">Xanh</label>
                                                            </li>
                                                            <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                                <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                    id="filter-tag1-nau" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Nâu" 
                                                                    value="brown" data-operator="OR" name="color"
                                                                    onChange={onColorChange}/>
                                                                <label className="custom-checkbox cursor-pointer flex gap-2 items-center ms-2 fw-100" htmlFor="filter-tag1-nau">Nâu</label>
                                                            </li>

                                                            <li className="filter-item-toggle link text-secondary d-flex align-items-center ms-4 hover text-danger fw-bold">
                                                            Xem thêm <i className="bi bi-chevron-down"></i>
                                                            </li>
                                                                
                                                    </ul>
                                                </div>
                                            </aside>
                                            {/* Tag */}
                                            <aside className="aside-item filter-tag1 py-2" style={{order: '1'}}>
                                                <div className="aside-title">
                                                <h2 className="title-head mt-0 fw-semibold mb-3 fs-6">
                                                    Tags
                                                </h2>
                                                </div>
                                                <div className="aside-content filter-group">
                                                    <ul className="space-y-3 ps-0">    
                                                        <li className="filter-item link filter-item--check-box mb-1 d-flex align-items-center">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-tag1-flash-sale" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Flash Sale" 
                                                                value="Flash Sale" data-operator="OR" name="tag"
                                                                onChange={onTagChange}
                                                            />
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-tag1-flash-sale">
                                                                Flash Sale
                                                            </label>
                                                        </li>
                                                        <li className="filter-item link filter-item--check-box ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-tag1-giao-nhanh-24h" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Giao Nhanh 24h" 
                                                                value="Giao Nhanh 24h" data-operator="OR" name="tag"
                                                                onChange={onTagChange}
                                                            />
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-tag1-giao-nhanh-24h">
                                                                Giao Nhanh 24h
                                                            </label>
                                                        </li>  
                                                        <li className="filter-item link filter-item--check-box ">
                                                            <input type="checkbox" className="form-checkbox form-checkbox_md" 
                                                                id="filter-tag1-rau-tuoi" data-group="PRODUCT_TAG" data-field="tag.key" data-value="Rau Tươi" 
                                                                value="Rau Tươi" data-operator="OR" name="tag"
                                                                onChange={onTagChange}
                                                            />
                                                            <label className="custom-checkbox ms-2 fw-100" htmlFor="filter-tag1-rau-tuoi">
                                                                Rau Tươi
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </aside>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </facet-drawer>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default Product;