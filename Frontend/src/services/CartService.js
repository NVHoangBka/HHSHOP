import CartModel from "../models/CartModel.js";

class CartService {
  constructor() {
    this.cartModel = new CartModel(
      JSON.parse(localStorage.getItem("cart")) || []
    );
  }

  addToCart(product) {
    const updatedItems = this.cartModel.addItem(product);
    this.saveCart(updatedItems);
    return updatedItems;
  }

  removeFromCart(productId) {
    const updatedItems = this.cartModel.removeItem(productId);
    this.saveCart(updatedItems);
    return updatedItems;
  }

  updateQuantity(productId, quantity) {
    const updatedItems = this.cartModel.updateQuantity(productId, quantity);
    this.saveCart(updatedItems);
    return updatedItems;
  }

  clearCart() {
    const updatedItems = this.cartModel.clear();
    this.saveCart(updatedItems);
    return updatedItems;
  }

  getCartItems() {
    return this.cartModel.getItems();
  }

  getTotalQuantity() {
    return this.cartModel
      .getItems()
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cartModel.totalPrice;
  }

  saveCart(items) {
    localStorage.setItem("cart", JSON.stringify(items));
    this.cartModel = new CartModel(items); // Cập nhật model
  }
}

export default CartService;
