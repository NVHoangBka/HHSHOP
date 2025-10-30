import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderController from '../../controllers/OrderController';
import ProductController from '../../controllers/ProductController'; 
// import AuthController from '../../controllers/AuthController';


const orderController = new OrderController();


const AdminDashboard = (isAuthenticated, onLogin, authController , productController) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        // Kiểm tra vai trò admin (giả định authController)
        const user = await authController.getCurrentUser();
        if (!user || user.role !== 'admin') {
          throw new Error('Bạn không có quyền truy cập trang admin.');
        }

        // Lấy danh sách đơn hàng
        const orderResult = await orderController.getOrders();
        if (orderResult.success) {
          setOrders(orderResult.orders || []);
        } else {
          throw new Error(orderResult.message);
        }

        // Lấy danh sách sản phẩm (giả định ProductController)
        const productResult = await ProductController.getProductsAll();
        if (productResult.success) {
          setProducts(productResult.products || []);
        } else {
          throw new Error(productResult.message);
        }
      } catch (error) {
        console.error('AdminDashboard fetch error:', error);
        setError(error.message || 'Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [authController]);

  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="fs-3 fw-semibold mb-3">Bảng điều khiển Admin</h1>

      {/* Tổng quan */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-light text-center p-3">
            <h5>Số lượng đơn hàng</h5>
            <p className="fs-4">{orders.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light text-center p-3">
            <h5>Số lượng sản phẩm</h5>
            <p className="fs-4">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Quản lý đơn hàng */}
      <div className="mb-4">
        <h2 className="fs-4 fw-semibold">Danh sách đơn hàng</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày</th>
                <th>Địa chỉ</th>
                <th>Giá trị</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>{order.address}</td>
                  <td>{order.total.toLocaleString('vi-VN')} VNĐ</td>
                  <td>
                    {{
                      'pending': 'Đang xử lý',
                      'shipped': 'Đã giao',
                      'canceled': 'Đã hủy',
                    }[order.status] || 'Không xác định'}
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order.orderId}`} className="btn btn-primary btn-sm me-2">
                      Chi tiết
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUpdateStatus(order.orderId)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quản lý sản phẩm */}
      <div>
        <h2 className="fs-4 fw-semibold">Danh sách sản phẩm</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Giá giảm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id.toString()}>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{product.discountPrice ? product.discountPrice.toLocaleString('vi-VN') : 'N/A'} VNĐ</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEditProduct(product._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success" onClick={handleAddProduct}>
            Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );

  // Hàm xử lý (giả định, cần triển khai)
  const handleUpdateStatus = (orderId) => {
    console.log('Cập nhật trạng thái cho order:', orderId);
    // TODO: Thêm logic cập nhật status (ví dụ: mở form modal)
  };

  const handleEditProduct = (productId) => {
    console.log('Sửa sản phẩm:', productId);
    // TODO: Thêm logic chỉnh sửa (ví dụ: điều hướng đến form edit)
  };

  const handleDeleteProduct = (productId) => {
    console.log('Xóa sản phẩm:', productId);
    // TODO: Thêm logic xóa sản phẩm
  };

  const handleAddProduct = () => {
    console.log('Thêm sản phẩm mới');
    // TODO: Thêm logic thêm sản phẩm (ví dụ: điều hướng đến form add)
  };
};

export default AdminDashboard;