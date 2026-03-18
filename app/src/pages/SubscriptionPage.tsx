import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Crown, Check, Sparkles, Zap, Shield, Loader2,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 29.99,
    period: 'month',
    description: 'Perfect for trying out premium',
    features: [
      'Unlimited downloads',
      'All product categories',
      'New products weekly',
      'Cancel anytime',
      'Email support'
    ],
    notIncluded: [
      'Priority support',
      'Early access'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 299.99,
    period: 'year',
    description: 'Best value - Save $60',
    popular: true,
    features: [
      'Everything in Monthly',
      'Priority support',
      'Early access to new products',
      'Exclusive premium products',
      'API access',
      'Custom requests'
    ],
    notIncluded: []
  }
];

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubscribe = async () => {
    if (!agreed) {
      toast.error('Please agree to the terms');
      return;
    }

    try {
      setLoading(true);
      const plan = plans.find(p => p.id === selectedPlan);
      await api.createSubscription('premium', plan?.period || 'monthly');
      toast.success('Subscription created successfully!');
      refreshUser();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user?.subscriptionTier === 'premium';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Crown className="h-3 w-3 mr-1" />
            Premium Access
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Unlock Unlimited Downloads
          </h1>
          <p className="text-lg text-muted-foreground">
            Get instant access to our entire library of AI-generated digital products.
            New products added every week.
          </p>
        </div>

        {/* Current Status */}
        {isPremium && (
          <Card className="mb-8 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">You have Premium Access!</h3>
                  <p className="text-muted-foreground">
                    Enjoy unlimited downloads of all our digital products.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-violet-500 shadow-lg' : ''} ${
                selectedPlan === plan.id ? 'ring-2 ring-violet-500' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    {selectedPlan === plan.id && (
                      <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                      <span className="text-sm line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        {!isPremium && (
          <div className="max-w-md mx-auto">
            <div className="flex items-start gap-3 mb-6">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the subscription terms. I understand that I will be charged 
                ${selectedPlan === 'monthly' ? '29.99 monthly' : '299.99 yearly'} and can cancel anytime.
              </label>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Instant Access
              </span>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">What happens to my downloads if I cancel?</h4>
                <p className="text-sm text-muted-foreground">
                  Any products you've downloaded remain yours forever. You just won't be able to download new products after cancellation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">How often are new products added?</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI generates new products every week across all categories. Premium members get early access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
