import React, { useState } from 'react';
import { usePrivacy } from '@/context/PrivacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  Database, 
  Shield, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Copy
} from 'lucide-react';
import { DataExportRequest } from '@/types';
import { toast } from 'sonner';

export const DataExport: React.FC = () => {
  const {
    dataExportRequests,
    dataDeletionRequests,
    requestDataExport,
    requestDataDeletion,
    cancelDataDeletion,
    canRequestDeletion,
    hasActiveDeletionRequest,
    loading
  } = usePrivacy();

  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [includeData, setIncludeData] = useState<DataExportRequest['includeData']>({
    profile: true,
    sessions: true,
    messages: true,
    therapistInteractions: true,
    billingHistory: false,
    auditLogs: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleDataSelection = (dataType: keyof DataExportRequest['includeData'], checked: boolean) => {
    setIncludeData(prev => ({
      ...prev,
      [dataType]: checked
    }));
  };

  const handleExportRequest = async () => {
    setIsExporting(true);
    try {
      const success = await requestDataExport(exportFormat, includeData);
      if (success) {
        toast.success('Data export request submitted successfully');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = (request: DataExportRequest) => {
    if (request.downloadUrl) {
      // In a real app, this would trigger the actual download
      toast.success('Download started');
      console.log('Downloading:', request.downloadUrl);
    }
  };

  const copyDownloadLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Download link copied to clipboard');
  };

  const getStatusIcon = (status: DataExportRequest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DataExportRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatFileSize = (sizeInMB: number = 2.5) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const dataOptions = [
    {
      key: 'profile' as const,
      label: 'Profile Information',
      description: 'Your personal details, preferences, and account settings'
    },
    {
      key: 'sessions' as const,
      label: 'Session Data',
      description: 'Therapy sessions, notes, and progress tracking'
    },
    {
      key: 'messages' as const,
      label: 'Messages & Communications',
      description: 'Chat history with therapists and support team'
    },
    {
      key: 'therapistInteractions' as const,
      label: 'Therapist Interactions',
      description: 'Consultation history and therapist feedback'
    },
    {
      key: 'billingHistory' as const,
      label: 'Billing & Payment History',
      description: 'Subscription details, invoices, and payment records'
    },
    {
      key: 'auditLogs' as const,
      label: 'Security & Audit Logs',
      description: 'Account access history and security events'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Export & Portability</h2>
          <p className="text-gray-600">Export your data and manage your digital rights</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          GDPR Article 20
        </Badge>
      </div>

      {/* Export Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Request Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Export Format</h4>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON (Machine Readable)</SelectItem>
                <SelectItem value="csv">CSV (Spreadsheet Compatible)</SelectItem>
                <SelectItem value="pdf">PDF (Human Readable Report)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {exportFormat === 'json' && 'Structured data format ideal for importing into other systems'}
              {exportFormat === 'csv' && 'Tabular format that can be opened in Excel or Google Sheets'}
              {exportFormat === 'pdf' && 'Formatted report for reading and printing'}
            </p>
          </div>

          <Separator />

          {/* Data Selection */}
          <div className="space-y-4">
            <h4 className="font-medium">Select Data to Include</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataOptions.map((option) => (
                <div key={option.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={option.key}
                    checked={includeData[option.key]}
                    onCheckedChange={(checked) => handleDataSelection(option.key, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={option.key} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Export Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Export will be processed within 72 hours and available for download for 7 days.</p>
              <p className="mt-1">Estimated size: {formatFileSize()}</p>
            </div>
            <Button
              onClick={handleExportRequest}
              disabled={isExporting || loading || Object.values(includeData).every(v => !v)}
              className="bg-hc-primary hover:bg-hc-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Requesting...' : 'Request Export'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataExportRequests.length > 0 ? (
            <div className="space-y-4">
              {dataExportRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="font-medium">
                        {request.format.toUpperCase()} Export
                      </span>
                      <Badge variant={getStatusColor(request.status) as any}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Requested: {request.requestedAt.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Progress for processing exports */}
                  {request.status === 'processing' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Processing export...</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}

                  {/* Download section for completed exports */}
                  {request.status === 'completed' && request.downloadUrl && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Export Ready for Download
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyDownloadLink(request.downloadUrl!)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(request)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      {request.expiresAt && (
                        <p className="text-xs text-green-700 mt-1">
                          Download expires: {request.expiresAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Data included summary */}
                  <div className="text-sm">
                    <span className="text-gray-600">Includes: </span>
                    <span>
                      {Object.entries(request.includeData)
                        .filter(([_, included]) => included)
                        .map(([key, _]) => dataOptions.find(opt => opt.key === key)?.label)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No data export requests yet</p>
              <p className="text-sm text-gray-500">
                Request an export above to download your data
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Account Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasActiveDeletionRequest ? (
            <div className="space-y-3">
              {dataDeletionRequests
                .filter(req => req.status === 'pending' || req.status === 'scheduled')
                .map((request) => (
                  <div key={request.id} className="border border-red-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">
                        Deletion Scheduled
                      </span>
                      <Badge variant="destructive">
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      Your account will be permanently deleted on {request.scheduledFor.toLocaleDateString()}.
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelDataDeletion(request.id)}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Cancel Deletion
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleExportRequest}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Export Data First
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800">Permanent Account Deletion</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete your account and all associated data. 
                    We recommend exporting your data first. There is a 30-day grace period 
                    during which you can cancel the deletion.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  variant="destructive"
                  onClick={() => requestDataDeletion('User initiated account deletion')}
                  disabled={!canRequestDeletion}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Request Account Deletion
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Your Data Rights</p>
              <p className="text-blue-700 mb-2">
                Under GDPR and applicable privacy laws, you have the right to:
              </p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• Access your personal data (Article 15)</li>
                <li>• Receive your data in a portable format (Article 20)</li>
                <li>• Request correction of inaccurate data (Article 16)</li>
                <li>• Request deletion of your data (Article 17)</li>
                <li>• Object to processing of your data (Article 21)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};