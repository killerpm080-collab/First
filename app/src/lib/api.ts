import type { User, Product, Category, Order, CartItem, Download, WishlistItem, AffiliateEarning, AdminStats, MarketingContent } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string, affiliateCode?: string): Promise<{ token: string; user: User }> {
    return this.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, affiliateCode })
    });
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe(): Promise<User> {
    return this.fetch('/auth/me');
  }

  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number; featured?: boolean; trending?: boolean }): Promise<{ products: Product[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/products?${queryParams.toString()}`);
  }

  async getProduct(slug: string): Promise<Product & { reviews: any[]; related: Product[] }> {
    return this.fetch(`/products/${slug}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.fetch('/categories');
  }

  // Cart & Orders
  async createOrder(items: CartItem[], paymentMethod: string, affiliateCode?: string): Promise<{ orderId: string; total: number }> {
    return this.fetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), paymentMethod, affiliateCode })
    });
  }

  async processPayment(orderId: string): Promise<{ success: boolean }> {
    return this.fetch(`/orders/${orderId}/pay`, { method: 'POST' });
  }

  async getOrders(): Promise<Order[]> {
    return this.fetch('/orders');
  }

  // Downloads
  async getDownloads(orderId: string): Promise<Download[]> {
    return this.fetch(`/orders/${orderId}/downloads`);
  }

  async verifyDownload(token: string, password: string): Promise<{ valid: boolean; fileUrl: string }> {
    return this.fetch(`/downloads/verify?token=${token}&password=${password}`);
  }

  // Reviews
  async addReview(productId: string, rating: number, comment: string): Promise<{ success: boolean }> {
    return this.fetch(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  }

  // Wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    return this.fetch('/wishlist');
  }

  async addToWishlist(productId: string): Promise<{ success: boolean }> {
    return this.fetch('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId: string): Promise<{ success: boolean }> {
    return this.fetch(`/wishlist/${productId}`, { method: 'DELETE' });
  }

  // Subscriptions
  async createSubscription(tier: string, billingPeriod: string): Promise<{ success: boolean; subscriptionId: string }> {
    return this.fetch('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ tier, billingPeriod })
    });
  }

  // Affiliate
  async getAffiliateEarnings(): Promise<{ earnings: AffiliateEarning[]; stats: any }> {
    return this.fetch('/affiliate/earnings');
  }

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    return this.fetch('/admin/stats');
  }

  async getAdminProducts(): Promise<Product[]> {
    return this.fetch('/admin/products');
  }

  async createProduct(product: Partial<Product>): Promise<{ success: boolean; productId: string }> {
    return this.fetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean }> {
    return this.fetch(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.fetch(`/admin/products/${id}`, { method: 'DELETE' });
  }

  async generateAIProducts(count: number): Promise<{ success: boolean; generated: number }> {
    return this.fetch('/admin/ai/generate-products', {
      method: 'POST',
      body: JSON.stringify({ count })
    });
  }

  async getAIQueue(): Promise<any[]> {
    return this.fetch('/admin/ai/queue');
  }

  async getSettings(): Promise<{ key: string; value: string }[]> {
    return this.fetch('/admin/settings');
  }

  async updateSetting(key: string, value: string): Promise<{ success: boolean }> {
    return this.fetch('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ key, value })
    });
  }

  async generateMarketingContent(type: string): Promise<MarketingContent> {
    return this.fetch('/admin/marketing/generate', {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  }
}

export const api = new ApiService();
