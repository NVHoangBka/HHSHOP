import CartService from "../services/CartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  // Gọi sau khi xác định trạng thái đăng nhập
  setAuthenticated(isAuth) {
    return this.cartService.setAuthenticated(isAuth);
  }

  getCart() {
    return this.cartService.getCart();
  }

  async addToCart(
    productId,
    variantValue = "default",
    quantity = 1,
    productData = null,
  ) {
    return await this.cartService.addItem(productId, variantValue, quantity, {
      productData,
    });
  }

  // Xóa 1 sản phẩm theo productId + variantValue
  async removeFromCart(productId, variantValue = "default") {
    return await this.cartService.removeItem(productId, variantValue);
  }

  // Cập nhật số lượng
  async updateQuantity(productId, variantValue = "default", quantity) {
    return await this.cartService.updateQuantity(
      productId,
      variantValue,
      quantity,
    );
  }

  // Xóa toàn bộ giỏ
  async clearCart() {
    return await this.cartService.clearCart();
  }

  // Lấy danh sách item
  getCartItems() {
    return this.cartService.getCart().items;
  }

  // Tổng số lượng (dùng cho badge icon giỏ hàng)
  getTotalQuantity() {
    return this.cartService.getCart().totalQuantity;
  }

  // Tổng tiền
  getTotalPrice() {
    return this.cartService.getCart().totalPrice;
  }

  // Kiểm tra giỏ trống
  isEmpty() {
    return this.cartService.getCart().isEmpty;
  }
}

export default CartController;
