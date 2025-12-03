// src/models/ProductModel.js
class Product {
  constructor(data) {
    this.id = data._id || data.id;
    this.name = data.name || "";
    this.slug = data.slug || "";
    this.price = data.price || 0;
    this.discountPrice = data.discountPrice || null;
    this.image = data.image || "";
    this.gallery = data.gallery || [];
    this.variants = data.variants || [];
    this.description = data.description || "";
    this.shortDescription = data.shortDescription || "";
    this.highlightContent = data.highlightContent || "";
    this.highlightSections = data.highlightSections || [];

    // Phân loại
    this.brands = data.brands || [];
    this.types = data.types || [];
    this.tags = data.tags || [];
    this.titles = data.titles || [];
    this.subTitles = data.subTitles || [];

    // Số liệu
    this.viewCount = data.viewCount || 0;
    this.totalSold = data.totalSold || 0;
    this.stock = data.stock || 0;
    this.isActive = data.isActive !== false;

    this.finalPrice = this.discountPrice || this.price;
  }
}

class ProductModel {
  // Chỉ map data → không gọi API nữa
  mapProduct(data) {
    return new Product(data);
  }

  mapProducts(list) {
    return list.map((item) => new Product(item));
  }
}

export default ProductModel;
export { Product };
