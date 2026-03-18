import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Download } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Download as DownloadIcon, Lock, Copy, CheckCircle,
  AlertCircle, Clock, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function DownloadsPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifiedUrl, setVerifiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadDownloads();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const data = await api.getDownloads(orderId!);
      setDownloads(data);
    } catch (error) {
      toast.error('Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const result = await api.verifyDownload(verifyToken, verifyPassword);
      if (result.valid) {
        setVerifiedUrl(result.fileUrl);
        toast.success('Download verified!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid download credentials');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Downloads</h1>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Downloads</h1>

        {/* Verify Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Verify Download
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                placeholder="Download Token"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
              />
              <Input
                placeholder="Download Password"
                type="password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
              <Button onClick={handleVerify}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify & Download
              </Button>
            </div>
            {verifiedUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 mb-2">Download verified successfully!</p>
                <a href={verifiedUrl} download>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Downloads List */}
        {downloads.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Downloads Available</h3>
              <p className="text-muted-foreground">
                Your downloads will appear here after you make a purchase.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {downloads.map((download) => (
              <Card key={download.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{download.product_title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{download.file_type}</span>
                          <span>•</span>
                          <span>{download.file_size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expires: {new Date(download.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">
                            {download.download_count} / {download.max_downloads} downloads
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={download.download_token}
                          readOnly
                          className="w-32 text-xs font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(download.download_token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={download.download_password}
                          type="password"
                          readOnly
                          className="w-24 text-xs font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(download.download_password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Security Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Download links expire after 7 days</li>
                  <li>• Maximum 5 downloads per product</li>
                  <li>• Each download requires a unique password</li>
                  <li>• Do not share your download credentials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
