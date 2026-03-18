import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, Mail, Key, Copy, CheckCircle, Crown
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user } = useAuth();
  const [saving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Profile update coming soon');
  };

  const copyAffiliateCode = () => {
    if (user?.affiliateCode) {
      navigator.clipboard.writeText(user.affiliateCode);
      toast.success('Affiliate code copied!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user?.subscriptionTier === 'premium' ? 'default' : 'secondary'}>
                        {user?.subscriptionTier === 'premium' ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </>
                        ) : (
                          'Free'
                        )}
                      </Badge>
                      {user?.role === 'admin' && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Affiliate Code */}
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-xs text-muted-foreground mb-1 block">Your Affiliate Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={user?.affiliateCode || ''} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button size="icon" variant="outline" onClick={copyAffiliateCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this code to earn 30% commission
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>

                      <Button type="button" onClick={() => toast.info('Coming soon')}>
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your orders
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">New Products</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new products are added
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Promotions</p>
                          <p className="text-sm text-muted-foreground">
                            Receive special offers and discounts
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
