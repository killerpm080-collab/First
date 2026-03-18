# AI Digital Marketplace

A fully automated, AI-powered digital products eCommerce platform that requires zero manual work after setup.

## Features

### Admin Panel & Full Control
- Full admin access to edit, add, remove products, categories, pricing, banners, and design
- Analytics dashboard with sales, revenue, top products, monthly growth, traffic, and customer stats
- Admin can override AI operations, but default AI actions run automatically

### Automated AI Product Generation
- Preloaded with 50 digital products with titles, descriptions, thumbnails, prices, categories, and tags
- AI automatically generates new products every month across 7 categories:
  - AI Tools & Scripts
  - eBooks & Guides
  - Online Courses & Tutorials
  - Templates & Printables
  - Graphics & Designs
  - Audio & Music Products
  - Software & Utilities

### Customer Features & Payments
- Browse, search, filter, and sort products by category, price, popularity, or newest
- Secure download links with password protection
- Multiple payment methods (Card, PayPal, Bank Transfer)
- Customer accounts with order tracking, wishlists, reviews, and subscriptions

### Security & Reliability
- Unique, secure, time-limited download links (7 days, max 5 downloads)
- Automatic invoices and order confirmations
- JWT-based authentication

### Marketing Automation
- AI generates social media posts, email campaigns, and promotional content
- Built-in affiliate program with 30% commission

### Subscriptions & Memberships
- Monthly ($29.99) and Yearly ($299.99) subscription plans
- Unlimited downloads for premium members

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT
- **AI Generation**: Custom templates and algorithms

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production

```bash
# Build and start production server
npm start
```

## Default Login Credentials

### Admin
- Email: `admin@digitalmarket.ai`
- Password: `admin123`

### Customer
- Create your own account through the registration page

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:slug` - Get single product
- `GET /api/categories` - List categories

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/:orderId/pay` - Process payment
- `GET /api/orders` - Get user orders

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/ai/generate-products` - Generate AI products

## Directory Structure

```
├── server/           # Backend API
│   ├── index.ts      # Main server file
│   ├── database.ts   # Database setup
│   └── aiProductGenerator.ts  # AI generation logic
├── src/              # Frontend React app
│   ├── components/   # UI components
│   ├── contexts/     # React contexts
│   ├── layouts/      # Page layouts
│   ├── lib/          # Utilities
│   ├── pages/        # Page components
│   └── types/        # TypeScript types
├── dist/             # Built frontend
└── data/             # SQLite database
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
JWT_SECRET=your-secret-key
```

## AI Automation Schedule

- **Monthly Product Generation**: 1st of every month at 2 AM UTC
- **Weekly Marketing Content**: Every Monday at 9 AM UTC

## License

MIT
