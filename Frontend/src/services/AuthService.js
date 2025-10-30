import api from './api';
import UserModel from '../models/UserModel.js';

class AuthService {
  constructor() {
    this.userModel = new UserModel();
  }

  async register(newUser) {
    try {
      const response = await api.post('/auth/register', newUser);
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.userModel.setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại.',
        status: error.response?.status || 500,
      };
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.userModel.setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại.',
        status: error.response?.status || 500,
      };
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return { success: false, message: 'Không có refresh token' };
      }
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return { success: true, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể làm mới token',
        status: error.response?.status || 500,
      };
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await api.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.userModel.clearCurrentUser();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Đăng xuất thất bại' };
    }
  }

  async getCurrentUser() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.user;
      this.userModel.setCurrentUser(user);
      return user;
    } catch (error) {
      if (error.response?.data?.expired) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          return await this.getCurrentUser(); // Thử lại với token mới
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.userModel.clearCurrentUser();
      return null;
    }
  }

  isAuthenticated() {
    return !!this.userModel.getCurrentUser();
  }

  async getOrders() {
    try {
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data.orders;
    } catch (error) {
      if (error.response?.data?.expired) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          const retryResponse = await api.get('/orders', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });
          return retryResponse.data.orders;
        }
        throw new Error('Phiên đăng nhập hết hạn.');
      }
      throw new Error(error.response?.data?.message || 'Không thể tải đơn hàng.');
    }
  }

  async getAddressCount() {
    try {
      const response = await api.get('/addresses');
      return response.data.addresses.length;
    } catch (error) {
      console.error('Lỗi lấy số địa chỉ:', error.response?.data || error.message);
      return 0;
    }
  }
}

export default AuthService;