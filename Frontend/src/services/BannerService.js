import BannerModel from '../models/BannerModel.js';

class BannerService {
  constructor() {
    this.bannerModel = new BannerModel();
  }

  getAllBanners() {
    return this.bannerModel.getAllBanners();
  }

  getBannersByType(type) {
    return this.bannerModel.getBannersByType(type);
  }

  getBannerById(id) {
    return this.bannerModel.getBannerById(id);
  }
}

export default BannerService;