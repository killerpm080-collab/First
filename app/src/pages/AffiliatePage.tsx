import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { AffiliateEarning } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, Users, TrendingUp, Copy, CheckCircle,
  Link2, Gift, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AffiliatePage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<AffiliateEarning[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const data = await api.getAffiliateEarnings();
      setEarnings(data.earnings);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const copyAffiliateLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.affiliateCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied!');
  };

  const copyAffiliateCode = () => {
    navigator.clipboard.writeText(user?.affiliateCode || '');
    toast.success('Affiliate code copied!');
  };

  const shareOptions = [
    { name: 'Twitter', icon: 'X', color: 'bg-black' },
    { name: 'Facebook', icon: 'F', color: 'bg-blue-600' },
    { name: 'LinkedIn', icon: 'in', color: 'bg-blue-700' },
    { name: 'Email', icon: '@', color: 'bg-green-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500">
            <DollarSign className="h-3 w-3 mr-1" />
            Affiliate Program
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Earn 30% Commission
          </h1>
          <p className="text-lg text-muted-foreground">
            Refer customers and earn lifetime commissions on all their purchases.
            No limits, no caps.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats?.total_referrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold">{stats?.converted_referrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${(stats?.total_earnings || 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">${(stats?.pending_earnings || 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Affiliate Link */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Affiliate Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Referral Link</label>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/register?ref=${user?.affiliateCode}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyAffiliateLink}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Affiliate Code</label>
                  <div className="flex gap-2">
                    <Input
                      value={user?.affiliateCode}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={copyAffiliateCode}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Share On</label>
                  <div className="flex gap-2">
                    {shareOptions.map((option) => (
                      <Button
                        key={option.name}
                        variant="outline"
                        size="icon"
                        className={`${option.color} text-white border-0 hover:opacity-90`}
                        onClick={() => toast.info(`${option.name} sharing coming soon!`)}
                      >
                        <span className="font-bold">{option.icon}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Link2 className="h-6 w-6 text-violet-600" />
                    </div>
                    <h4 className="font-semibold mb-1">1. Share Your Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your unique affiliate link with your audience
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">2. They Sign Up</h4>
                    <p className="text-sm text-muted-foreground">
                      Users register using your referral code
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="h-6 w-6 text-amber-600" />
                    </div>
                    <h4 className="font-semibold mb-1">3. You Earn</h4>
                    <p className="text-sm text-muted-foreground">
                      Get 30% on every purchase they make
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </div>
                ) : earnings.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No earnings yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start sharing your link to earn!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {earnings.slice(0, 10).map((earning) => (
                      <div
                        key={earning.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">${earning.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(earning.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                          {earning.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card className="mt-6 bg-gradient-to-br from-violet-50 to-fuchsia-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                    30%
                  </div>
                  <p className="font-medium mb-1">Commission Rate</p>
                  <p className="text-sm text-muted-foreground">
                    On every purchase your referrals make
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
