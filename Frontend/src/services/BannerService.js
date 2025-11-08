import BannerModel from "../models/BannerModel.js";

class BannerService {
  constructor() {
    this.bannerModel = new BannerModel();
  }

  getBannersAll() {
    return this.bannerModel.getBannersAll();
  }
}

export default BannerService;
