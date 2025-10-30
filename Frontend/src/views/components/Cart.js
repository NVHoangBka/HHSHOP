import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ isOpen, setIsCartOpen, cartController, cartItems: propCartItems, onCartChange }) => {
  const [cartItems, setCartItems] = useState(propCartItems || []);
  const [total, setTotal] = useState(cartController.getTotalPrice());

  // Đồng bộ state với props khi có thay đổi
  useEffect(() => {
    setCartItems(propCartItems || []);
    setTotal(cartController.getTotalPrice());
  }, [propCartItems, cartController]);

  const handleIncrease = (id) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem) {
      const updatedCart = cartController.updateQuantity(id, currentItem.quantity + 1);
      setCartItems([...updatedCart]);
      setTotal(cartController.getTotalPrice());
      onCartChange(updatedCart);
    }
  };

  const handleDecrease = (id) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem && currentItem.quantity > 1) {
      const updatedCart = cartController.updateQuantity(id, currentItem.quantity - 1);
      setCartItems([...updatedCart]);
      setTotal(cartController.getTotalPrice());
      onCartChange(updatedCart);
    }
  };

  const handleRemove = (id) => {
    const updatedCart = cartController.removeFromCart(id);
    setCartItems([...updatedCart]);
    setTotal(cartController.getTotalPrice());
    onCartChange(updatedCart);
  };

  return (
    <div className={`cart ${isOpen ? 'active' : ''}`}>
      <div className="card-body">
        <div className='cart-header d-flex justify-content-between align-items-center border-bottom'>
          <h2 className="card-title text-black pb-3 pt-4 px-4">Giỏ hàng</h2>
          <button className='btn border rounded-circle px-2 py-0' onClick={() => setIsCartOpen(false)}><i className="bi bi-x fs-4"></i></button>
        </div>

        <div className='cart-content px-4 py-3'>
          {cartItems.length === 0 ? (
            <div className='cart-empty'>
              <div className='text-black text-center'>
                <img src='https://bizweb.dktcdn.net/100/518/448/themes/953339/assets/cart_empty_background.png?1733201190476' alt=''/>
                <h2 className="font-bold">Giỏ hàng chưa có gì!</h2>
                <p>Hãy tìm sản phẩm ứng ý và thêm vào giỏ hàng bạn nhé</p>
                <Link className="btn font-bold bg-success text-white rounded-pill" to="/products/all" title="Tiếp tục mua sắm">Tiếp tục mua sắm</Link>
              </div>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id}>
                <div className='cart-left p-4 overflow-y-auto flex flex-col'>
                  <div className='cart-table'>
                    <div className='cart-items'>
                      <div className='cart-item'>
                        <div className='cart-product-col d-flex justify-content-between align-items-start'>
                          <Link className='cart-item__image' to={`/products/${item.id}`} title={item.name}>
                            <img 
                              src={item.image || 'https://via.placeholder.com/60'} // Hiển thị placeholder nếu không có image
                              className='me-2 rounded'
                              alt={item.name}
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                          </Link>
                          <div>
                            <p className='cart-item__name mb-0 fw-semibold small'>
                              <Link to={`/products/${item.id}`} title={item.name} className="link text-decoration-none text-dark">{item.name}</Link>
                            </p>
                            <span className="cart-item__variant text-muted">{item.size || 'Default'}</span>
                          </div>
                          <button
                            className="btn btn-sm px-2 rounded-circle text-muted"
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                        
                        <div className="px-3 ms-5 d-flex justify-content-between cart-quantity-col">
                          <div className="cart-unit-price-col">
                            <div className="price text-danger fw-bold">
                              {((item.discountPrice || item.price) * item.quantity).toLocaleString("vi-VN")}₫
                            </div>
                          </div>
                          <div className="input-group custom-number-input cart-item-quantity d-flex border rounded row" style={{ maxWidth: "100px", height: "28px" }}>
                            <button 
                              type="button" 
                              name="minus" 
                              className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                              onClick={() => handleDecrease(item.id)}
                            >
                              <i className="bi bi-dash fs-5"></i>
                            </button>
                            <input 
                              type="number" 
                              className="form-quantity col-6 text-center no-spinner border-0" 
                              name="Lines" 
                              data-line-index="1" 
                              value={item.quantity || 1} 
                              min="1" 
                              readOnly
                            />
                            <button 
                              type="button" 
                              name="plus" 
                              className="col-3 d-flex justify-content-center align-items-center btn-outline-secondary border-0"
                              onClick={() => handleIncrease(item.id)}
                            >
                              <i className="bi bi-plus fs-5"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='cart-right'></div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer p-4 border-top">
            <div className="d-flex justify-content-between">
              <strong>Tổng cộng:</strong>
              <span className="text-danger fw-bold">{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <Link to="/cart" className="btn btn-success w-100 mt-3">Xem giỏ hàng</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;