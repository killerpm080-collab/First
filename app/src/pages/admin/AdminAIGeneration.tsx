import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, Play, Pause, Loader2, CheckCircle,
  Clock, AlertCircle, Brain
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAIGeneration() {
  const [generating, setGenerating] = useState(false);
  const [settings, setSettings] = useState({
    autoGenerate: true,
    monthlyBatch: 14,
    marketingEnabled: true
  });

  const handleGenerateBatch = async () => {
    try {
      setGenerating(true);
      const result = await api.generateAIProducts(14);
      toast.success(`Generated ${result.generated} new products`);
    } catch (error) {
      toast.error('Failed to generate products');
    } finally {
      setGenerating(false);
    }
  };

  const toggleAutoGeneration = () => {
    setSettings({ ...settings, autoGenerate: !settings.autoGenerate });
    toast.success(`Auto-generation ${settings.autoGenerate ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Generation</h1>
        <p className="text-muted-foreground">Manage AI-powered product creation</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Status</p>
                <p className="text-xl font-bold text-violet-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products Generated</p>
                <p className="text-xl font-bold">50+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Generation</p>
                <p className="text-xl font-bold">1st of Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleGenerateBatch} 
              disabled={generating}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate 10 Products Now
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={toggleAutoGeneration}
              className="flex-1"
            >
              {settings.autoGenerate ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Auto-Generation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume Auto-Generation
                </>
              )}
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Batch Size</span>
              <span className="text-sm text-muted-foreground">{settings.monthlyBatch} products</span>
            </div>
            <Progress value={70} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              AI generates {settings.monthlyBatch} products on the 1st of each month (2 per category)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'AI Tools', count: 8, color: 'bg-violet-500' },
              { name: 'eBooks', count: 7, color: 'bg-blue-500' },
              { name: 'Courses', count: 7, color: 'bg-green-500' },
              { name: 'Templates', count: 7, color: 'bg-amber-500' },
              { name: 'Graphics', count: 7, color: 'bg-pink-500' },
              { name: 'Audio', count: 7, color: 'bg-red-500' },
              { name: 'Software', count: 7, color: 'bg-indigo-500' },
            ].map((cat) => (
              <div key={cat.name} className="p-4 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${cat.color} mb-2`} />
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat.count} products</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Automatic Generation</p>
                <p className="text-sm text-muted-foreground">
                  Generate products automatically every month
                </p>
              </div>
              <Badge variant={settings.autoGenerate ? 'default' : 'secondary'}>
                {settings.autoGenerate ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Marketing Automation</p>
                <p className="text-sm text-muted-foreground">
                  Auto-generate social posts and email campaigns
                </p>
              </div>
              <Badge variant={settings.marketingEnabled ? 'default' : 'secondary'}>
                {settings.marketingEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Product Quality</p>
                <p className="text-sm text-muted-foreground">
                  AI generation quality level
                </p>
              </div>
              <Badge>Premium</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">About AI Generation</h4>
              <p className="text-sm text-muted-foreground">
                Our AI automatically generates high-quality digital products based on market trends 
                and customer demand. Products are created with professional titles, descriptions, 
                and pricing. The system runs on the 1st of every month at 2 AM UTC.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
