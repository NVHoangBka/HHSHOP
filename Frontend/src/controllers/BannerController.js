import BannerService from '../services/BannerService.js';

class BannerController {
  constructor() {
    this.bannerService = new BannerService();
  }

  getAllBanners() {
    try {
      const banners = this.bannerService.getAllBanners();
      if (!banners || !Array.isArray(banners)) {
        throw new Error('Danh sách banner không hợp lệ');
      }
      return banners;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách banner:', error);
      return [];
    }
  }

  getBannersByType(type) {
    try {
      const banners = this.bannerService.getBannersByType(type);
      if (!banners || !Array.isArray(banners)) {
        throw new Error('Danh sách banner theo loại không hợp lệ');
      }
      return banners;
    } catch (error) {
      console.error('Lỗi khi lấy banner theo loại:', error);
      return [];
    }
  }

  getBannerById(id) {
    try {
      const banner = this.bannerService.getBannerById(id);
      if (!banner) {
        throw new Error('Banner không tồn tại');
      }
      return banner;
    } catch (error) {
      console.error('Lỗi khi lấy banner theo ID:', error);
      return null;
    }
  }
}

export default BannerController;