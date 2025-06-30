import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  CreditCard, 
  Download, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Building,
  Zap
} from 'lucide-react';
import { TrialStatus } from './TrialStatus';
import { PaymentIntegration } from './PaymentIntegration';
import { SubscriptionPlan, BillingHistory } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export const SubscriptionManager: React.FC = () => {
  const { user, subscription, trialStatus } = useAuth();
  const {
    plans,
    paymentMethods,
    billingHistory,
    usageMetrics,
    loading,
    upgrading,
    cancelSubscription,
    canCancel,
    currentPlan
  } = useSubscription();
  const isMobile = useIsMobile();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgradeClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      const success = await cancelSubscription();
      if (success) {
        toast.success('Subscription cancelled successfully');
      }
    }
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    
    const statusConfig = {
      active: { color: 'default', icon: CheckCircle },
      trial: { color: 'secondary', icon: Zap },
      cancelled: { color: 'destructive', icon: XCircle },
      expired: { color: 'destructive', icon: AlertTriangle }
    };
    
    const config = statusConfig[subscription.status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.color as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
      </Badge>
    );
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return <Building className="h-5 w-5" />;
      case 'premium':
        return <Crown className="h-5 w-5" />;
      case 'trial':
        return <Zap className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number, cycle: 'monthly' | 'yearly') => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}${cycle === 'yearly' ? '/year' : '/month'}`;
  };

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const savingsPercentage = (savings / monthlyCost) * 100;
    return { savings, savingsPercentage };
  };

  return (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className={`flex items-center ${
            isMobile ? 'flex-col space-y-2' : 'justify-between'
          }`}>
            <CardTitle className={`flex items-center gap-2 ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>
              {currentPlan && getPlanIcon(currentPlan.planType)}
              Current Subscription
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "space-y-3" : "space-y-4"}>
          {subscription ? (
            <>
              <div className={`grid gap-3 sm:gap-4 ${
                isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
              }`}>
                <div className={isMobile ? "p-3 bg-hc-surface rounded-lg" : ""}>
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Plan</h4>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {currentPlan?.name || subscription.planType}
                  </p>
                </div>
                <div className={isMobile ? "p-3 bg-hc-surface rounded-lg" : ""}>
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Billing</h4>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {subscription.planType === 'trial' 
                      ? 'Free Trial' 
                      : subscription.billingCycle === 'monthly' 
                        ? 'Monthly' 
                        : 'Yearly'}
                  </p>
                </div>
                <div className={isMobile ? "p-3 bg-hc-surface rounded-lg" : ""}>
                  <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Next Billing</h4>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {subscription.nextBillingDate
                      ? subscription.nextBillingDate.toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Trial Status */}
              {subscription.planType === 'trial' && trialStatus && (
                <div className="pt-4">
                  <TrialStatus 
                    onUpgradeClick={() => handleUpgradeClick(plans.find(p => p.planType === 'premium')!)}
                  />
                </div>
              )}

              {/* Usage Metrics */}
              {usageMetrics && (
                <div className={`border-t ${isMobile ? 'pt-3' : 'pt-4'}`}>
                  <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Usage This Month
                  </h4>
                  <div className={`grid gap-3 sm:gap-4 ${
                    isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
                  } ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <div className="bg-hc-surface p-3 rounded-lg">
                      <div className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {usageMetrics.sessionsUsed}
                      </div>
                      <div className="text-gray-600">Sessions</div>
                    </div>
                    <div className="bg-hc-surface p-3 rounded-lg">
                      <div className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {usageMetrics.therapistsContacted}
                      </div>
                      <div className="text-gray-600">Therapists Contacted</div>
                    </div>
                    <div className="bg-hc-surface p-3 rounded-lg">
                      <div className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {usageMetrics.storageUsed.toFixed(1)} GB
                      </div>
                      <div className="text-gray-600">Storage Used</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No active subscription</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management Tabs */}
      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className={`grid w-full ${
          isMobile ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          <TabsTrigger value="plans" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Plans" : "Available Plans"}
          </TabsTrigger>
          <TabsTrigger value="billing" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Billing" : "Billing & Payments"}
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="history">Billing History</TabsTrigger>
          )}
          {isMobile && (
            <TabsTrigger value="history" className="text-xs px-2">History</TabsTrigger>
          )}
        </TabsList>

        {/* Available Plans */}
        <TabsContent value="plans" className="space-y-4">
          <div className={`flex items-center ${
            isMobile ? 'flex-col space-y-3' : 'justify-between'
          }`}>
            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
              Choose Your Plan
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBillingCycle('monthly')}
                className={isMobile ? "h-9 px-3 text-xs" : ""}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBillingCycle('yearly')}
                className={isMobile ? "h-9 px-3 text-xs" : ""}
              >
                Yearly
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 ${
            isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.planType === plan.planType;
              const price = plan.price[billingCycle];
              const { savings, savingsPercentage } = calculateYearlySavings(
                plan.price.monthly,
                plan.price.yearly
              );

              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${isCurrentPlan ? 'ring-2 ring-hc-primary' : ''} ${plan.popular ? 'ring-2 ring-hc-accent' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-hc-accent">
                      Most Popular
                    </Badge>
                  )}
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 right-4 bg-hc-primary">
                      Current Plan
                    </Badge>
                  )}

                  <CardHeader className={`text-center ${isMobile ? 'pb-2 px-4 pt-4' : 'pb-2'}`}>
                    <div className="flex justify-center mb-2">
                      {getPlanIcon(plan.planType)}
                    </div>
                    <CardTitle className={isMobile ? "text-base" : "text-lg"}>{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                        {formatPrice(price, billingCycle)}
                      </div>
                      {billingCycle === 'yearly' && price > 0 && (
                        <div className="text-xs text-amber-700">
                          Save ${savings.toFixed(0)} ({savingsPercentage.toFixed(0)}% off)
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className={`space-y-3 sm:space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
                    <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-hc-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {plan.limitations.maxSessions !== undefined && (
                          <div>Max Sessions: {plan.limitations.maxSessions === 999 ? 'Unlimited' : plan.limitations.maxSessions}</div>
                        )}
                        {plan.limitations.storageLimit !== undefined && (
                          <div>Storage: {plan.limitations.storageLimit} GB</div>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? 'outline' : 'hc-primary'}
                      disabled={isCurrentPlan || loading}
                      onClick={() => !isCurrentPlan && handleUpgradeClick(plan)}
                    >
                      {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Billing & Payments */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <div className="font-medium">
                            **** **** **** {method.last4}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.brand?.toUpperCase()} • Expires {method.expiryMonth}/{method.expiryYear}
                          </div>
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No payment methods added</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Actions */}
          {subscription && canCancel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-900">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cancel Subscription</h4>
                    <p className="text-sm text-gray-600">
                      You'll continue to have access until the end of your billing period
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={loading}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Billing History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billingHistory.length > 0 ? (
                <div className="space-y-3">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          ${bill.amount.toFixed(2)} {bill.currency.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {bill.billingDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                          {bill.status}
                        </Badge>
                        {bill.invoiceUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No billing history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentIntegration
          plan={selectedPlan}
          billingCycle={billingCycle}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            toast.success('Subscription upgraded successfully!');
          }}
        />
      )}
    </div>
  );
};