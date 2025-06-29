import { 
  Subscription, 
  SubscriptionPlan, 
  PaymentMethod, 
  BillingHistory, 
  TrialStatus, 
  UsageMetrics,
  ApiResponse 
} from '@/types';

// Mock data for development
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    planType: 'free',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Basic wellness library access',
      'Community support',
      'Basic health tracking'
    ],
    limitations: {
      maxSessions: 0,
      maxTherapists: 0,
      storageLimit: 0.1
    }
  },
  {
    id: 'trial',
    name: '14-Day Free Trial',
    planType: 'trial',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Full access to all premium features',
      'Unlimited therapist consultations',
      'Advanced health tracking',
      'Personalized wellness plans',
      'Priority support'
    ],
    limitations: {
      maxSessions: 999,
      maxTherapists: 999,
      storageLimit: 10
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    planType: 'premium',
    price: { monthly: 29.99, yearly: 299.99 },
    features: [
      'Unlimited therapist consultations',
      'Advanced health tracking',
      'Personalized wellness plans',
      'Priority support',
      'Offline access',
      'Data export'
    ],
    limitations: {
      maxSessions: 999,
      maxTherapists: 999,
      storageLimit: 10
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    planType: 'enterprise',
    price: { monthly: 99.99, yearly: 999.99 },
    features: [
      'Everything in Premium',
      'Team management',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'HIPAA compliance',
      'SSO integration'
    ],
    limitations: {
      maxSessions: 9999,
      maxTherapists: 9999,
      storageLimit: 100
    }
  }
];

