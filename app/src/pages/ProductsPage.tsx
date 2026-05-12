import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search, Filter, Grid3X3, List, Star, Sparkles, 
  ChevronLeft, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const featuredFilter = searchParams.get('featured') === 'true';
  const trendingFilter = searchParams.get('trending') === 'true';

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({
        category: categoryFilter || undefined,
        search: searchQuery || undefined,
        sort: sortBy,
        page: pagination.page,
        limit: pagination.limit,
        featured: featuredFilter || undefined,
        trending: trendingFilter || undefined
      });
      setProducts(response.products);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery, sortBy, pagination.page, pagination.limit, featuredFilter, trendingFilter]);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const getPageTitle = () => {
    if (featuredFilter) return 'Featured Products';
    if (trendingFilter) return 'Trending Products';
    if (categoryFilter) {
      const cat = categories.find(c => c.id === categoryFilter);
      return cat ? cat.name : 'Products';
    }
    if (searchQuery) return `Search: "${searchQuery}"`;
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {pagination.total} products available
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={(v) => updateFilter('category', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={(v) => updateFilter('sort', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-2">
              <Select value={categoryFilter} onValueChange={(v) => updateFilter('category', v)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => updateFilter('sort', v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(categoryFilter || searchQuery || featuredFilter || trendingFilter) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryFilter && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('category', '')}>
                Category: {categories.find(c => c.id === categoryFilter)?.name}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('search', '')}>
                Search: {searchQuery}
                <span className="ml-1">×</span>
              </Badge>
            )}
            {featuredFilter && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('featured', '')}>
                Featured
                <span className="ml-1">×</span>
              </Badge>
            )}
            {trendingFilter && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('trending', '')}>
                Trending
                <span className="ml-1">×</span>
              </Badge>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilter('page', String(pagination.page - 1))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilter('page', String(pagination.page + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ 
  product, 
  viewMode, 
  onAddToCart 
}: { 
  product: Product; 
  viewMode: 'grid' | 'list';
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
}) {
  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.slug}`}>
        <Card className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
          <div className="flex">
            <div className="w-48 h-32 bg-muted relative overflow-hidden flex-shrink-0">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x300/8B5CF6/FFFFFF?text=${encodeURIComponent(product.title.slice(0, 20))}`;
                }}
              />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col justify-between">
              <div>
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
                  {product.ai_generated && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  {product.compare_price > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <Button size="sm" onClick={(e) => onAddToCart(e, product)}>
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

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
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.short_description}</p>
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
            <Button size="sm" onClick={(e) => onAddToCart(e, product)}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
