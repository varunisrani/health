import { AuditLog, ComplianceReport, ApiResponse } from '@/types';
import { encryptionService } from './encryptionService';

export class AuditService {
  private static instance: AuditService;
  private maxLogRetention = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years in milliseconds

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  /**
   * Log an audit event
   */
  async logEvent(
    userId: string,
    action: string,
    resource: string,
    details?: Record<string, any>,
    resourceId?: string
  ): Promise<void> {
    try {
      const auditLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action,
        resource,
        resourceId,
        timestamp: new Date(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId(),
        details: details || {},
        riskLevel: this.assessRiskLevel(action, resource, details),
        complianceFlags: this.getComplianceFlags(action, resource)
      };

      // Store audit log
      await this.storeAuditLog(auditLog);

      // Check for compliance violations
      await this.checkComplianceViolations(auditLog);

      console.log('Audit event logged:', {
        action,
        resource,
        riskLevel: auditLog.riskLevel,
        timestamp: auditLog.timestamp
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Audit logging should never fail silently in a real application
    }
  }

  /**
   * Get audit logs for a user
   */
  async getUserAuditLogs(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<AuditLog[]> {
    const allLogs = await this.getStoredAuditLogs(userId);
    
    let filteredLogs = allLogs;
    
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
    }
    
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= endDate);
    }
    
    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    userId: string,
    reportType: 'hipaa' | 'gdpr' | 'ccpa' | 'full',
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    const logs = await this.getUserAuditLogs(userId, startDate, endDate, 10000);
    
    const metrics = {
      dataAccesses: logs.filter(log => log.action.includes('read') || log.action.includes('view')).length,
      dataModifications: logs.filter(log => log.action.includes('create') || log.action.includes('update') || log.action.includes('delete')).length,
      consentChanges: logs.filter(log => log.resource === 'consent').length,
      privacyViolations: logs.filter(log => log.riskLevel === 'high' || log.riskLevel === 'critical').length,
      securityIncidents: logs.filter(log => log.complianceFlags.includes('security_incident')).length
    };

    const violations = logs
      .filter(log => log.riskLevel === 'high' || log.riskLevel === 'critical')
      .map(log => ({
        type: log.action,
        severity: log.riskLevel as 'low' | 'medium' | 'high' | 'critical',
        description: `${log.action} on ${log.resource}${log.resourceId ? ` (${log.resourceId})` : ''}`,
        timestamp: log.timestamp,
        resolved: false // In a real app, this would be tracked separately
      }));

    const report: ComplianceReport = {
      id: `report_${Date.now()}`,
      userId,
      reportType,
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      metrics,
      violations
    };

    // Store report for future reference
    await this.storeComplianceReport(report);

    return report;
  }

  /**
   * Log data access for HIPAA compliance
   */
  async logDataAccess(
    userId: string,
    dataType: string,
    purpose: string,
    accessedBy?: string
  ): Promise<void> {
    await this.logEvent(
      userId,
      'data_access',
      'health_data',
      {
        dataType,
        purpose,
        accessedBy: accessedBy || userId,
        complianceType: 'hipaa'
      }
    );
  }

  /**
   * Log consent changes for GDPR compliance
   */
  async logConsentChange(
    userId: string,
    consentType: string,
    granted: boolean,
    version: string
  ): Promise<void> {
    await this.logEvent(
      userId,
      granted ? 'consent_granted' : 'consent_revoked',
      'consent',
      {
        consentType,
        version,
        complianceType: 'gdpr'
      }
    );
  }

  /**
   * Log privacy settings changes
   */
  async logPrivacyChange(
    userId: string,
    setting: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    await this.logEvent(
      userId,
      'privacy_settings_update',
      'privacy_settings',
      {
        setting,
        oldValue,
        newValue,
        complianceType: 'gdpr'
      }
    );
  }

  /**
   * Log data export requests
   */
  async logDataExport(userId: string, exportType: string, format: string): Promise<void> {
    await this.logEvent(
      userId,
      'data_export_requested',
      'user_data',
      {
        exportType,
        format,
        complianceType: 'gdpr'
      }
    );
  }

  /**
   * Log data deletion requests
   */
  async logDataDeletion(userId: string, deletionType: string): Promise<void> {
    await this.logEvent(
      userId,
      'data_deletion_requested',
      'user_data',
      {
        deletionType,
        complianceType: 'gdpr'
      },
      userId
    );
  }