export class SubscriptionService {
  private static instance: SubscriptionService;
  private baseUrl = '/api/subscriptions';

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    // Mock implementation - in real app, this would fetch from API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPlans;
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const savedSubscription = localStorage.getItem(`subscription_${userId}`);
    if (savedSubscription) {
      const parsed = JSON.parse(savedSubscription);
      return {
        ...parsed,
        trialStartDate: parsed.trialStartDate ? new Date(parsed.trialStartDate) : undefined,
        trialEndDate: parsed.trialEndDate ? new Date(parsed.trialEndDate) : undefined,
        nextBillingDate: parsed.nextBillingDate ? new Date(parsed.nextBillingDate) : undefined,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt)
      };
    }

    // Create default trial subscription for new users
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialStart.getDate() + 14);

    const defaultSubscription: Subscription = {
      id: `sub_${userId}_${Date.now()}`,
      userId,
      planType: 'trial',
      status: 'trial',
      trialStartDate: trialStart,
      trialEndDate: trialEnd,
      billingCycle: 'monthly',
      createdAt: trialStart,
      updatedAt: trialStart
    };

    localStorage.setItem(`subscription_${userId}`, JSON.stringify(defaultSubscription));
    return defaultSubscription;
  }

  async getTrialStatus(userId: string): Promise<TrialStatus | null> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || !subscription.trialStartDate || !subscription.trialEndDate) {
      return null;
    }

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((subscription.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const hasExpired = now > subscription.trialEndDate;
    
    return {
      isActive: subscription.status === 'trial' && !hasExpired,
      startDate: subscription.trialStartDate,
      endDate: subscription.trialEndDate,
      daysRemaining,
      hasExpired,
      canExtend: daysRemaining <= 3 && !hasExpired
    };
  }

  async startTrial(userId: string): Promise<ApiResponse<Subscription>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subscription = await this.getUserSubscription(userId);
      if (subscription) {
        return {
          success: false,
          error: {
            code: 'TRIAL_ALREADY_EXISTS',
            message: 'User already has an active subscription'
          },
          timestamp: new Date()
        };
      }

      const trialStart = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialStart.getDate() + 14);

      const newSubscription: Subscription = {
        id: `sub_${userId}_${Date.now()}`,
        userId,
        planType: 'trial',
        status: 'trial',
        trialStartDate: trialStart,
        trialEndDate: trialEnd,
        billingCycle: 'monthly',
        createdAt: trialStart,
        updatedAt: trialStart
      };

      localStorage.setItem(`subscription_${userId}`, JSON.stringify(newSubscription));

      return {
        success: true,
        data: newSubscription,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TRIAL_START_FAILED',
          message: 'Failed to start trial subscription'
        },
        timestamp: new Date()
      };
    }
  }

  async upgradeToPremium(userId: string, billingCycle: 'monthly' | 'yearly', paymentMethodId: string): Promise<ApiResponse<Subscription>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
      
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return {
          success: false,
          error: {
            code: 'SUBSCRIPTION_NOT_FOUND',
            message: 'No subscription found for user'
          },
          timestamp: new Date()
        };
      }

      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + (billingCycle === 'monthly' ? 1 : 12));

      const upgradedSubscription: Subscription = {
        ...subscription,
        planType: 'premium',
        status: 'active',
        billingCycle,
        nextBillingDate: nextBilling,
        paymentMethodId,
        updatedAt: new Date()
      };

      localStorage.setItem(`subscription_${userId}`, JSON.stringify(upgradedSubscription));

      return {
        success: true,
        data: upgradedSubscription,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPGRADE_FAILED',
          message: 'Failed to upgrade subscription'
        },
        timestamp: new Date()
      };
    }
  }

  async cancelSubscription(userId: string): Promise<ApiResponse<Subscription>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return {
          success: false,
          error: {
            code: 'SUBSCRIPTION_NOT_FOUND',
            message: 'No subscription found for user'
          },
          timestamp: new Date()
        };
      }

      const cancelledSubscription: Subscription = {
        ...subscription,
        status: 'cancelled',
        updatedAt: new Date()
      };

      localStorage.setItem(`subscription_${userId}`, JSON.stringify(cancelledSubscription));

      return {
        success: true,
        data: cancelledSubscription,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CANCELLATION_FAILED',
          message: 'Failed to cancel subscription'
        },
        timestamp: new Date()
      };
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem(`payment_methods_${userId}`);
    if (saved) {
      return JSON.parse(saved).map((pm: any) => ({
        ...pm,
        createdAt: new Date(pm.createdAt)
      }));
    }
    
    return [];
  }

  async addPaymentMethod(userId: string, paymentData: any): Promise<ApiResponse<PaymentMethod>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate Stripe processing
      
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        last4: paymentData.last4 || '4242',
        brand: paymentData.brand || 'visa',
        expiryMonth: paymentData.expiryMonth || 12,
        expiryYear: paymentData.expiryYear || 2025,
        isDefault: true,
        createdAt: new Date()
      };

      const existing = await this.getPaymentMethods(userId);
      const updated = [...existing.map(pm => ({ ...pm, isDefault: false })), newPaymentMethod];
      
      localStorage.setItem(`payment_methods_${userId}`, JSON.stringify(updated));

      return {
        success: true,
        data: newPaymentMethod,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_METHOD_FAILED',
          message: 'Failed to add payment method'
        },
        timestamp: new Date()
      };
    }
  }

  async getBillingHistory(userId: string): Promise<BillingHistory[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem(`billing_history_${userId}`);
    if (saved) {
      return JSON.parse(saved).map((bh: any) => ({
        ...bh,
        billingDate: new Date(bh.billingDate),
        nextBillingDate: bh.nextBillingDate ? new Date(bh.nextBillingDate) : undefined
      }));
    }
    
    return [];
  }

  async getUsageMetrics(userId: string): Promise<UsageMetrics> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      userId,
      period: 'monthly',
      sessionsUsed: Math.floor(Math.random() * 20),
      storageUsed: Math.random() * 5,
      therapistsContacted: Math.floor(Math.random() * 5),
      lastUpdated: new Date()
    };
  }
}

export const subscriptionService = SubscriptionService.getInstance();