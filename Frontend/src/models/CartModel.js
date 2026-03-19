// src/models/CartModel.js

export class CartItem {
  constructor(data) {
    // productId: string ID (từ localStorage hoặc API)
    this.productId = data.productId?._id || data.productId;
    this.variantValue = data.variantValue || "default";
    this.quantity = Number(data.quantity) || 1;

    // ==========================================
    // CASE 1: productId là object (sau populate từ server)
    // ==========================================
    if (data.productId && typeof data.productId === "object") {
      const product = data.productId;
      this.fromProduct(product, this.variantValue);
      return;
    }

    // ==========================================
    // CASE 2: productData được truyền riêng (khi addItem offline)
    // ==========================================
    if (data.productData) {
      this.fromProduct(data.productData, this.variantValue);
      return;
    }

    // ==========================================
    // CASE 3: Load từ localStorage (đã lưu displayInfo trước đó)
    // ==========================================
    this.name = this._normalizeTranslatable(data.name, "Sản phẩm");
    this.slug = this._normalizeTranslatable(data.slug);
    this.image = data.image || "";
    this.displayPrice = data.displayPrice || 0;
    this.displayImage = data.displayImage || data.image || "";
    this.stock = data.stock || 0;
    this.selectedVariant = null;
  }

  // Helper: populate từ Product object
  fromProduct(product, variantValue) {
    this.name = this._normalizeTranslatable(product.name, "Sản phẩm");
    this.slug = this._normalizeTranslatable(product.slug);
    this.image = product.image || "";
    this.selectedVariant = null;
    this.displayPrice = 0;
    this.displayImage = this.image;
    this.stock = 0;

    if (product.variants?.length > 0) {
      this.selectedVariant = product.variants.find(
        (v) => v.value === this.variantValue,
      );
      if (this.selectedVariant) {
        this.displayPrice =
          this.selectedVariant.discountPrice || this.selectedVariant.price || 0;
        this.displayImage = this.selectedVariant.image || this.image;
        this.stock = this.selectedVariant.stock || 0;
      }
    } else {
      this.displayPrice = product.discountPrice || product.price || 0;
      this.stock = product.totalStock || 0;
    }
  }

  _normalizeTranslatable(value, fallback = "") {
    if (!value) return { vi: fallback, en: "", cz: "" };
    if (typeof value === "string") return { vi: value, en: "", cz: "" };
    if (typeof value === "object") {
      return {
        vi: value.vi || fallback,
        en: value.en || "",
        cz: value.cz || "",
      };
    }
    return { vi: fallback, en: "", cz: "" };
  }

  // Lấy tên theo ngôn ngữ
  getName(lang = "vi") {
    return this.name?.[lang] || this.name?.vi || "Sản phẩm";
  }

  // Lấy slug theo ngôn ngữ
  getSlug(lang = "vi") {
    return this.slug?.[lang] || this.slug?.vi || "";
  }

  get subtotal() {
    return this.displayPrice * this.quantity;
  }

  canIncrease() {
    if (this.stock === 0) return true;
    return this.quantity < this.stock;
  }
}

export class CartModel {
  constructor(items = []) {
    this.items = items.map((item) => new CartItem(item));
  }

  get totalQuantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  findItem(productId, variantValue = "default") {
    return this.items.find(
      (i) => i.productId === productId && i.variantValue === variantValue,
    );
  }

  toJSON() {
    return this.items.map((item) => ({
      productId: item.productId,
      variantValue: item.variantValue,
      quantity: item.quantity,
      name: item.name,
      slug: item.slug,
      image: item.image,
      displayPrice: item.displayPrice,
      displayImage: item.displayImage,
      stock: item.stock,
    }));
  }
}

export default CartModel;
