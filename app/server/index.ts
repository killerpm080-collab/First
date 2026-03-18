import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import db, { initDatabase } from './database';
import aiGenerator from './aiProductGenerator';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Generate initial 50 products if none exist
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  console.log('Generating initial 50 products...');
  const products = aiGenerator.generateProducts(50);
  const inserted = aiGenerator.saveGeneratedProducts(products);
  console.log(`Inserted ${inserted} products`);
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, affiliateCode } = req.body;
    
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const userAffiliateCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    db.prepare(`
      INSERT INTO users (id, email, password, name, affiliate_code, referred_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, name, userAffiliateCode, affiliateCode || null);

    // Track affiliate referral
    if (affiliateCode) {
      const referrer = db.prepare('SELECT * FROM users WHERE affiliate_code = ?').get(affiliateCode);
      if (referrer) {
        db.prepare(`
          INSERT INTO affiliate_earnings (id, affiliate_user_id, referred_user_id, amount, commission_rate, status)
          VALUES (?, ?, ?, 5, 100, 'pending')
        `).run(uuidv4(), (referrer as any).id, userId);
      }
    }

    const token = jwt.sign({ userId, email, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: userId, email, name, role: 'customer', affiliateCode: userAffiliateCode }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, (user as any).password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: (user as any).id, email, role: (user as any).role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role,
        affiliateCode: (user as any).affiliate_code,
        subscriptionTier: (user as any).subscription_tier
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = db.prepare('SELECT id, email, name, role, avatar, affiliate_code, subscription_tier FROM users WHERE id = ?').get(req.user.userId);
  res.json(user);
});

// ==================== PRODUCT ROUTES ====================

// Get all products with filters
app.get('/api/products', (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, featured, trending } = req.query;
    
    let query = 'SELECT p.*, c.name as category_name, c.color as category_color FROM products p JOIN categories c ON p.category_id = c.id WHERE p.status = "active"';
    const params: any[] = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }

    if (trending === 'true') {
      query += ' AND p.trending = 1';
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price-desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'popular':
        query += ' ORDER BY p.sales_count DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const products = db.prepare(query).all(...params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE status = "active"';
    const countParams: any[] = [];
    
    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const { total } = db.prepare(countQuery).get(...countParams) as { total: number };

    res.json({
      products: products.map((p: any) => ({
        ...p,
        tags: JSON.parse(p.tags || '[]'),
        gallery: JSON.parse(p.gallery || '[]')
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:slug', (req, res) => {
  try {
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `).get(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get reviews
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `).get((product as any).id);

    // Get related products
    const related = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      LIMIT 4
    `).all((product as any).category_id, (product as any).id);

    res.json({
      ...product,
      tags: JSON.parse((product as any).tags || '[]'),
      gallery: JSON.parse((product as any).gallery || '[]'),
      reviews: reviews || [],
      related: related
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  
  // Get product count for each category
  const categoriesWithCount = categories.map((cat: any) => {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ? AND status = "active"').get(cat.id) as { count: number };
    return { ...cat, productCount: count };
  });

  res.json(categoriesWithCount);
});

// ==================== CART & CHECKOUT ROUTES ====================

