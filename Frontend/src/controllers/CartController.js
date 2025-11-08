import CartService from "../services/CartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  addToCart(product) {
    const updatedCart = this.cartService.addToCart(product);
    return updatedCart; // Trả về mảng đã cập nhật
  }

  removeFromCart(productId) {
    const updatedCart = this.cartService.removeFromCart(productId);
    return updatedCart;
  }

  updateQuantity(productId, quantity) {
    const updatedCart = this.cartService.updateQuantity(productId, quantity);
    return updatedCart;
  }

  clearCart() {
    const updatedCart = this.cartService.clearCart();
    return updatedCart;
  }

  getCartItems() {
    return this.cartService.getCartItems();
  }

  getTotalQuantity() {
    return this.cartService.getTotalQuantity();
  }

  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }
}

export default CartController;
