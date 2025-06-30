import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePrivacy } from '@/context/PrivacyContext';
import { auditService } from '@/services/auditService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Download, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  Lock,
  Globe,
  User,
  Database,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { AuditLog, ComplianceReport } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const ComplianceAudit: React.FC = () => {
  const { user } = useAuth();
  const { generateComplianceReport } = usePrivacy();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [activeTab, setActiveTab] = useState('logs');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState<Array<{
    type: string;
    description: string;
    severity: string;
  }>>([]);

  useEffect(() => {
    if (user) {
      loadAuditData();
    }
  }, [user]);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, selectedRiskLevel, selectedAction, dateRange]);

  const loadAuditData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [logs, alerts] = await Promise.all([
        auditService.getUserAuditLogs(user.id, dateRange.start, dateRange.end, 1000),
        auditService.detectSuspiciousActivity(user.id)
      ]);

      setAuditLogs(logs);
      setSuspiciousActivity(alerts);
    } catch (error) {
      console.error('Failed to load audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (selectedRiskLevel !== 'all') {
      filtered = filtered.filter(log => log.riskLevel === selectedRiskLevel);
    }

    // Action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action.includes(selectedAction));
    }

    // Date range filter
    filtered = filtered.filter(log =>
      log.timestamp >= dateRange.start && log.timestamp <= dateRange.end
    );

    setFilteredLogs(filtered);
  };

  const handleGenerateReport = async (reportType: ComplianceReport['reportType']) => {
    if (!user) return;

    setGeneratingReport(true);
    try {
      const report = await generateComplianceReport(reportType, dateRange.start, dateRange.end);
      if (report) {
        toast.success('Compliance report generated successfully');
        // In a real app, this would trigger a download or show the report
        console.log('Generated report:', report);
      }
    } finally {
      setGeneratingReport(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <User className="h-4 w-4" />;
    if (action.includes('data')) return <Database className="h-4 w-4" />;
    if (action.includes('privacy')) return <Shield className="h-4 w-4" />;
    if (action.includes('export')) return <Download className="h-4 w-4" />;
    if (action.includes('access')) return <Eye className="h-4 w-4" />;
    if (action.includes('encrypt')) return <Lock className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getComplianceMetrics = () => {
    const total = filteredLogs.length;
    const highRisk = filteredLogs.filter(log => log.riskLevel === 'high' || log.riskLevel === 'critical').length;
    const dataAccess = filteredLogs.filter(log => log.action.includes('access')).length;
    const privacyEvents = filteredLogs.filter(log => log.complianceFlags.includes('gdpr_relevant')).length;
    const hipaaEvents = filteredLogs.filter(log => log.complianceFlags.includes('hipaa_relevant')).length;

    return { total, highRisk, dataAccess, privacyEvents, hipaaEvents };
  };

  const metrics = getComplianceMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance & Audit</h2>
          <p className="text-gray-600">HIPAA audit logging and compliance monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            HIPAA Compliant
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            SOC 2 Type II
          </Badge>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{metrics.highRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Access</p>
                <p className="text-2xl font-bold">{metrics.dataAccess}</p>
              </div>
              <Eye className="h-8 w-8 text-hc-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GDPR Events</p>
                <p className="text-2xl font-bold">{metrics.privacyEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">HIPAA Events</p>
                <p className="text-2xl font-bold">{metrics.hipaaEvents}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activity Alerts */}
      {suspiciousActivity.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suspiciousActivity.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-red-800">{alert.type}</span>
                      <Badge variant="destructive" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="critical">Critical Risk</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login Events</SelectItem>
                    <SelectItem value="data">Data Events</SelectItem>
                    <SelectItem value="privacy">Privacy Events</SelectItem>
                    <SelectItem value="access">Access Events</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={loadAuditData}>
                  <Filter className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Audit Events ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLogs.length > 0 ? (
                <div className="space-y-2">
                  {filteredLogs.slice(0, 50).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getActionIcon(log.action)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.action}</span>
                            <Badge variant={getRiskBadgeColor(log.riskLevel) as any}>
                              {log.riskLevel}
                            </Badge>
                            {log.complianceFlags.map((flag) => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            Resource: {log.resource}
                            {log.resourceId && ` (${log.resourceId})`}
                          </div>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(log.details).slice(0, 2).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {String(value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{log.timestamp.toLocaleDateString()}</div>
                        <div>{log.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredLogs.length > 50 && (
                    <div className="text-center py-4 text-gray-500">
                      Showing first 50 of {filteredLogs.length} events
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No audit events match your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'hipaa', title: 'HIPAA Compliance', description: 'Health data access and security audit' },
              { type: 'gdpr', title: 'GDPR Compliance', description: 'Privacy and data protection compliance' },
              { type: 'ccpa', title: 'CCPA Compliance', description: 'California privacy rights compliance' },
              { type: 'full', title: 'Full Audit Report', description: 'Comprehensive compliance overview' }
            ].map((report) => (
              <Card key={report.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleGenerateReport(report.type as any)}
                    disabled={generatingReport}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {generatingReport ? 'Generating...' : 'Generate Report'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Real-time Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Activity Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Real-time monitoring dashboard</p>
                <p className="text-sm text-gray-500">Live audit events and security alerts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};