export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  affiliateCode?: string;
  subscriptionTier?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  productCount?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price: number;
  category_id: string;
  category_name?: string;
  category_color?: string;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  file_url: string;
  file_size: string;
  file_type: string;
  download_count: number;
  rating: number;
  review_count: number;
  sales_count: number;
  status: 'active' | 'inactive' | 'deleted';
  featured: boolean;
  trending: boolean;
  new_arrival: boolean;
  ai_generated: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  affiliate_code?: string;
  affiliate_commission: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
  product?: Product;
}

export interface Download {
  id: string;
  order_id: string;
  product_id: string;
  product_title?: string;
  file_url: string;
  file_type: string;
  file_size: string;
  download_token: string;
  download_password: string;
  expires_at: string;
  download_count: number;
  max_downloads: number;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
  rating: number;
}

export interface Subscription {
  id: string;
  tier: string;
  status: string;
  price: number;
  billing_period: string;
  starts_at: string;
  expires_at: string;
}

export interface AffiliateEarning {
  id: string;
  amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  referred_user_name?: string;
  order_total?: number;
}

export interface AdminStats {
  users: { count: number };
  products: { count: number };
  orders: { count: number };
  revenue: { total: number };
  monthlyRevenue: { total: number };
  newUsers: { count: number };
  topProducts: Product[];
  recentOrders: Order[];
}

export interface MarketingContent {
  subject?: string;
  body?: string;
  content?: string;
  hashtags?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
}