  /**
   * Check for suspicious activity patterns
   */
  async detectSuspiciousActivity(userId: string): Promise<Array<{ type: string; description: string; severity: string }>> {
    const recentLogs = await this.getUserAuditLogs(userId, new Date(Date.now() - 24 * 60 * 60 * 1000)); // Last 24 hours
    const alerts: Array<{ type: string; description: string; severity: string }> = [];

    // Check for unusual access patterns
    const accessCounts = recentLogs.filter(log => log.action.includes('access')).length;
    if (accessCounts > 100) {
      alerts.push({
        type: 'excessive_access',
        description: `Unusual number of data access events: ${accessCounts}`,
        severity: 'medium'
      });
    }

    // Check for failed login attempts
    const failedLogins = recentLogs.filter(log => log.action === 'login_failed').length;
    if (failedLogins > 5) {
      alerts.push({
        type: 'brute_force',
        description: `Multiple failed login attempts: ${failedLogins}`,
        severity: 'high'
      });
    }

    // Check for data modifications outside business hours
    const businessHourViolations = recentLogs.filter(log => {
      const hour = log.timestamp.getHours();
      return (hour < 6 || hour > 22) && log.action.includes('update');
    }).length;

    if (businessHourViolations > 0) {
      alerts.push({
        type: 'off_hours_activity',
        description: `Data modifications outside business hours: ${businessHourViolations}`,
        severity: 'medium'
      });
    }

    return alerts;
  }

  /**
   * Clean up old audit logs (retention policy)
   */
  async cleanupOldLogs(): Promise<number> {
    const cutoffDate = new Date(Date.now() - this.maxLogRetention);
    const allUserKeys = Object.keys(localStorage).filter(key => key.startsWith('audit_logs_'));
    let deletedCount = 0;

    for (const key of allUserKeys) {
      const logs = JSON.parse(localStorage.getItem(key) || '[]');
      const filteredLogs = logs.filter((log: any) => new Date(log.timestamp) > cutoffDate);
      
      deletedCount += logs.length - filteredLogs.length;
      
      if (filteredLogs.length > 0) {
        localStorage.setItem(key, JSON.stringify(filteredLogs));
      } else {
        localStorage.removeItem(key);
      }
    }

    return deletedCount;
  }

  private async storeAuditLog(auditLog: AuditLog): Promise<void> {
    const key = `audit_logs_${auditLog.userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(auditLog);
    
    // Keep only recent logs in memory (last 1000 entries)
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private async getStoredAuditLogs(userId: string): Promise<AuditLog[]> {
    const key = `audit_logs_${userId}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) return [];
    
    return JSON.parse(stored).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }));
  }

  private async storeComplianceReport(report: ComplianceReport): Promise<void> {
    const key = `compliance_reports_${report.userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(report);
    
    // Keep only recent reports (last 50)
    if (existing.length > 50) {
      existing.splice(0, existing.length - 50);
    }
    
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private assessRiskLevel(action: string, resource: string, details?: Record<string, any>): 'low' | 'medium' | 'high' | 'critical' {
    // Critical risk actions
    if (action.includes('delete') && resource === 'user_data') return 'critical';
    if (action.includes('admin') || action.includes('privilege')) return 'critical';
    
    // High risk actions
    if (action.includes('export') || action.includes('download')) return 'high';
    if (resource.includes('health_data') && action.includes('access')) return 'high';
    if (action.includes('login_failed')) return 'high';
    
    // Medium risk actions
    if (action.includes('update') && resource.includes('privacy')) return 'medium';
    if (action.includes('consent') && details?.granted === false) return 'medium';
    
    // Default to low risk
    return 'low';
  }

  private getComplianceFlags(action: string, resource: string): string[] {
    const flags: string[] = [];
    
    if (resource.includes('health') || resource.includes('medical')) {
      flags.push('hipaa_relevant');
    }
    
    if (action.includes('consent') || action.includes('privacy') || action.includes('export') || action.includes('delete')) {
      flags.push('gdpr_relevant');
    }
    
    if (action.includes('failed') || action.includes('error') || action.includes('unauthorized')) {
      flags.push('security_incident');
    }
    
    if (action.includes('admin') || action.includes('privilege')) {
      flags.push('privileged_access');
    }
    
    return flags;
  }

  private async getClientIP(): Promise<string> {
    // In a real application, this would get the actual client IP
    // For demo purposes, return a mock IP
    return '192.168.1.100';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('mendedminds_session_id');
    if (!sessionId) {
      sessionId = encryptionService.generateSecureToken(16);
      sessionStorage.setItem('mendedminds_session_id', sessionId);
    }
    return sessionId;
  }

  private async checkComplianceViolations(auditLog: AuditLog): Promise<void> {
    // Check for potential compliance violations
    if (auditLog.riskLevel === 'critical' || auditLog.riskLevel === 'high') {
      console.warn('High-risk audit event detected:', auditLog);
      
      // In a real application, this would trigger alerts, notifications, or automatic responses
      if (auditLog.complianceFlags.includes('security_incident')) {
        console.error('Security incident detected:', auditLog);
      }
    }
  }
}

export const auditService = AuditService.getInstance();