// Create order
app.post('/api/orders', authenticateToken, async (req: any, res) => {
  try {
    const { items, paymentMethod, affiliateCode } = req.body;
    
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      if (product) {
        subtotal += (product as any).price * item.quantity;
        orderItems.push({
          productId: item.productId,
          price: (product as any).price,
          quantity: item.quantity
        });
      }
    }

    const orderId = uuidv4();
    const total = subtotal;

    db.prepare(`
      INSERT INTO orders (id, user_id, status, payment_status, payment_method, subtotal, total, affiliate_code, created_at)
      VALUES (?, ?, 'pending', 'pending', ?, ?, ?, ?, ?)
    `).run(orderId, req.user.userId, paymentMethod, subtotal, total, affiliateCode || null, new Date().toISOString());

    for (const item of orderItems) {
      db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, price, quantity)
        VALUES (?, ?, ?, ?, ?)
      `).run(uuidv4(), orderId, item.productId, item.price, item.quantity);
    }

    res.json({ orderId, total, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Process payment (simulated)
app.post('/api/orders/:orderId/pay', authenticateToken, async (req: any, res) => {
  try {
    const { orderId } = req.params;
    
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, req.user.userId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Simulate payment processing
    db.prepare('UPDATE orders SET payment_status = "completed", status = "completed", updated_at = ? WHERE id = ?')
      .run(new Date().toISOString(), orderId);

    // Create download links
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    
    for (const item of orderItems as any[]) {
      const downloadToken = uuidv4();
      const downloadPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      db.prepare(`
        INSERT INTO downloads (id, order_id, product_id, user_id, download_token, download_password, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        orderId,
        item.product_id,
        req.user.userId,
        downloadToken,
        downloadPassword,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString()
      );

      // Update sales count
      db.prepare('UPDATE products SET sales_count = sales_count + 1 WHERE id = ?').run(item.product_id);
    }

    // Handle affiliate commission
    if ((order as any).affiliate_code) {
      const referrer = db.prepare('SELECT * FROM users WHERE affiliate_code = ?').get((order as any).affiliate_code);
      if (referrer) {
        const commission = (order as any).total * 0.30; // 30% commission
        db.prepare(`
          INSERT INTO affiliate_earnings (id, affiliate_user_id, order_id, amount, commission_rate, status, created_at)
          VALUES (?, ?, ?, ?, 30, 'pending', ?)
        `).run(uuidv4(), (referrer as any).id, orderId, commission, new Date().toISOString());
      }
    }

    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, (req: any, res) => {
  const orders = db.prepare(`
    SELECT o.*, 
      (SELECT GROUP_CONCAT(json_object('title', p.title, 'thumbnail', p.thumbnail))
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = o.id) as items
    FROM orders o
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).all(req.user.userId);

  res.json(orders);
});

// ==================== DOWNLOAD ROUTES ====================

// Get download links for order
app.get('/api/orders/:orderId/downloads', authenticateToken, (req: any, res) => {
  const downloads = db.prepare(`
    SELECT d.*, p.title, p.file_url, p.file_type, p.file_size
    FROM downloads d
    JOIN products p ON d.product_id = p.id
    WHERE d.order_id = ? AND d.user_id = ?
  `).all(req.params.orderId, req.user.userId);

  res.json(downloads);
});

// Verify download
app.get('/api/downloads/verify', (req, res) => {
  const { token, password } = req.query;
  
  const download = db.prepare('SELECT * FROM downloads WHERE download_token = ? AND download_password = ?').get(token, password);
  
  if (!download) {
    return res.status(404).json({ error: 'Invalid download link' });
  }

  if (new Date((download as any).expires_at) < new Date()) {
    return res.status(410).json({ error: 'Download link expired' });
  }

  if ((download as any).download_count >= (download as any).max_downloads) {
    return res.status(403).json({ error: 'Maximum downloads reached' });
  }

  res.json({ valid: true, fileUrl: (download as any).file_url });
});

// ==================== REVIEW ROUTES ====================

// Add review
app.post('/api/products/:productId/reviews', authenticateToken, (req: any, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Check if user purchased the product
    const hasPurchased = db.prepare(`
      SELECT 1 FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = ? AND o.user_id = ? AND o.payment_status = 'completed'
    `).get(productId, req.user.userId);

    if (!hasPurchased) {
      return res.status(403).json({ error: 'Must purchase product to review' });
    }

    const reviewId = uuidv4();
    db.prepare(`
      INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(reviewId, productId, req.user.userId, rating, comment, new Date().toISOString());

    // Update product rating
    const avgRating = db.prepare('SELECT AVG(rating) as avg FROM reviews WHERE product_id = ?').get(productId) as { avg: number };
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews WHERE product_id = ?').get(productId) as { count: number };
    
    db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?')
      .run(avgRating.avg, reviewCount.count, productId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// ==================== WISHLIST ROUTES ====================

app.get('/api/wishlist', authenticateToken, (req: any, res) => {
  const wishlist = db.prepare(`
    SELECT w.*, p.title, p.slug, p.price, p.thumbnail, p.rating
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `).all(req.user.userId);

  res.json(wishlist);
});

app.post('/api/wishlist', authenticateToken, (req: any, res) => {
  try {
    const { productId } = req.body;
    
    db.prepare(`
      INSERT OR IGNORE INTO wishlists (id, user_id, product_id, created_at)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), req.user.userId, productId, new Date().toISOString());

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:productId', authenticateToken, (req: any, res) => {
  db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.userId, req.params.productId);
  res.json({ success: true });
});

// ==================== SUBSCRIPTION ROUTES ====================

app.post('/api/subscriptions', authenticateToken, (req: any, res) => {
  try {
    const { tier, billingPeriod } = req.body;
    
    const price = billingPeriod === 'yearly' ? 299.99 : 29.99;
    const subscriptionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (billingPeriod === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000);

    db.prepare(`
      INSERT INTO subscriptions (id, user_id, tier, price, billing_period, starts_at, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(subscriptionId, req.user.userId, tier, price, billingPeriod, now.toISOString(), expiresAt.toISOString(), now.toISOString());

    db.prepare('UPDATE users SET subscription_tier = ?, subscription_expires_at = ? WHERE id = ?')
      .run(tier, expiresAt.toISOString(), req.user.userId);

    res.json({ success: true, subscriptionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// ==================== AFFILIATE ROUTES ====================

app.get('/api/affiliate/earnings', authenticateToken, (req: any, res) => {
  const earnings = db.prepare(`
    SELECT ae.*, u.name as referred_user_name, o.total as order_total
    FROM affiliate_earnings ae
    LEFT JOIN users u ON ae.referred_user_id = u.id
    LEFT JOIN orders o ON ae.order_id = o.id
    WHERE ae.affiliate_user_id = ?
    ORDER BY ae.created_at DESC
  `).all(req.user.userId);

  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_referrals,
      SUM(CASE WHEN order_id IS NOT NULL THEN 1 ELSE 0 END) as converted_referrals,
      SUM(amount) as total_earnings,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_earnings,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_earnings
    FROM affiliate_earnings
    WHERE affiliate_user_id = ?
  `).get(req.user.userId);

  res.json({ earnings, stats });
});

// ==================== ADMIN ROUTES ====================

// Get admin dashboard stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {
    users: db.prepare('SELECT COUNT(*) as count FROM users').get(),
    products: db.prepare('SELECT COUNT(*) as count FROM products').get(),
    orders: db.prepare('SELECT COUNT(*) as count FROM orders WHERE payment_status = "completed"').get(),
    revenue: db.prepare('SELECT SUM(total) as total FROM orders WHERE payment_status = "completed"').get(),
    monthlyRevenue: db.prepare(`
      SELECT SUM(total) as total FROM orders 
      WHERE payment_status = "completed" 
      AND created_at >= datetime('now', '-30 days')
    `).get(),
    newUsers: db.prepare(`
      SELECT COUNT(*) as count FROM users 
      WHERE created_at >= datetime('now', '-30 days')
    `).get(),
    topProducts: db.prepare(`
      SELECT p.title, p.sales_count, p.rating 
      FROM products p 
      ORDER BY p.sales_count DESC 
      LIMIT 5
    `).all(),
    recentOrders: db.prepare(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `).all()
  };

  res.json(stats);
});

// Get all products (admin)
app.get('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  const products = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `).all();

  res.json(products);
});

// Create product (admin)
app.post('/api/admin/products', authenticateToken, requireAdmin, (req: any, res) => {
  try {
    const product = req.body;
    const productId = uuidv4();
    const slug = `${product.category_id}-${Date.now()}`;

    db.prepare(`
      INSERT INTO products (id, title, slug, description, short_description, price, compare_price,
        category_id, tags, thumbnail, status, featured, trending, new_arrival, ai_generated, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId, product.title, slug, product.description, product.short_description,
      product.price, product.compare_price, product.category_id, JSON.stringify(product.tags || []),
      product.thumbnail, product.status || 'active', product.featured || 0, product.trending || 0,
      product.new_arrival || 1, 0, new Date().toISOString(), new Date().toISOString()
    );

    res.json({ success: true, productId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin)
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, (req: any, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    db.prepare(`
      UPDATE products SET
        title = ?, description = ?, short_description = ?, price = ?, compare_price = ?,
        category_id = ?, tags = ?, thumbnail = ?, status = ?, featured = ?, trending = ?,
        new_arrival = ?, updated_at = ?
      WHERE id = ?
    `).run(
      product.title, product.description, product.short_description, product.price, product.compare_price,
      product.category_id, JSON.stringify(product.tags || []), product.thumbnail,
      product.status, product.featured, product.trending, product.new_arrival,
      new Date().toISOString(), id
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  db.prepare('UPDATE products SET status = "deleted" WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Generate AI products (admin)
app.post('/api/admin/ai/generate-products', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { count = 10 } = req.body;
    const products = aiGenerator.generateProducts(count);
    const inserted = aiGenerator.saveGeneratedProducts(products);

    res.json({ success: true, generated: inserted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate products' });
  }
});

// Get AI generation queue
app.get('/api/admin/ai/queue', authenticateToken, requireAdmin, (req, res) => {
  const queue = db.prepare(`
    SELECT q.*, c.name as category_name
    FROM ai_product_queue q
    JOIN categories c ON q.category_id = c.id
    ORDER BY q.created_at DESC
  `).all();

  res.json(queue);
});

// Get site settings
app.get('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  const settings = db.prepare('SELECT * FROM site_settings').all();
  res.json(settings);
});

// Update site settings
app.put('/api/admin/settings', authenticateToken, requireAdmin, (req: any, res) => {
  const { key, value } = req.body;
  db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)')
    .run(key, value, new Date().toISOString());
  res.json({ success: true });
});

// ==================== MARKETING ROUTES ====================

// Generate marketing content
app.post('/api/admin/marketing/generate', authenticateToken, requireAdmin, (req: any, res) => {
  const { type } = req.body;
  const content = aiGenerator.generateMarketingContent(type);
  res.json(content);
});

// ==================== CRON JOBS ====================

// Monthly AI product generation (1st of every month at 2 AM)
cron.schedule('0 2 1 * *', () => {
  console.log('Running monthly AI product generation...');
  const products = aiGenerator.generateProducts(14); // 2 products per category
  const inserted = aiGenerator.saveGeneratedProducts(products);
  console.log(`Generated ${inserted} new products`);
});

// Weekly marketing content generation (Mondays at 9 AM)
cron.schedule('0 9 * * 1', () => {
  console.log('Generating weekly marketing content...');
  // Queue marketing campaigns
  const emailContent = aiGenerator.generateMarketingContent('email');
  const socialContent = aiGenerator.generateMarketingContent('social');
  
  db.prepare(`
    INSERT INTO marketing_campaigns (id, name, type, content, status, created_at)
    VALUES (?, ?, 'email', ?, 'ready', ?)
  `).run(uuidv4(), 'Weekly Newsletter', JSON.stringify(emailContent), new Date().toISOString());

  db.prepare(`
    INSERT INTO marketing_campaigns (id, name, type, content, status, created_at)
    VALUES (?, ?, 'social', ?, 'ready', ?)
  `).run(uuidv4(), 'Weekly Social Posts', JSON.stringify(socialContent), new Date().toISOString());
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
