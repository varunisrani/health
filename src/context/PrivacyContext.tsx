import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ConsentRecord, 
  PrivacySettings, 
  DataExportRequest, 
  DataDeletionRequest,
  ComplianceReport,
  ApiResponse 
} from '@/types';
import { auditService } from '@/services/auditService';
import { encryptionService } from '@/services/encryptionService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface PrivacyContextType {
  privacySettings: PrivacySettings | null;
  consentRecords: ConsentRecord[];
  dataExportRequests: DataExportRequest[];
  dataDeletionRequests: DataDeletionRequest[];
  anonymousMode: boolean;
  loading: boolean;
  
  // Actions
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<boolean>;
  grantConsent: (consentType: ConsentRecord['consentType'], version: string) => Promise<boolean>;
  revokeConsent: (consentType: ConsentRecord['consentType']) => Promise<boolean>;
  requestDataExport: (format: DataExportRequest['format'], includeData: DataExportRequest['includeData']) => Promise<boolean>;
  requestDataDeletion: (reason?: string, retainData?: DataDeletionRequest['retainData']) => Promise<boolean>;
  cancelDataDeletion: (requestId: string) => Promise<boolean>;
  toggleAnonymousMode: () => Promise<boolean>;
  generateComplianceReport: (reportType: ComplianceReport['reportType'], startDate: Date, endDate: Date) => Promise<ComplianceReport | null>;
  
  // Computed properties
  hasValidConsent: (consentType: ConsentRecord['consentType']) => boolean;
  getConsentVersion: (consentType: ConsentRecord['consentType']) => string | null;
  canRequestDeletion: boolean;
  hasActiveDeletionRequest: boolean;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [dataExportRequests, setDataExportRequests] = useState<DataExportRequest[]>([]);
  const [dataDeletionRequests, setDataDeletionRequests] = useState<DataDeletionRequest[]>([]);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      loadPrivacyData();
    }
  }, [user]);

  const loadPrivacyData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadPrivacySettings(),
        loadConsentRecords(),
        loadDataExportRequests(),
        loadDataDeletionRequests()
      ]);
    } catch (error) {
      console.error('Failed to load privacy data:', error);
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const loadPrivacySettings = async () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`privacy_settings_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPrivacySettings({
        ...parsed,
        updatedAt: new Date(parsed.updatedAt)
      });
      setAnonymousMode(parsed.anonymousMode || false);
    } else {
      // Create default privacy settings
      const defaultSettings: PrivacySettings = {
        userId: user.id,
        dataCollection: true,
        analytics: true,
        marketing: false,
        anonymousMode: false,
        dataRetention: 365 * 7, // 7 years for HIPAA compliance
        shareWithTherapists: true,
        shareForResearch: false,
        profileVisibility: 'therapists_only',
        communicationPreferences: {
          email: true,
          sms: false,
          push: true,
          inApp: true
        },
        updatedAt: new Date(),
        updatedBy: user.id
      };
      
      setPrivacySettings(defaultSettings);
      localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(defaultSettings));
      
      // Grant default consents
      await grantConsent('privacy', '1.0');
      await grantConsent('hipaa', '1.0');
    }
  };

  const loadConsentRecords = async () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`consent_records_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConsentRecords(parsed.map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp),
        expiresAt: record.expiresAt ? new Date(record.expiresAt) : undefined
      })));
    }
  };

  const loadDataExportRequests = async () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`data_export_requests_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setDataExportRequests(parsed.map((request: any) => ({
        ...request,
        requestedAt: new Date(request.requestedAt),
        completedAt: request.completedAt ? new Date(request.completedAt) : undefined,
        expiresAt: request.expiresAt ? new Date(request.expiresAt) : undefined
      })));
    }
  };

  const loadDataDeletionRequests = async () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`data_deletion_requests_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setDataDeletionRequests(parsed.map((request: any) => ({
        ...request,
        requestedAt: new Date(request.requestedAt),
        scheduledFor: new Date(request.scheduledFor),
        completedAt: request.completedAt ? new Date(request.completedAt) : undefined
      })));
    }
  };

  const updatePrivacySettings = async (settingsUpdate: Partial<PrivacySettings>): Promise<boolean> => {
    if (!user || !privacySettings) return false;
    
    try {
      const oldSettings = { ...privacySettings };
      const updatedSettings: PrivacySettings = {
        ...privacySettings,
        ...settingsUpdate,
        updatedAt: new Date(),
        updatedBy: user.id
      };
      
      setPrivacySettings(updatedSettings);
      localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(updatedSettings));
      
      // Update anonymous mode state if changed
      if (settingsUpdate.anonymousMode !== undefined) {
        setAnonymousMode(settingsUpdate.anonymousMode);
      }
      
      // Log privacy settings changes
      for (const [key, newValue] of Object.entries(settingsUpdate)) {
        if (oldSettings[key as keyof PrivacySettings] !== newValue) {
          await auditService.logPrivacyChange(
            user.id, 
            key, 
            oldSettings[key as keyof PrivacySettings], 
            newValue
          );
        }
      }
      
      toast.success('Privacy settings updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      toast.error('Failed to update privacy settings');
      return false;
    }
  };

  const grantConsent = async (consentType: ConsentRecord['consentType'], version: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const consentRecord: ConsentRecord = {
        userId: user.id,
        consentType,
        version,
        granted: true,
        timestamp: new Date(),
        ipAddress: '192.168.1.100', // Mock IP
        userAgent: navigator.userAgent,
        method: 'explicit',
        expiresAt: consentType === 'marketing' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined // Marketing consent expires in 1 year
      };
      
      // Remove any previous consent for this type
      const updatedRecords = consentRecords.filter(r => r.consentType !== consentType);
      updatedRecords.push(consentRecord);
      
      setConsentRecords(updatedRecords);
      localStorage.setItem(`consent_records_${user.id}`, JSON.stringify(updatedRecords));
      
      // Log consent change
      await auditService.logConsentChange(user.id, consentType, true, version);
      
      toast.success(`${consentType.charAt(0).toUpperCase() + consentType.slice(1)} consent granted`);
      return true;
    } catch (error) {
      console.error('Failed to grant consent:', error);
      toast.error('Failed to grant consent');
      return false;
    }
  };

  const revokeConsent = async (consentType: ConsentRecord['consentType']): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const currentConsent = consentRecords.find(r => r.consentType === consentType && r.granted);
      if (!currentConsent) {
        toast.error('No active consent found to revoke');
        return false;
      }
      
      const consentRecord: ConsentRecord = {
        userId: user.id,
        consentType,
        version: currentConsent.version,
        granted: false,
        timestamp: new Date(),
        ipAddress: '192.168.1.100', // Mock IP
        userAgent: navigator.userAgent,
        method: 'explicit'
      };
      
      const updatedRecords = [...consentRecords, consentRecord];
      setConsentRecords(updatedRecords);
      localStorage.setItem(`consent_records_${user.id}`, JSON.stringify(updatedRecords));
      
      // Log consent change
      await auditService.logConsentChange(user.id, consentType, false, currentConsent.version);
      
      toast.success(`${consentType.charAt(0).toUpperCase() + consentType.slice(1)} consent revoked`);
      return true;
    } catch (error) {
      console.error('Failed to revoke consent:', error);
      toast.error('Failed to revoke consent');
      return false;
    }
  };

  const requestDataExport = async (
    format: DataExportRequest['format'], 
    includeData: DataExportRequest['includeData']
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const request: DataExportRequest = {
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        requestedAt: new Date(),
        status: 'pending',
        format,
        includeData
      };
      
      const updatedRequests = [...dataExportRequests, request];
      setDataExportRequests(updatedRequests);
      localStorage.setItem(`data_export_requests_${user.id}`, JSON.stringify(updatedRequests));
      
      // Log data export request
      await auditService.logDataExport(user.id, 'full_export', format);
      
      // Simulate processing - in real app this would be handled by backend
      setTimeout(async () => {
        const completedRequest = {
          ...request,
          status: 'completed' as const,
          completedAt: new Date(),
          downloadUrl: `https://api.mendedminds.com/exports/${request.id}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
        };
        
        const finalRequests = dataExportRequests.map(r => 
          r.id === request.id ? completedRequest : r
        );
        setDataExportRequests(finalRequests);
        localStorage.setItem(`data_export_requests_${user.id}`, JSON.stringify(finalRequests));
        
        toast.success('Data export completed! Download link has been generated.');
      }, 3000);
      
      toast.success('Data export request submitted. You will be notified when it\'s ready.');
      return true;
    } catch (error) {
      console.error('Failed to request data export:', error);
      toast.error('Failed to request data export');
      return false;
    }
  };

  const requestDataDeletion = async (
    reason?: string, 
    retainData?: DataDeletionRequest['retainData']
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 30); // 30-day grace period
      
      const request: DataDeletionRequest = {
        id: `deletion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        requestedAt: new Date(),
        scheduledFor: scheduledDate,
        status: 'pending',
        reason,
        retainData: retainData || {
          legal: true,
          billing: true,
          auditLogs: true
        },
        confirmationToken: encryptionService.generateSecureToken(16)
      };
      
      const updatedRequests = [...dataDeletionRequests, request];
      setDataDeletionRequests(updatedRequests);
      localStorage.setItem(`data_deletion_requests_${user.id}`, JSON.stringify(updatedRequests));
      
      // Log data deletion request
      await auditService.logDataDeletion(user.id, 'full_deletion');
      
      toast.success(`Data deletion scheduled for ${scheduledDate.toLocaleDateString()}. You can cancel this request within 30 days.`);
      return true;
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      toast.error('Failed to request data deletion');
      return false;
    }
  };

  const cancelDataDeletion = async (requestId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedRequests = dataDeletionRequests.map(r => 
        r.id === requestId ? { ...r, status: 'cancelled' as const } : r
      );
      
      setDataDeletionRequests(updatedRequests);
      localStorage.setItem(`data_deletion_requests_${user.id}`, JSON.stringify(updatedRequests));
      
      // Log cancellation
      await auditService.logEvent(user.id, 'data_deletion_cancelled', 'user_data', { requestId });
      
      toast.success('Data deletion request cancelled');
      return true;
    } catch (error) {
      console.error('Failed to cancel data deletion:', error);
      toast.error('Failed to cancel data deletion');
      return false;
    }
  };

  const toggleAnonymousMode = async (): Promise<boolean> => {
    if (!user || !privacySettings) return false;
    
    const newAnonymousMode = !anonymousMode;
    
    // Update privacy settings
    await updatePrivacySettings({ anonymousMode: newAnonymousMode });
    
    // Log anonymous mode change
    await auditService.logEvent(user.id, 'anonymous_mode_toggled', 'privacy_settings', {
      anonymousMode: newAnonymousMode
    });
    
    toast.success(`Anonymous mode ${newAnonymousMode ? 'enabled' : 'disabled'}`);
    return true;
  };

  const generateComplianceReport = async (
    reportType: ComplianceReport['reportType'], 
    startDate: Date, 
    endDate: Date
  ): Promise<ComplianceReport | null> => {
    if (!user) return null;
    
    try {
      const report = await auditService.generateComplianceReport(user.id, reportType, startDate, endDate);
      
      toast.success('Compliance report generated successfully');
      return report;
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      toast.error('Failed to generate compliance report');
      return null;
    }
  };

  // Helper functions
  const hasValidConsent = (consentType: ConsentRecord['consentType']): boolean => {
    const latestConsent = consentRecords
      .filter(r => r.consentType === consentType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    if (!latestConsent || !latestConsent.granted) return false;
    
    // Check if consent has expired
    if (latestConsent.expiresAt && latestConsent.expiresAt < new Date()) {
      return false;
    }
    
    return true;
  };

  const getConsentVersion = (consentType: ConsentRecord['consentType']): string | null => {
    const latestConsent = consentRecords
      .filter(r => r.consentType === consentType && r.granted)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    return latestConsent?.version || null;
  };

  // Computed properties
  const hasActiveDeletionRequest = dataDeletionRequests.some(r => 
    r.status === 'pending' || r.status === 'scheduled'
  );
  const canRequestDeletion = !hasActiveDeletionRequest;

  return (
    <PrivacyContext.Provider value={{
      privacySettings,
      consentRecords,
      dataExportRequests,
      dataDeletionRequests,
      anonymousMode,
      loading,
      updatePrivacySettings,
      grantConsent,
      revokeConsent,
      requestDataExport,
      requestDataDeletion,
      cancelDataDeletion,
      toggleAnonymousMode,
      generateComplianceReport,
      hasValidConsent,
      getConsentVersion,
      canRequestDeletion,
      hasActiveDeletionRequest,
    }}>
      {children}
    </PrivacyContext.Provider>
  );
};