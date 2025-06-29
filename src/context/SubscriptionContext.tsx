import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Subscription, 
  SubscriptionPlan, 
  PaymentMethod, 
  BillingHistory, 
  UsageMetrics,
  Notification,
  ApiResponse 
} from '@/types';
import { subscriptionService } from '@/services/subscriptionService';
import { auditService } from '@/services/auditService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  usageMetrics: UsageMetrics | null;
  notifications: Notification[];
  loading: boolean;
  upgrading: boolean;
  
  // Actions
  loadPlans: () => Promise<void>;
  loadPaymentMethods: () => Promise<void>;
  loadBillingHistory: () => Promise<void>;
  loadUsageMetrics: () => Promise<void>;
  addPaymentMethod: (paymentData: any) => Promise<boolean>;
  upgradeToPremium: (billingCycle: 'monthly' | 'yearly', paymentMethodId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getTrialExtension: () => Promise<boolean>;
  dismissNotification: (notificationId: string) => void;
  
  // Computed properties
  canUpgrade: boolean;
  canCancel: boolean;
  hasPaymentMethod: boolean;
  currentPlan: SubscriptionPlan | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, subscription, trialStatus, refreshSubscription, isTrialExpiring } = useAuth();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      loadInitialData();
      checkForTrialNotifications();
    }
  }, [user]);

  // Check for trial expiration notifications
  useEffect(() => {
    if (isTrialExpiring && trialStatus) {
      createTrialExpiringNotification();
    }
  }, [isTrialExpiring, trialStatus]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlans(),
        loadPaymentMethods(),
        loadBillingHistory(),
        loadUsageMetrics()
      ]);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      toast.error('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const plansData = await subscriptionService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    try {
      const methods = await subscriptionService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const loadBillingHistory = async () => {
    if (!user) return;
    
    try {
      const history = await subscriptionService.getBillingHistory(user.id);
      setBillingHistory(history);
    } catch (error) {
      console.error('Failed to load billing history:', error);
    }
  };

  const loadUsageMetrics = async () => {
    if (!user) return;
    
    try {
      const metrics = await subscriptionService.getUsageMetrics(user.id);
      setUsageMetrics(metrics);
    } catch (error) {
      console.error('Failed to load usage metrics:', error);
    }
  };

  const addPaymentMethod = async (paymentData: any): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await subscriptionService.addPaymentMethod(user.id, paymentData);
      
      if (response.success && response.data) {
        setPaymentMethods(prev => [...prev.map(pm => ({ ...pm, isDefault: false })), response.data!]);
        
        // Log payment method addition
        await auditService.logEvent(user.id, 'payment_method_added', 'billing', {
          paymentMethodId: response.data.id,
          type: response.data.type
        });
        
        toast.success('Payment method added successfully');
        return true;
      } else {
        toast.error(response.error?.message || 'Failed to add payment method');
        return false;
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
      toast.error('Failed to add payment method');
      return false;
    }
  };

  const upgradeToPremium = async (billingCycle: 'monthly' | 'yearly', paymentMethodId: string): Promise<boolean> => {
    if (!user) return false;
    
    setUpgrading(true);
    try {
      const response = await subscriptionService.upgradeToPremium(user.id, billingCycle, paymentMethodId);
      
      if (response.success) {
        await refreshSubscription();
        await loadBillingHistory(); // Refresh billing history
        
        // Create success notification
        createNotification(
          'subscription_upgraded',
          'Subscription Upgraded!',
          `Welcome to Mended Minds Premium! Your ${billingCycle} subscription is now active.`,
          'medium'
        );
        
        // Log upgrade
        await auditService.logEvent(user.id, 'subscription_upgraded', 'subscription', {
          planType: 'premium',
          billingCycle,
          paymentMethodId
        });
        
        toast.success('Successfully upgraded to Premium!');
        return true;
      } else {
        toast.error(response.error?.message || 'Failed to upgrade subscription');
        return false;
      }
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      toast.error('Failed to upgrade subscription');
      return false;
    } finally {
      setUpgrading(false);
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await subscriptionService.cancelSubscription(user.id);
      
      if (response.success) {
        await refreshSubscription();
        
        // Create cancellation notification
        createNotification(
          'subscription_cancelled',
          'Subscription Cancelled',
          'Your subscription has been cancelled. You\'ll continue to have access until the end of your billing period.',
          'medium'
        );
        
        // Log cancellation
        await auditService.logEvent(user.id, 'subscription_cancelled', 'subscription');
        
        toast.success('Subscription cancelled successfully');
        return true;
      } else {
        toast.error(response.error?.message || 'Failed to cancel subscription');
        return false;
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
      return false;
    }
  };

  const getTrialExtension = async (): Promise<boolean> => {
    if (!user || !trialStatus?.canExtend) return false;
    
    try {
      // Mock trial extension - extend by 3 days
      const currentSubscription = await subscriptionService.getUserSubscription(user.id);
      if (currentSubscription && currentSubscription.trialEndDate) {
        const extendedDate = new Date(currentSubscription.trialEndDate);
        extendedDate.setDate(extendedDate.getDate() + 3);
        
        const updatedSubscription = {
          ...currentSubscription,
          trialEndDate: extendedDate,
          updatedAt: new Date()
        };
        
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));
        await refreshSubscription();
        
        // Create extension notification
        createNotification(
          'trial_extended',
          'Trial Extended!',
          'Your free trial has been extended by 3 days. Enjoy exploring Mended Minds!',
          'medium'
        );
        
        // Log extension
        await auditService.logEvent(user.id, 'trial_extended', 'subscription', {
          extensionDays: 3,
          newEndDate: extendedDate
        });
        
        toast.success('Trial extended by 3 days!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to extend trial:', error);
      toast.error('Failed to extend trial');
      return false;
    }
  };

  const createNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'],
    actionUrl?: string
  ) => {
    if (!user) return;
    
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type,
      title,
      message,
      priority,
      read: false,
      actionRequired: !!actionUrl,
      actionUrl,
      createdAt: new Date()
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  const createTrialExpiringNotification = () => {
    if (!trialStatus) return;
    
    // Check if we already have a trial expiring notification
    const hasExistingNotification = notifications.some(n => 
      n.type === 'trial_expiring' && !n.read
    );
    
    if (!hasExistingNotification) {
      createNotification(
        'trial_expiring',
        'Trial Expiring Soon!',
        `Your free trial expires in ${trialStatus.daysRemaining} day${trialStatus.daysRemaining !== 1 ? 's' : ''}. Upgrade to Premium to continue enjoying all features.`,
        'high',
        '/subscription'
      );
    }
  };

  const checkForTrialNotifications = () => {
    if (!trialStatus) return;
    
    // Create trial expiring notification if needed
    if (trialStatus.daysRemaining <= 3 && trialStatus.isActive) {
      createTrialExpiringNotification();
    }
    
    // Create trial expired notification
    if (trialStatus.hasExpired) {
      const hasExpiredNotification = notifications.some(n => 
        n.type === 'trial_expiring' && n.title.includes('Expired')
      );
      
      if (!hasExpiredNotification) {
        createNotification(
          'trial_expiring',
          'Trial Expired',
          'Your free trial has expired. Upgrade to Premium to regain access to all features.',
          'urgent',
          '/subscription'
        );
      }
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Computed properties
  const canUpgrade = subscription?.planType === 'free' || subscription?.planType === 'trial';
  const canCancel = subscription?.planType === 'premium' || subscription?.planType === 'enterprise';
  const hasPaymentMethod = paymentMethods.length > 0;
  const currentPlan = plans.find(p => p.planType === subscription?.planType) || null;

  return (
    <SubscriptionContext.Provider value={{
      plans,
      paymentMethods,
      billingHistory,
      usageMetrics,
      notifications,
      loading,
      upgrading,
      loadPlans,
      loadPaymentMethods,
      loadBillingHistory,
      loadUsageMetrics,
      addPaymentMethod,
      upgradeToPremium,
      cancelSubscription,
      getTrialExtension,
      dismissNotification,
      canUpgrade,
      canCancel,
      hasPaymentMethod,
      currentPlan,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};