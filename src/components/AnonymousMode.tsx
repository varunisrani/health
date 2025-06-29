import React, { useState } from 'react';
import { usePrivacy } from '@/context/PrivacyContext';
import { useEncryption } from '@/hooks/useEncryption';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  EyeOff, 
  Eye, 
  Shield, 
  UserX, 
  Globe, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';

export const AnonymousMode: React.FC = () => {
  const {
    anonymousMode,
    toggleAnonymousMode,
    privacySettings,
    loading
  } = usePrivacy();

  const {
    isEncryptionEnabled,
    toggleEncryption
  } = useEncryption();

  const [isToggling, setIsToggling] = useState(false);

  const handleToggleAnonymousMode = async () => {
    setIsToggling(true);
    try {
      await toggleAnonymousMode();
    } finally {
      setIsToggling(false);
    }
  };

  const anonymousFeatures = [
    {
      title: 'No Personal Identifiers',
      description: 'Your name, email, and profile information are hidden from therapists',
      enabled: anonymousMode,
      icon: UserX
    },
    {
      title: 'Encrypted Communications',
      description: 'All messages and session data are end-to-end encrypted',
      enabled: anonymousMode && isEncryptionEnabled,
      icon: Lock
    },
    {
      title: 'Anonymous Session IDs',
      description: 'Sessions are identified by anonymous IDs instead of your name',
      enabled: anonymousMode,
      icon: Shield
    },
    {
      title: 'No Usage Tracking',
      description: 'Your browsing patterns and app usage are not tracked',
      enabled: anonymousMode && !privacySettings?.analytics,
      icon: EyeOff
    },
    {
      title: 'Temporary Data Storage',
      description: 'Session data is automatically purged after completion',
      enabled: anonymousMode,
      icon: Zap
    },
    {
      title: 'VPN-Friendly',
      description: 'Works seamlessly with VPN and privacy tools',
      enabled: anonymousMode,
      icon: Globe
    }
  ];

  const limitations = [
    'Therapist matching may be less personalized',
    'Some premium features may not be available',
    'Session history is limited to current session only',
    'Recovery options are reduced if you lose access',
    'Billing and payment features are restricted'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Anonymous Mode</h2>
          <p className="text-gray-600">Use Mended Minds without revealing your identity</p>
        </div>
        <Badge 
          variant={anonymousMode ? "default" : "secondary"} 
          className="flex items-center gap-1"
        >
          {anonymousMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {anonymousMode ? 'Anonymous' : 'Identified'}
        </Badge>
      </div>

      {/* Anonymous Mode Toggle */}
      <Card className={`${anonymousMode ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5" />
            Anonymous Mode Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Enable Anonymous Mode</h4>
              <p className="text-sm text-gray-600">
                Hide your identity and use the platform anonymously with enhanced privacy protections
              </p>
            </div>
            <Switch
              checked={anonymousMode}
              onCheckedChange={handleToggleAnonymousMode}
              disabled={isToggling || loading}
            />
          </div>

          {anonymousMode && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Anonymous mode is active. Your identity is protected and your activities are not linked to your personal information.
              </AlertDescription>
            </Alert>
          )}

          {!anonymousMode && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                You are currently using Mended Minds with your identified account. Enable anonymous mode for enhanced privacy.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Privacy Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anonymousFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    feature.enabled 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      {feature.enabled ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Anonymous Mode Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Anonymous Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-700">Enhanced Privacy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete identity protection</li>
                <li>• No personal data linkage</li>
                <li>• Anonymous session tracking</li>
                <li>• Encrypted communications</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-700">Security Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduced data breach impact</li>
                <li>• No targeted profiling</li>
                <li>• Minimal data retention</li>
                <li>• Enhanced encryption</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Limitations in Anonymous Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-orange-800 space-y-2">
            {limitations.map((limitation, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Data Protection</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• AES-256-GCM encryption</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Ephemeral session keys</li>
                <li>• Forward secrecy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Network Security</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• TLS 1.3 transport encryption</li>
                <li>• Certificate pinning</li>
                <li>• DNS over HTTPS</li>
                <li>• IP address masking</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Compliance & Standards:</p>
            <p>
              Anonymous mode complies with GDPR privacy-by-design principles, 
              HIPAA security requirements, and follows industry best practices 
              for anonymous healthcare platforms.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!anonymousMode && (
        <Card className="bg-hc-surface border-hc-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Ready to go anonymous?</h4>
                <p className="text-sm text-gray-600">
                  Enhance your privacy and use Mended Minds anonymously
                </p>
              </div>
              <Button
                onClick={handleToggleAnonymousMode}
                disabled={isToggling}
                className="bg-hc-primary hover:bg-hc-primary/90"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {isToggling ? 'Enabling...' : 'Enable Anonymous Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};