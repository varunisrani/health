// Re-export all types for easy importing
export * from './subscription';
export * from './privacy';

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'trial_expiring' | 'payment_failed' | 'privacy_update' | 'consent_renewal' | 'security_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
  stack?: string;
}