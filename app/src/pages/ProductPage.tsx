import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Product, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { 
  Star, ShoppingCart, Heart, Share2, FileText, 
  Sparkles, Check, Clock, Shield, Zap, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product & { reviews: Review[]; related: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(slug!);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    
    try {
      setSubmittingReview(true);
      await api.addReview(product.id, reviewRating, reviewComment);
      toast.success('Review submitted successfully');
      setReviewComment('');
      loadProduct(); // Refresh to show new review
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-12 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_id}`} className="hover:text-primary">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x600/8B5CF6/FFFFFF?text=${encodeURIComponent(product.title.slice(0, 30))}`;
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  style={{ 
                    backgroundColor: `${product.category_color}20`,
                    color: product.category_color 
                  }}
                >
                  {product.category_name}
                </Badge>
                {product.ai_generated && (
                  <Badge className="bg-violet-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
                {product.new_arrival && (
                  <Badge className="bg-green-500 text-white">New</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({product.review_count} reviews)</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{product.sales_count} sold</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
              {product.compare_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
              {product.compare_price > product.price && (
                <Badge className="bg-green-500 text-white">
                  Save {Math.round((1 - product.price / product.compare_price) * 100)}%
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.short_description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span>7-Day Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Lifetime Updates</span>
              </div>
            </div>

            {/* File Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{product.file_type}</p>
                    <p className="text-sm text-muted-foreground">{product.file_size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.review_count})</TabsTrigger>
              <TabsTrigger value="related">Related Products</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {product.description.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-medium mt-3 mb-1">{line.slice(4)}</h3>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.slice(2)}</li>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {product.reviews?.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    product.reviews?.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                <span className="font-medium">{review.user_name?.[0]}</span>
                              </div>
                              <div>
                                <p className="font-medium">{review.user_name}</p>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-3 text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                <div>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Write a Review</h3>
                      {isAuthenticated ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setReviewRating(i + 1)}
                                  className="p-1"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      i < reviewRating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Comment</label>
                            <Textarea
                              placeholder="Share your experience..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleSubmitReview}
                            disabled={submittingReview || !reviewComment.trim()}
                          >
                            Submit Review
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-muted-foreground mb-4">Please login to write a review</p>
                          <Link to="/login">
                            <Button className="w-full">Login</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="related" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.related?.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/products/${relatedProduct.slug}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group h-full">
                      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                        <img
                          src={relatedProduct.thumbnail}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/8B5CF6/FFFFFF?text=${encodeURIComponent(relatedProduct.title.slice(0, 20))}`;
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 mb-2">{relatedProduct.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{relatedProduct.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
