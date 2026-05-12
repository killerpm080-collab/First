import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'marketplace.db');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database tables
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      affiliate_code TEXT UNIQUE,
      referred_by TEXT,
      subscription_tier TEXT DEFAULT 'free',
      subscription_expires_at DATETIME
    )
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      price REAL NOT NULL,
      compare_price REAL,
      category_id TEXT NOT NULL,
      tags TEXT,
      thumbnail TEXT,
      gallery TEXT,
      file_url TEXT,
      file_size TEXT,
      file_type TEXT,
      download_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      sales_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      featured BOOLEAN DEFAULT 0,
      trending BOOLEAN DEFAULT 0,
      new_arrival BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ai_generated BOOLEAN DEFAULT 0,
      ai_prompt TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      payment_method TEXT,
      payment_id TEXT,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      affiliate_code TEXT,
      affiliate_commission REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Downloads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      download_token TEXT UNIQUE NOT NULL,
      download_password TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      download_count INTEGER DEFAULT 0,
      max_downloads INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Wishlist table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tier TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      price REAL NOT NULL,
      billing_period TEXT NOT NULL,
      starts_at DATETIME NOT NULL,
      expires_at DATETIME NOT NULL,
      payment_method TEXT,
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Affiliate earnings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS affiliate_earnings (
      id TEXT PRIMARY KEY,
      affiliate_user_id TEXT NOT NULL,
      referred_user_id TEXT,
      order_id TEXT,
      amount REAL NOT NULL,
      commission_rate REAL DEFAULT 30,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY (affiliate_user_id) REFERENCES users(id),
      FOREIGN KEY (referred_user_id) REFERENCES users(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Marketing campaigns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      scheduled_at DATETIME,
      sent_at DATETIME,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // AI generated products queue
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_product_queue (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      prompt TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      generated_at DATETIME,
      product_id TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Site settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default categories
  const categories = [
    { id: 'ai-tools', name: 'AI Tools & Scripts', slug: 'ai-tools', description: 'AI-powered tools and scripts for automation', icon: 'Brain', color: '#8B5CF6' },
    { id: 'ebooks', name: 'eBooks & Guides', slug: 'ebooks', description: 'Digital books and comprehensive guides', icon: 'BookOpen', color: '#3B82F6' },
    { id: 'courses', name: 'Online Courses & Tutorials', slug: 'courses', description: 'Learn new skills with video courses', icon: 'GraduationCap', color: '#10B981' },
    { id: 'templates', name: 'Templates & Printables', slug: 'templates', description: 'Ready-to-use templates for any purpose', icon: 'FileText', color: '#F59E0B' },
    { id: 'graphics', name: 'Graphics & Designs', slug: 'graphics', description: 'High-quality design assets and graphics', icon: 'Palette', color: '#EC4899' },
    { id: 'audio', name: 'Audio & Music Products', slug: 'audio', description: 'Music, sound effects, and audio assets', icon: 'Music', color: '#EF4444' },
    { id: 'software', name: 'Software & Utilities', slug: 'software', description: 'Productivity software and utilities', icon: 'Code', color: '#6366F1' }
  ];

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  categories.forEach(cat => {
    insertCategory.run(cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.color);
  });

  // Insert default admin user
  const bcrypt = require('bcryptjs');
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password, name, role, affiliate_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('admin-001', 'admin@digitalmarket.ai', adminPassword, 'Admin User', 'admin', 'ADMIN001');

  // Insert default site settings
  const defaultSettings = [
    { key: 'site_name', value: 'AI Digital Marketplace' },
    { key: 'site_description', value: 'Premium AI-generated digital products' },
    { key: 'commission_rate', value: '30' },
    { key: 'monthly_subscription_price', value: '29.99' },
    { key: 'yearly_subscription_price', value: '299.99' },
    { key: 'ai_generation_enabled', value: 'true' },
    { key: 'auto_marketing_enabled', value: 'true' }
  ];

  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO site_settings (key, value)
    VALUES (?, ?)
  `);

  defaultSettings.forEach(setting => {
    insertSetting.run(setting.key, setting.value);
  });

  console.log('Database initialized successfully');
}

export default db;
