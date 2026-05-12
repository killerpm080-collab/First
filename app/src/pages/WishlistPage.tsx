import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { WishlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, ShoppingCart, Trash2, Star, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.product_id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      thumbnail: item.thumbnail,
      category_id: '',
      description: '',
      short_description: '',
      compare_price: item.price,
      category_name: '',
      tags: [],
      gallery: [],
      file_url: '',
      file_size: '',
      file_type: '',
      download_count: 0,
      rating: item.rating,
      review_count: 0,
      sales_count: 0,
      status: 'active',
      featured: false,
      trending: false,
      new_arrival: false,
      ai_generated: false,
      created_at: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Save products you love to your wishlist and find them easily later.
            </p>
            <Link to="/products">
              <Button size="lg">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist ({wishlist.length})</h1>
          <Link to="/products">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <Link to={`/products/${item.slug}`}>
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/8B5CF6/FFFFFF?text=${encodeURIComponent(item.title.slice(0, 20))}`;
                    }}
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link to={`/products/${item.slug}`}>
                  <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeFromWishlist(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
