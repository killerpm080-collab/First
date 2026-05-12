import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Menu, Search, Heart, Package } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">DigitalMarket</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/products?featured=true" className="text-sm font-medium hover:text-primary transition-colors">
                Featured
              </Link>
              <Link to="/products?trending=true" className="text-sm font-medium hover:text-primary transition-colors">
                Trending
              </Link>
              <Link to="/subscription" className="text-sm font-medium hover:text-primary transition-colors">
                Premium
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
                <Search className="h-5 w-5" />
              </Button>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/subscription')}>
                      <Package className="mr-2 h-4 w-4" />
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/affiliate')}>
                      <User className="mr-2 h-4 w-4" />
                      Affiliate Program
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button onClick={() => navigate('/register')}>
                    Sign Up
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-2">
                <Link to="/products" className="px-4 py-2 hover:bg-muted rounded-md">
                  Products
                </Link>
                <Link to="/products?featured=true" className="px-4 py-2 hover:bg-muted rounded-md">
                  Featured
                </Link>
                <Link to="/products?trending=true" className="px-4 py-2 hover:bg-muted rounded-md">
                  Trending
                </Link>
                <Link to="/subscription" className="px-4 py-2 hover:bg-muted rounded-md">
                  Premium
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className="px-4 py-2 hover:bg-muted rounded-md">
                      Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 hover:bg-muted rounded-md">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-16rem)]">
        {children || <div className="container mx-auto px-4 py-8" />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-bold text-xl">DigitalMarket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered digital marketplace with automated product generation, marketing, and sales.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products?category=ai-tools" className="text-muted-foreground hover:text-primary">AI Tools</Link></li>
                <li><Link to="/products?category=ebooks" className="text-muted-foreground hover:text-primary">eBooks</Link></li>
                <li><Link to="/products?category=courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
                <li><Link to="/products?category=templates" className="text-muted-foreground hover:text-primary">Templates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/account" className="text-muted-foreground hover:text-primary">My Account</Link></li>
                <li><Link to="/orders" className="text-muted-foreground hover:text-primary">Order History</Link></li>
                <li><Link to="/downloads" className="text-muted-foreground hover:text-primary">Downloads</Link></li>
                <li><Link to="/subscription" className="text-muted-foreground hover:text-primary">Subscription</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Earn</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/affiliate" className="text-muted-foreground hover:text-primary">Affiliate Program</Link></li>
                <li><span className="text-muted-foreground">30% Commission</span></li>
                <li><span className="text-muted-foreground">Lifetime Earnings</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AI Digital Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
