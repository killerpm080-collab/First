import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, BookOpen, GraduationCap, FileText, Palette, Music, Code,
  ArrowRight, Star, Zap, TrendingUp, Sparkles, Check
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons: Record<string, React.ElementType> = {
  'ai-tools': Brain,
  'ebooks': BookOpen,
  'courses': GraduationCap,
  'templates': FileText,
  'graphics': Palette,
  'audio': Music,
  'software': Code,
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [featuredRes, trendingRes, newRes, categoriesRes] = await Promise.all([
        api.getProducts({ featured: true, limit: 4 }),
        api.getProducts({ trending: true, limit: 4 }),
        api.getProducts({ sort: 'newest', limit: 4 }),
        api.getCategories()
      ]);

      setFeaturedProducts(featuredRes.products);
      setTrendingProducts(trendingRes.products);
      setNewProducts(newRes.products);
      setCategories(categoriesRes);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Marketplace
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Premium Digital Products
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              AI-generated tools, templates, courses, and more. New products added automatically every month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/subscription">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  Get Premium Access
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>50+ AI-Generated Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Instant Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || Brain;
              return (
                <Link key={category.id} to={`/products?category=${category.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: category.color }} />
                      </div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.productCount} products
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked by our AI for quality</p>
            </div>
            <Link to="/products?featured=true">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground mt-1">Most popular this week</p>
              </div>
            </div>
            <Link to="/products?trending=true">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">Fresh from our AI generator</p>
              </div>
            </div>
            <Link to="/products?sort=newest">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get Unlimited Access
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Subscribe to Premium and download any product. Cancel anytime.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Monthly</h3>
                  <div className="text-4xl font-bold mb-4">$29.99</div>
                  <p className="text-sm text-white/70 mb-4">per month</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Unlimited downloads
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      All product categories
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Cancel anytime
                    </li>
                  </ul>
                  <Link to="/subscription">
                    <Button className="w-full" variant="secondary">
                      Subscribe Monthly
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    Best Value
                  </Badge>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Yearly</h3>
                  <div className="text-4xl font-bold mb-4">$299.99</div>
                  <p className="text-sm text-white/70 mb-4">per year (save $60)</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Everything in Monthly
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Early access to new products
                    </li>
                  </ul>
                  <Link to="/subscription">
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                      Subscribe Yearly
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                      Join Our Affiliate Program
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Earn 30% commission on every sale you refer. Lifetime earnings on all customer purchases.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-bold text-sm">1</span>
                        </div>
                        <span className="text-sm">Sign up for free</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-bold text-sm">2</span>
                        </div>
                        <span className="text-sm">Share your unique link</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-bold text-sm">3</span>
                        </div>
                        <span className="text-sm">Earn 30% on every sale</span>
                      </div>
                    </div>
                    <Link to="/affiliate">
                      <Button>
                        Become an Affiliate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden lg:flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="text-center text-white">
                        <div className="text-5xl font-bold">30%</div>
                        <div className="text-sm opacity-80">Commission</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group h-full flex flex-col">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/400x300/8B5CF6/FFFFFF?text=${encodeURIComponent(product.title.slice(0, 20))}`;
            }}
          />
          {product.ai_generated && (
            <Badge className="absolute top-2 left-2 bg-violet-500/90 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
          {product.new_arrival && (
            <Badge className="absolute top-2 right-2 bg-green-500/90 text-white">
              New
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${product.category_color}20`,
                color: product.category_color 
              }}
            >
              {product.category_name}
            </span>
          </div>
          <h3 className="font-semibold line-clamp-2 mb-2 flex-1">{product.title}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.review_count})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              {product.compare_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.sales_count} sold
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
