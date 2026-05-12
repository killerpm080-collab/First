import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, Trash2, Minus, Plus, ArrowRight, 
  Package, Shield, Clock, Gift 
} from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.thumbnail}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/200x200/8B5CF6/FFFFFF?text=Product`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product?.slug}`}
                        className="font-semibold hover:text-primary line-clamp-2"
                      >
                        {item.product?.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product?.category_name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between">
              <Link to="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="ghost" onClick={clearCart} className="text-destructive">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="pt-4">
                  <label className="text-sm font-medium mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4 text-green-500" />
                <span>Digital Products</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gift className="h-4 w-4 text-green-500" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
