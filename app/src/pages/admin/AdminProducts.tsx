import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, MoreVertical, Edit, Trash2, Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProducts = async () => {
    try {
      setGenerating(true);
      const result = await api.generateAIProducts(10);
      toast.success(`Generated ${result.generated} new products`);
      loadProducts();
    } catch (error) {
      toast.error('Failed to generate products');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateProducts} disabled={generating}>
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate AI Products
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Product creation form coming soon. Use AI Generation for now.
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Sales</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/100x100/8B5CF6/FFFFFF?text=P`;
                            }}
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{product.title}</p>
                            {product.ai_generated && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span 
                          className="text-sm px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${product.category_color}20`,
                            color: product.category_color 
                          }}
                        >
                          {product.category_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                          {product.compare_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ${product.compare_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{product.sales_count}</span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info('Edit coming soon')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">
              {products.filter(p => p.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">AI Generated</p>
            <p className="text-2xl font-bold">
              {products.filter(p => p.ai_generated).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">
              {products.reduce((sum, p) => sum + p.sales_count, 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
