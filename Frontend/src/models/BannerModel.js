import { banners } from '../data/banners.js';

class BannerModel {
  constructor() {
    this.banners = banners || [];
  }

  getAllBanners() {
    return [...this.banners];
  }

  getBannersByType(type) {
    return this.banners.filter(banner => banner.type === type);
  }

  getBannerById(id) {
    return this.banners.find(banner => banner.id === parseInt(id)) || null;
  }
}

export default BannerModel;