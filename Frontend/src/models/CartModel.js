export class CartModel {
  constructor(items = []) {
    this.items = items.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      displayPrice: item.discountPrice || item.price
    }));
  }

  get totalItems() {
    return this.items.length;
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + (item.displayPrice * item.quantity), 0);
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1, displayPrice: product.discountPrice || product.price });
    }
    return [...this.items];
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    return [...this.items];
  }

  updateQuantity(productId, quantity) {
    this.items = this.items.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    return [...this.items];
  }

  clear() {
    this.items = [];
    return [];
  }

  getItems() {
    return [...this.items];
  }
}

export default CartModel;