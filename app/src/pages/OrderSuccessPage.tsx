import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, Download, Copy, Mail, ShoppingBag,
  ArrowRight, Lock
} from 'lucide-react';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadDownloads();
    }
  }, [orderId]);

  const loadDownloads = async () => {
    try {
      const data = await api.getDownloads(orderId!);
      setDownloads(data);
    } catch (error) {
      toast.error('Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Downloads */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Your Downloads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : downloads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No downloads available
                  </div>
                ) : (
                  downloads.map((download) => (
                    <div key={download.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{download.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {download.file_type} • {download.file_size}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Secure
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Token:</span>
                          <code className="bg-muted px-2 py-0.5 rounded text-xs">
                            {download.download_token.slice(0, 16)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(download.download_token)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Password:</span>
                          <code className="bg-muted px-2 py-0.5 rounded text-xs">
                            {download.download_password}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(download.download_password)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Expires: {new Date(download.expires_at).toLocaleDateString()} • 
                          Max {download.max_downloads} downloads
                        </p>
                        <Link to={`/downloads?token=${download.download_token}`}>
                          <Button size="sm" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Check Your Email</h4>
                    <p className="text-sm text-muted-foreground">
                      We've sent you an order confirmation with all the details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Download Your Products</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the secure links on the left to download your files.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Explore More</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover more amazing digital products in our marketplace.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link to="/orders" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button className="w-full">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
