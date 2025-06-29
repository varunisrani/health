export interface ConsentRecord {
  userId: string;
  consentType: 'privacy' | 'marketing' | 'analytics' | 'hipaa' | 'terms';
  version: string;
  granted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  method: 'explicit' | 'implicit' | 'opt_out';
  expiresAt?: Date;
}

export interface PrivacySettings {
  userId: string;
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
  anonymousMode: boolean;
  dataRetention: number; // days
  shareWithTherapists: boolean;
  shareForResearch: boolean;
  profileVisibility: 'public' | 'private' | 'therapists_only';
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  updatedAt: Date;
  updatedBy: string;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'json' | 'csv' | 'pdf';
  downloadUrl?: string;
  expiresAt?: Date;
  includeData: {
    profile: boolean;
    sessions: boolean;
    messages: boolean;
    therapistInteractions: boolean;
    billingHistory: boolean;
    auditLogs: boolean;
  };
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  scheduledFor: Date;
  completedAt?: Date;
  status: 'pending' | 'scheduled' | 'processing' | 'completed' | 'cancelled';
  reason?: string;
  retainData: {
    legal: boolean;
    billing: boolean;
    auditLogs: boolean;
  };
  confirmationToken: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  details?: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceFlags: string[];
}

export interface EncryptionSettings {
  userId: string;
  encryptionEnabled: boolean;
  keyVersion: number;
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  encryptedFields: string[];
  lastKeyRotation: Date;
  nextKeyRotation: Date;
}

export interface ComplianceReport {
  id: string;
  userId: string;
  reportType: 'hipaa' | 'gdpr' | 'ccpa' | 'full';
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    dataAccesses: number;
    dataModifications: number;
    consentChanges: number;
    privacyViolations: number;
    securityIncidents: number;
  };
  violations: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  downloadUrl?: string;
}