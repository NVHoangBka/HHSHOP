// src/services/CartService.js
import api from "./api";
import { CartModel } from "../models/CartModel.js";

const CART_LOCAL_KEY = "cart";

class CartService {
  constructor() {
    this.cart = new CartModel(this._loadLocal());
    this.isAuthenticated = false;
  }

  async syncCart() {
    if (!this.isAuthenticated) {
      this.cart = new CartModel(this._loadLocal());
      return this.cart;
    }
    try {
      const res = await api.get("/cart");
      if (res.data.success) {
        this.cart = new CartModel(res.data.cart.items || []);
        const pending = this._loadLocal();
        if (pending.length > 0) {
          for (const item of pending) {
            await this.addItem(
              item.productId,
              item.variantValue,
              item.quantity,
              { silent: true },
            );
          }
          localStorage.removeItem(CART_LOCAL_KEY);
        }
      }
    } catch (err) {
      console.warn("Không tải được giỏ từ server, dùng local:", err);
      this.cart = new CartModel(this._loadLocal());
    }
    return this.cart;
  }

  async addItem(
    productId,
    variantValue = "default",
    quantity = 1,
    options = {},
  ) {
    const { silent = false, productData = null } = options;
    try {
      if (!this.isAuthenticated) {
        const existing = this.cart.findItem(productId, variantValue);
        if (existing) {
          existing.quantity += quantity;
        } else {
          const newItem = { productId, variantValue, quantity };
          if (productData) newItem.productData = productData;
          this.cart.items.push(
            new (await import("../models/CartModel.js")).CartItem(newItem),
          );
        }
        // ✅ Tạo CartModel mới từ toJSON() để React nhận ra thay đổi
        this.cart = new CartModel(this.cart.toJSON());
        this._saveLocal();
        return this.cart;
      }
      const res = await api.post("/cart/add", {
        productId,
        variantValue,
        quantity,
      });
      if (res.data.success) {
        this.cart = new CartModel(res.data.cart.items || []);
        if (!silent) return this.cart;
      } else {
        throw new Error(res.data.message || "Thêm vào giỏ thất bại");
      }
    } catch (err) {
      if (!silent) throw err;
      console.error("addItem error:", err);
    }
    return this.cart;
  }

  async updateQuantity(productId, variantValue = "default", quantity) {
    if (quantity < 1) quantity = 1;
    try {
      if (!this.isAuthenticated) {
        const item = this.cart.findItem(productId, variantValue);
        if (item) item.quantity = quantity;
        // ✅ Tạo CartModel mới
        this.cart = new CartModel(this.cart.toJSON());
        this._saveLocal();
        return this.cart;
      }
      const res = await api.put("/cart/update", {
        productId,
        variantValue,
        quantity,
      });
      if (res.data.success) {
        this.cart = new CartModel(res.data.cart.items || []);
      } else {
        throw new Error(res.data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("updateQuantity error:", err);
      throw err;
    }
    return this.cart;
  }

  async removeItem(productId, variantValue = "default") {
    try {
      if (!this.isAuthenticated) {
        this.cart.items = this.cart.items.filter(
          (i) =>
            !(i.productId === productId && i.variantValue === variantValue),
        );
        // ✅ Tạo CartModel mới
        this.cart = new CartModel(this.cart.toJSON());
        this._saveLocal();
        return this.cart;
      }
      const res = await api.delete("/cart/remove", {
        data: { productId, variantValue },
      });
      if (res.data.success) {
        this.cart = new CartModel(res.data.cart.items || []);
      } else {
        throw new Error(res.data.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("removeItem error:", err);
      throw err;
    }
    return this.cart;
  }

  async clearCart() {
    try {
      if (this.isAuthenticated) await api.delete("/cart/clear");
      this.cart = new CartModel([]);
      localStorage.removeItem(CART_LOCAL_KEY);
    } catch (err) {
      console.error("clearCart error:", err);
      throw err;
    }
    return this.cart;
  }

  getCart() {
    return this.cart;
  }

  setAuthenticated(isAuth) {
    this.isAuthenticated = isAuth;
    if (isAuth) return this.syncCart();
  }

  _loadLocal() {
    try {
      return JSON.parse(localStorage.getItem(CART_LOCAL_KEY)) || [];
    } catch {
      localStorage.removeItem(CART_LOCAL_KEY);
      return [];
    }
  }

  _saveLocal() {
    try {
      localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(this.cart.toJSON()));
    } catch (err) {
      console.warn("Không thể lưu giỏ hàng:", err);
    }
  }
}

export default CartService;
