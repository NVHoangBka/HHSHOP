// src/models/CartModel.js

export class CartItem {
  constructor(data) {
    this.productId = data.productId?._id || data.productId;
    this.variantValue = data.variantValue || "default";
    this.quantity = Number(data.quantity) || 1;

    // Thông tin sản phẩm (sau khi populate từ server)

    if (data.productId && typeof data.productId === "object") {
      const product = data.productId;
      this.product = product;
      this.name = product.name?.vi || product.name || "Sản phẩm";
      this.slug = product.slug?.vi || product.slug || "";
      this.image = product.image || "";

      // Xác định giá, ảnh, stock theo variantValue
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
            this.selectedVariant.discountPrice ||
            this.selectedVariant.price ||
            0;
          this.displayImage = this.selectedVariant.image || this.image;
          this.stock = this.selectedVariant.stock || 0;
        }
      } else {
        this.displayPrice = product.discountPrice || product.price || 0;
        this.stock = product.totalStock || 0;
      }
    } else {
      // Item từ localStorage (chưa populate) — chỉ có giá trị cơ bản
      this.name = data.name || "Sản phẩm";
      this.slug = data.slug || "";
      this.image = data.image || "";
      this.displayPrice =
        data.displayPrice || data.discountPrice || data.price || 0;
      this.displayImage = data.displayImage || data.image || "";
      this.stock = data.stock || 0;
    }
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
      image: item.displayImage,
      displayPrice: item.displayPrice,
      stock: item.stock,
    }));
  }
}

export default CartModel;
