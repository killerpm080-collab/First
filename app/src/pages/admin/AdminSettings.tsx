import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, Save, Loader2, Globe, DollarSign, Percent
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      const settingsMap: Record<string, string> = {};
      data.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    try {
      setSaving(true);
      await api.updateSetting(key, value);
      toast.success('Setting saved');
    } catch (error) {
      toast.error('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your marketplace</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <div className="flex gap-2">
                <Input
                  id="site_name"
                  value={settings.site_name || ''}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                />
                <Button 
                  onClick={() => handleSave('site_name', settings.site_name)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <div className="flex gap-2">
                <Input
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                />
                <Button 
                  onClick={() => handleSave('site_description', settings.site_description)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing & Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_subscription_price">Monthly Price ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="monthly_subscription_price"
                  type="number"
                  value={settings.monthly_subscription_price || ''}
                  onChange={(e) => updateSetting('monthly_subscription_price', e.target.value)}
                />
                <Button 
                  onClick={() => handleSave('monthly_subscription_price', settings.monthly_subscription_price)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="yearly_subscription_price">Yearly Price ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="yearly_subscription_price"
                  type="number"
                  value={settings.yearly_subscription_price || ''}
                  onChange={(e) => updateSetting('yearly_subscription_price', e.target.value)}
                />
                <Button 
                  onClick={() => handleSave('yearly_subscription_price', settings.yearly_subscription_price)}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Affiliate Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="commission_rate">Commission Rate (%)</Label>
            <div className="flex gap-2">
              <Input
                id="commission_rate"
                type="number"
                value={settings.commission_rate || ''}
                onChange={(e) => updateSetting('commission_rate', e.target.value)}
              />
              <Button 
                onClick={() => handleSave('commission_rate', settings.commission_rate)}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Percentage affiliates earn on each sale
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">AI Product Generation</p>
              <p className="text-sm text-muted-foreground">
                Automatically generate new products monthly
              </p>
            </div>
            <Switch 
              checked={settings.ai_generation_enabled === 'true'}
              onCheckedChange={(checked) => handleSave('ai_generation_enabled', checked ? 'true' : 'false')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Auto Marketing</p>
              <p className="text-sm text-muted-foreground">
                Automatically generate marketing content
              </p>
            </div>
            <Switch 
              checked={settings.auto_marketing_enabled === 'true'}
              onCheckedChange={(checked) => handleSave('auto_marketing_enabled', checked ? 'true' : 'false')}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database</span>
              <span>SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Engine</span>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup</span>
              <span>Auto (Daily)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
