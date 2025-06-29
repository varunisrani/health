export interface Subscription {
  id: string;
  userId: string;
  planType: 'free' | 'trial' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  trialStartDate?: Date;
  trialEndDate?: Date;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate?: Date;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  planType: 'free' | 'trial' | 'premium' | 'enterprise';
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limitations: {
    maxSessions?: number;
    maxTherapists?: number;
    storageLimit?: number; // in GB
  };
  popular?: boolean;
}

export interface BillingHistory {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  billingDate: Date;
  nextBillingDate?: Date;
  paymentMethodId: string;
}

export interface TrialStatus {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  hasExpired: boolean;
  canExtend: boolean;
}

export interface UsageMetrics {
  userId: string;
  period: 'monthly' | 'yearly';
  sessionsUsed: number;
  storageUsed: number; // in GB
  therapistsContacted: number;
  lastUpdated: Date;
}