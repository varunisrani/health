import React, { useState } from 'react';
import { usePrivacy } from '@/context/PrivacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Mail,
  BarChart3,
  HeartHandshake
} from 'lucide-react';
import { ConsentRecord } from '@/types';

export const ConsentManager: React.FC = () => {
  const {
    consentRecords,
    grantConsent,
    revokeConsent,
    hasValidConsent,
    getConsentVersion,
    loading
  } = usePrivacy();

  const [processingConsent, setProcessingConsent] = useState<string | null>(null);

  const consentTypes = [
    {
      type: 'privacy' as const,
      title: 'Privacy Policy',
      description: 'Consent to our privacy policy and data processing practices',
      icon: Shield,
      required: true,
      version: '2.1'
    },
    {
      type: 'hipaa' as const,
      title: 'HIPAA Authorization',
      description: 'Authorization for use and disclosure of protected health information',
      icon: HeartHandshake,
      required: true,
      version: '1.3'
    },
    {
      type: 'marketing' as const,
      title: 'Marketing Communications',
      description: 'Receive promotional emails, newsletters, and special offers',
      icon: Mail,
      required: false,
      version: '1.0'
    },
    {
      type: 'analytics' as const,
      title: 'Analytics & Performance',
      description: 'Help us improve our services through usage analytics',
      icon: BarChart3,
      required: false,
      version: '1.1'
    },
    {
      type: 'terms' as const,
      title: 'Terms of Service',
      description: 'Agreement to our terms and conditions of service',
      icon: FileText,
      required: true,
      version: '3.0'
    }
  ];

  const handleConsentToggle = async (consentType: ConsentRecord['consentType'], currentlyGranted: boolean) => {
    setProcessingConsent(consentType);
    
    try {
      const consentConfig = consentTypes.find(c => c.type === consentType);
      if (!consentConfig) return;

      if (currentlyGranted) {
        await revokeConsent(consentType);
      } else {
        await grantConsent(consentType, consentConfig.version);
      }
    } finally {
      setProcessingConsent(null);
    }
  };

  const getConsentStatus = (consentType: ConsentRecord['consentType']) => {
    const isValid = hasValidConsent(consentType);
    const latestRecord = consentRecords
      .filter(r => r.consentType === consentType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (!latestRecord) {
      return { status: 'none', color: 'gray', icon: Clock };
    }

    if (isValid) {
      return { status: 'granted', color: 'brown', icon: CheckCircle };
    } else if (latestRecord.granted) {
      return { status: 'expired', color: 'orange', icon: AlertTriangle };
    } else {
      return { status: 'revoked', color: 'red', icon: XCircle };
    }
  };

  const getConsentHistory = (consentType: ConsentRecord['consentType']) => {
    return consentRecords
      .filter(r => r.consentType === consentType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3); // Show last 3 records
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Consent Management</h2>
          <p className="text-gray-600">Manage your consent preferences and view consent history</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          GDPR Compliant
        </Badge>
      </div>

      {/* Current Consent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {consentTypes.map((consent) => {
          const isGranted = hasValidConsent(consent.type);
          const status = getConsentStatus(consent.type);
          const Icon = consent.icon;
          const StatusIcon = status.icon;
          const currentVersion = getConsentVersion(consent.type);
          const isProcessing = processingConsent === consent.type;

          return (
            <Card key={consent.type} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${status.color}-100`}>
                      <Icon className={`h-5 w-5 text-${status.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {consent.title}
                        {consent.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {consent.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.color as any} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.status}
                    </Badge>
                    {!consent.required && (
                      <Switch
                        checked={isGranted}
                        onCheckedChange={() => handleConsentToggle(consent.type, isGranted)}
                        disabled={isProcessing || loading}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Version and Date Info */}
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Current Version:</span>
                    <span className="ml-1 font-medium">v{consent.version}</span>
                  </div>
                  {currentVersion && (
                    <div>
                      <span className="text-gray-600">Your Version:</span>
                      <span className="ml-1 font-medium">
                        v{currentVersion}
                        {currentVersion !== consent.version && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Update Available
                          </Badge>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Consent History */}
                {getConsentHistory(consent.type).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent History</h4>
                    <div className="space-y-1">
                      {getConsentHistory(consent.type).map((record, index) => (
                        <div key={`${record.timestamp}-${index}`} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            {record.granted ? (
                              <CheckCircle className="h-3 w-3 text-hc-primary" />
                            ) : (
                              <XCircle className="h-3 w-3 text-hc-warning" />
                            )}
                            <span>
                              {record.granted ? 'Granted' : 'Revoked'} v{record.version}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {record.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions for Required Consents */}
                {consent.required && !isGranted && (
                  <div className="pt-2 border-t">
                    <Button
                      onClick={() => handleConsentToggle(consent.type, false)}
                      disabled={isProcessing || loading}
                      className="w-full bg-hc-primary hover:bg-hc-primary/90"
                    >
                      {isProcessing ? 'Processing...' : `Grant ${consent.title}`}
                    </Button>
                  </div>
                )}

                {/* Version Update Notice */}
                {currentVersion && currentVersion !== consent.version && (
                  <div className="pt-2 border-t">
                    <div className="flex items-start gap-2 p-2 bg-hc-secondary/10 rounded">
                      <AlertTriangle className="h-4 w-4 text-hc-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="text-hc-primary font-medium">Update Available</p>
                        <p className="text-hc-secondary">
                          A new version of the {consent.title.toLowerCase()} is available.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleConsentToggle(consent.type, false)}
                          disabled={isProcessing || loading}
                          className="mt-2 bg-hc-accent hover:bg-hc-accent/90"
                        >
                          Review & Update
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Consent Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-hc-surface rounded-lg">
              <div className="text-2xl font-bold text-hc-primary">
                {consentTypes.filter(c => hasValidConsent(c.type)).length}
              </div>
              <div className="text-sm text-hc-primary">Active Consents</div>
            </div>
            <div className="p-4 bg-hc-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-hc-warning">
                {consentTypes.filter(c => {
                  const currentVersion = getConsentVersion(c.type);
                  return currentVersion && currentVersion !== c.version;
                }).length}
              </div>
              <div className="text-sm text-hc-warning">Pending Updates</div>
            </div>
            <div className="p-4 bg-hc-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-hc-accent">
                {consentRecords.length}
              </div>
              <div className="text-sm text-hc-accent">Total Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="border-hc-warning/20 bg-hc-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-hc-warning mt-0.5" />
            <div className="text-sm">
              <p className="text-hc-primary font-medium mb-1">Important Legal Notice</p>
              <p className="text-hc-secondary">
                Your consent choices are legally binding and affect how we process your personal data. 
                You can withdraw consent at any time, though this may limit some service features. 
                For questions about consent or data processing, please contact our Data Protection Officer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};