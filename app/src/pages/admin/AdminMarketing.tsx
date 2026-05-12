import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Megaphone, Mail, Share2, Image, Loader2, Copy,
  CheckCircle, Send, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMarketing() {
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('email');

  const handleGenerate = async (type: string) => {
    try {
      setGenerating(true);
      const content = await api.generateMarketingContent(type);
      setGeneratedContent(content);
      toast.success('Content generated!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Marketing Automation</h1>
        <p className="text-muted-foreground">AI-powered marketing content generation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-xl font-bold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Social Posts</p>
                <p className="text-xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-sm text-muted-foreground">Campaigns</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-xl font-bold">42%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Generator */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="mr-2 h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="banner">
            <Image className="mr-2 h-4 w-4" />
            Banners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Email Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleGenerate('email')} 
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Email Content
                  </>
                )}
              </Button>

              {generatedContent?.subject && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject Line</label>
                    <div className="flex gap-2">
                      <Input value={generatedContent.subject} readOnly />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedContent.subject)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Body</label>
                    <div className="relative">
                      <Textarea 
                        value={generatedContent.body} 
                        readOnly 
                        className="min-h-[200px]"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedContent.body)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Schedule Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Social Media Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleGenerate('social')} 
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Social Post
                  </>
                )}
              </Button>

              {generatedContent?.content && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Post Content</label>
                    <div className="relative">
                      <Textarea 
                        value={generatedContent.content} 
                        readOnly 
                        className="min-h-[150px]"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedContent.content)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  {generatedContent.hashtags && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hashtags</label>
                      <div className="flex gap-2">
                        <Input value={generatedContent.hashtags} readOnly />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(generatedContent.hashtags)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Banner Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleGenerate('banner')} 
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Banner Text
                  </>
                )}
              </Button>

              {generatedContent?.headline && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Headline</label>
                    <div className="flex gap-2">
                      <Input value={generatedContent.headline} readOnly />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedContent.headline)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subheadline</label>
                    <div className="flex gap-2">
                      <Input value={generatedContent.subheadline} readOnly />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedContent.subheadline)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">CTA Text</label>
                    <div className="flex gap-2">
                      <Input value={generatedContent.cta} readOnly />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedContent.cta)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Scheduled Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Weekly Newsletter</p>
                <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">New Product Announcement</p>
                <p className="text-sm text-muted-foreground">1st of every month</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Social Media Posts</p>
                <p className="text-sm text-muted-foreground">3x per week</p>
              </div>
              <Badge>Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
