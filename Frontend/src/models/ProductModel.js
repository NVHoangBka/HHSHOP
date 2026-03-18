// src/models/ProductModel.js
class Product {
  constructor(data) {
    this.id = data._id || data.id;

    this.name = this.normalizeTranslatable(data.name, "Tên sản phẩm");

    this.slug = this.normalizeTranslatable(data.slug);

    // Giá cơ bản (nếu không có variants)
    this.price = data.price || 0;
    this.discountPrice = data.discountPrice || null;

    // Ảnh chính + gallery
    this.image = data.image || "";
    this.gallery = data.gallery || [];

    // Phân loại
    this.variants = data.variants || [];

    // Nội dung chi tiết
    this.shortDescription = data.shortDescription || "";
    this.description = this.normalizeTranslatable(
      data.description,
      "Mô tả sản phẩm",
    );
    this.highlightContent = data.highlightContent || "";
    this.highlightSections = data.highlightSections || [];

    // Phân loại
    this.categories = data.categories || [];
    this.subCategories = data.subCategories || [];
    this.brands = data.brands || [];
    this.colors = data.colors || [];
    this.tags = data.tags || [];
    this.types = data.types || [];
    this.titles = data.titles || [];
    this.subTitles = data.subTitles || [];

    // Đánh giá & tương tác
    this.reviews = data.reviews || [];
    this.ratingAverage = data.ratingAverage || 0;
    this.reviewCount = data.reviewCount || 0;

    // Trạng thái & số liệu
    this.isActive = data.isActive !== false;
    this.isFeatured = data.isFeatured === true;
    this.inStock = data.inStock !== false;
    this.totalStock = data.totalStock || 0; // tổng tồn tất cả variants
    this.totalSold = data.totalSold || 0; // tổng đã bán
    this.viewCount = data.viewCount || 0; // tổng lượt xem
    this.flashSale = data.flashSale === true; // flash sale
    this.flashSaleEnd = data.flashSaleEnd || null;
    this.isFeatured = data.isFeatured !== false;

    // Giá hiển thị cuối cùng
    this.finalPrice = data.finalPrice || this.discountPrice || this.price;
  }

  normalizeTranslatable(value, fallback = "") {
    if (!value) return { vi: fallback };

    if (typeof value === "string") {
      return { vi: value };
    }

    // Đã là object → kiểm tra có key 'vi' không, nếu không thì thêm fallback
    if (typeof value === "object" && value !== null) {
      return {
        vi: value.vi || fallback,
        en: value.en || "",
        cz: value.cz || "",
        // thêm ngôn ngữ khác nếu cần...
      };
    }

    return { vi: fallback };
  }

  getName(lang = "vi") {
    return this.name?.[lang] || this.name?.vi || "Chưa đặt tên";
  }

  getSlug(lang = "vi") {
    return this.slug?.[lang] || this.slug?.vi || "";
  }

  getDescription(lang = "vi") {
    return this.description?.[lang] || this.description?.vi || "";
  }

  // Lấy giá + ảnh của một variant cụ thể
  getVariant(variantValue) {
    if (!variantValue || variantValue === "default") return null;
    return this.variants.find((v) => v.value === variantValue) || null;
  }

  // Giá hiển thị theo variant (nếu có)
  getPriceForVariant(variantValue) {
    const variant = this.getVariant(variantValue);
    if (variant) return variant.discountPrice || variant.price || 0;
    return this.finalPrice;
  }

  // Tồn kho theo variant
  getStockForVariant(variantValue) {
    const variant = this.getVariant(variantValue);
    if (variant) return variant.stock || 0;
    return this.totalStock;
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
