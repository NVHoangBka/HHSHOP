// src/models/ProductModel.js
import api from '../services/api';

export class Product {
  constructor(data) {
    this.id = data._id || data.id;
    this.name = data.name;
    this.price = data.price;
    this.discountPrice = data.discountPrice || null;
    this.image = data.image;
    this.description = data.description;
    this.types = data.types || [];
    this.tag = data.tag || [];
    this.brands = data.brands || [];
    this.colors = data.colors || [];
    this.titles = data.titles || [];
    this.subTitles = data.subTitles || [];
  }
}

class ProductModel {
  constructor() {
    this.cache = new Map(); // Cache để tránh gọi API nhiều lần
  }

  async _fetch(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    try {
      const response = await api.get(url);
      const products = (response.data.products || []).map(p => new Product(p));
      this.cache.set(url, products);
      return products;
    } catch (error) {
      console.error(`API Error [${url}]:`, error.response?.data || error.message);
      return [];
    }
  }

  async getAllProducts() {
    return this._fetch('/products');
  }

  async getProductsByTitle(titlePath) {
    return this._fetch(`/products/title/${encodeURIComponent(titlePath)}`);
  }

  async getProductsBySubTitle(subTitlePath) {
    return this._fetch(`/products/subtitle/${encodeURIComponent(subTitlePath)}`);
  }

  async getProductsByTag(tag) {
    return this._fetch(`/products/tag/${encodeURIComponent(tag)}`);
  }

  async getProductsByType(type) {
    return this._fetch(`/products/type/${encodeURIComponent(type)}`);
  }
}

export default ProductModel;