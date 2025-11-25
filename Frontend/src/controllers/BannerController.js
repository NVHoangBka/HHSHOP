import BannerService from "../services/BannerService.js";

class BannerController {
  constructor() {
    this.bannerService = new BannerService();
  }

  async getBannersAll() {
    try {
      const banners = await this.bannerService.getBannersAll();
      if (!banners || !Array.isArray(banners)) {
        throw new Error("Danh sách banner không hợp lệ");
      }
      return banners;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách banner:", error);
      return [];
    }
  }
}

const bannerController = new BannerController();

export default bannerController;
