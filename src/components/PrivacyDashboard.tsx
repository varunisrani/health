import React, { useState } from 'react';
import { usePrivacy } from '@/context/PrivacyContext';
import { useEncryption } from '@/hooks/useEncryption';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  Bell, 
  Download,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ConsentManager } from './ConsentManager';
import { DataExport } from './DataExport';
import { AnonymousMode } from './AnonymousMode';

export const PrivacyDashboard: React.FC = () => {
  const {
    privacySettings,
    updatePrivacySettings,
    anonymousMode,
    canRequestDeletion,
    hasActiveDeletionRequest,
    requestDataDeletion,
    loading
  } = usePrivacy();

  const {
    settings: encryptionSettings,
    isEncryptionEnabled,
    toggleEncryption,
    keyRotationNeeded,
    daysUntilKeyRotation,
    rotateEncryptionKey,
    keyRotating
  } = useEncryption();

  const [activeTab, setActiveTab] = useState('settings');

  const handleSettingUpdate = async (setting: string, value: any) => {
    await updatePrivacySettings({ [setting]: value });
  };

  const handleCommunicationUpdate = async (channel: string, value: boolean) => {
    if (!privacySettings) return;
    
    await updatePrivacySettings({
      communicationPreferences: {
        ...privacySettings.communicationPreferences,
        [channel]: value
      }
    });
  };

  const handleDataDeletionRequest = async () => {
    if (window.confirm(
      'Are you sure you want to request account deletion? This action cannot be undone and will permanently delete all your data after a 30-day grace period.'
    )) {
      await requestDataDeletion('User requested account deletion');
    }
  };

  if (loading || !privacySettings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Privacy Dashboard</h2>
          <p className="text-gray-600">Control your privacy settings and data preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {anonymousMode && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              Anonymous Mode
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            GDPR & HIPAA Compliant
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="data">Data & Export</TabsTrigger>
          <TabsTrigger value="encryption">Security</TabsTrigger>
          <TabsTrigger value="anonymous">Anonymous Mode</TabsTrigger>
        </TabsList>

        {/* Privacy Settings */}
        <TabsContent value="settings" className="space-y-6">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Collection Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Data Collection</h4>
                  <p className="text-sm text-gray-600">
                    Allow collection of usage data to improve our services
                  </p>
                </div>
                <Switch
                  checked={privacySettings.dataCollection}
                  onCheckedChange={(value) => handleSettingUpdate('dataCollection', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how you use our platform
                  </p>
                </div>
                <Switch
                  checked={privacySettings.analytics}
                  onCheckedChange={(value) => handleSettingUpdate('analytics', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Marketing</h4>
                  <p className="text-sm text-gray-600">
                    Receive personalized marketing and recommendations
                  </p>
                </div>
                <Switch
                  checked={privacySettings.marketing}
                  onCheckedChange={(value) => handleSettingUpdate('marketing', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Sharing Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Share with Therapists</h4>
                  <p className="text-sm text-gray-600">
                    Allow therapists to access your health data and session history
                  </p>
                </div>
                <Switch
                  checked={privacySettings.shareWithTherapists}
                  onCheckedChange={(value) => handleSettingUpdate('shareWithTherapists', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Research Participation</h4>
                  <p className="text-sm text-gray-600">
                    Allow anonymized data to be used for health research
                  </p>
                </div>
                <Switch
                  checked={privacySettings.shareForResearch}
                  onCheckedChange={(value) => handleSettingUpdate('shareForResearch', value)}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-gray-600">
                    Control who can see your profile information
                  </p>
                </div>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) => handleSettingUpdate('profileVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Only You)</SelectItem>
                    <SelectItem value="therapists_only">Therapists Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-gray-600">Notifications via email</p>
                  </div>
                  <Switch
                    checked={privacySettings.communicationPreferences.email}
                    onCheckedChange={(value) => handleCommunicationUpdate('email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS</h4>
                    <p className="text-sm text-gray-600">Text message alerts</p>
                  </div>
                  <Switch
                    checked={privacySettings.communicationPreferences.sms}
                    onCheckedChange={(value) => handleCommunicationUpdate('sms', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Mobile app notifications</p>
                  </div>
                  <Switch
                    checked={privacySettings.communicationPreferences.push}
                    onCheckedChange={(value) => handleCommunicationUpdate('push', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">In-App</h4>
                    <p className="text-sm text-gray-600">Notifications within the app</p>
                  </div>
                  <Switch
                    checked={privacySettings.communicationPreferences.inApp}
                    onCheckedChange={(value) => handleCommunicationUpdate('inApp', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Data Retention Period</h4>
                  <p className="text-sm text-gray-600">
                    How long we keep your data (minimum 7 years for HIPAA compliance)
                  </p>
                </div>
                <Select
                  value={privacySettings.dataRetention.toString()}
                  onValueChange={(value) => handleSettingUpdate('dataRetention', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2555">7 years (HIPAA minimum)</SelectItem>
                    <SelectItem value="3653">10 years</SelectItem>
                    <SelectItem value="5479">15 years</SelectItem>
                    <SelectItem value="7305">20 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-800">Delete Account</h4>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data
                  </p>
                  {hasActiveDeletionRequest && (
                    <Badge variant="destructive" className="mt-1">
                      Deletion Pending
                    </Badge>
                  )}
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDataDeletionRequest}
                  disabled={!canRequestDeletion}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consent Management */}
        <TabsContent value="consent">
          <ConsentManager />
        </TabsContent>

        {/* Data & Export */}
        <TabsContent value="data">
          <DataExport />
        </TabsContent>

        {/* Security & Encryption */}
        <TabsContent value="encryption" className="space-y-6">
          {/* Encryption Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Client-Side Encryption</h4>
                  <p className="text-sm text-gray-600">
                    Encrypt sensitive health data before transmission
                  </p>
                  {encryptionSettings && (
                    <div className="text-xs text-gray-500">
                      Algorithm: {encryptionSettings.algorithm} • Version: {encryptionSettings.keyVersion}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEncryptionEnabled ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                  <Switch
                    checked={isEncryptionEnabled}
                    onCheckedChange={toggleEncryption}
                  />
                </div>
              </div>

              {/* Key Rotation */}
              {encryptionSettings && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Encryption Key Rotation</h4>
                        <p className="text-sm text-gray-600">
                          {keyRotationNeeded 
                            ? 'Your encryption key needs to be rotated for security'
                            : `Next rotation in ${daysUntilKeyRotation} days`}
                        </p>
                      </div>
                      <Button
                        variant={keyRotationNeeded ? 'destructive' : 'outline'}
                        onClick={rotateEncryptionKey}
                        disabled={keyRotating}
                      >
                        <RotateCcw className={`h-4 w-4 mr-2 ${keyRotating ? 'animate-spin' : ''}`} />
                        {keyRotating ? 'Rotating...' : 'Rotate Key'}
                      </Button>
                    </div>
                    
                    {keyRotationNeeded && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-red-800 font-medium">Key Rotation Required</p>
                            <p className="text-red-700">
                              Your encryption key is overdue for rotation. Please rotate it now to maintain security.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Security Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>All data transmitted using TLS 1.3 encryption</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Health data encrypted with AES-256-GCM</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Regular security audits and penetration testing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>HIPAA and SOC 2 Type II compliant infrastructure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Zero-knowledge architecture for sensitive data</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anonymous Mode */}
        <TabsContent value="anonymous">
          <AnonymousMode />
        </TabsContent>
      </Tabs>
    </div>
  );
};