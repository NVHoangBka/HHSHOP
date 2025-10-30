import React from 'react';
import { Link } from 'react-router-dom';

const Search = ({ isOpen, setIsSearchOpen }) => {
  const handleItemClick = () => {
    setIsSearchOpen(false);
  };

  return (
    <nav className={`search ${isOpen ? 'active' : ''}`}>
      <div className='container text-black'>
        <div className='mt-3'>
          <div className='search-header d-flex align-items-center'>
            <Link to='#' onClick={handleItemClick}>
              <i className="bi bi-arrow-left fs-4"></i>
            </Link>
            <h4 className='fw-bold m-0 px-3 fs-3'>Tìm Kiếm</h4>
          </div>
          <div className='search-bar'>
            <quick-search className="quick-search">
              <form action="/search" method='get'>
                <div className="input-group my-3">
                  <select className="form-select border-success py-2 ps-4 rounded-pill" id="inputGroupSelect02">
                    <option selected>Danh mục sản phẩm</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div className="input-group my-3">
                  <input type="text" className="form-control py-2 ps-4 rounded-start-pill" placeholder="Tìm theo sản phẩm" aria-label="Tìm theo sản phẩm" aria-describedby="btn-search"/>
                  <button className="btn btn-outline-secondary rounded-end-circle bg-success d-flex align-items-center" type="submit" id="btn-search">
                    <i className="bi bi-search text-white"></i>
                  </button>
                </div>
              </form>
              <div className='search-dropdown'>
                <div className='search-loading'></div>
                <div className='search-result'></div>
                <div className='search-history-list'></div>
                <div className='search-keywords pt-2 px-2'>
                  <span className="text-success font-semibold mx-2">Từ khóa phổ biến</span>
                  <div className='search-keyword-list mt-2'>
                    <Link className='search-keyword' to="#" onClick={handleItemClick}>Nước giặt</Link>
                    <Link className='search-keyword' to="#" onClick={handleItemClick}>Nước giặt</Link>
                    <Link className='search-keyword' to="#" onClick={handleItemClick}>Nước giặt</Link>
                  </div> 
                </div>
              </div>
            </quick-search>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Search;