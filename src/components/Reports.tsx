import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from '../utils/toast';
import { downloadStudentAnalyticsPdf, downloadStudentChatPdf } from '../api/admin';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Shield,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  Filter,
  Search,
  Mail,
  Share2,
  Copy,
  X
} from 'lucide-react';

export default function Reports() {
  const [reportType, setReportType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [downloading, setDownloading] = useState(false);

  // Mock reports data
  const reportCategories = [
    {
      category: 'Institutional Compliance',
      description: 'Reports required for regulatory compliance and institutional oversight',
      reports: [
        {
          id: 'COMP-001',
          title: 'Annual Mental Health Services Report',
          description: 'Comprehensive overview of mental health services provided to students',
          lastGenerated: '2024-09-15T10:30:00Z',
          frequency: 'Annual',
          status: 'Ready',
          format: ['PDF', 'Excel'],
          confidentiality: 'Administrative Only',
          dataPoints: ['Service Utilization', 'Outcomes', 'Demographics', 'Resource Allocation']
        },
        {
          id: 'COMP-002',
          title: 'Crisis Response Summary',
          description: 'Quarterly summary of crisis interventions and emergency responses',
          lastGenerated: '2024-09-01T14:15:00Z',
          frequency: 'Quarterly',
          status: 'Generating',
          format: ['PDF'],
          confidentiality: 'Senior Administration',
          dataPoints: ['Crisis Volume', 'Response Times', 'Outcomes', 'Prevention Metrics']
        },
        {
          id: 'COMP-003',
          title: 'FERPA Compliance Audit',
          description: 'Privacy protection audit for mental health data handling',
          lastGenerated: '2024-08-20T09:00:00Z',
          frequency: 'Bi-Annual',
          status: 'Ready',
          format: ['PDF', 'Word'],
          confidentiality: 'Legal & Compliance',
          dataPoints: ['Data Access Logs', 'Privacy Controls', 'Staff Training', 'Incident Reports']
        }
      ]
    },
    {
      category: 'Operational Analytics',
      description: 'Performance metrics and operational insights for program improvement',
      reports: [
        {
          id: 'OPS-001',
          title: 'Counselor Performance Dashboard',
          description: 'Monthly performance metrics for licensed counseling staff',
          lastGenerated: '2024-09-20T16:45:00Z',
          frequency: 'Monthly',
          status: 'Ready',
          format: ['PDF', 'Excel', 'Dashboard'],
          confidentiality: 'HR & Clinical Directors',
          dataPoints: ['Session Volume', 'Satisfaction Ratings', 'Utilization', 'Professional Development']
        },
        {
          id: 'OPS-002',
          title: 'Student Engagement Analysis',
          description: 'Analysis of student participation in mental health services',
          lastGenerated: '2024-09-18T11:20:00Z',
          frequency: 'Weekly',
          status: 'Ready',
          format: ['PDF', 'Excel'],
          confidentiality: 'Anonymized - Administrative Access',
          dataPoints: ['Participation Rates', 'Service Uptake', 'Demographic Trends', 'Barriers Analysis']
        },
        {
          id: 'OPS-003',
          title: 'Resource Utilization Report',
          description: 'Usage statistics for mental health resources and materials',
          lastGenerated: '2024-09-19T13:30:00Z',
          frequency: 'Monthly',
          status: 'Ready',
          format: ['PDF', 'Excel'],
          confidentiality: 'Administrative Staff',
          dataPoints: ['Resource Access', 'Popular Content', 'Usage Patterns', 'ROI Analysis']
        }
      ]
    },
    {
      category: 'Strategic Planning',
      description: 'Data-driven insights for institutional planning and policy development',
      reports: [
        {
          id: 'STRAT-001',
          title: 'Mental Health Trends Analysis',
          description: 'Longitudinal analysis of student mental health patterns and emerging needs',
          lastGenerated: '2024-09-10T08:15:00Z',
          frequency: 'Semester',
          status: 'Ready',
          format: ['PDF', 'Presentation'],
          confidentiality: 'Senior Leadership',
          dataPoints: ['Trend Analysis', 'Predictive Modeling', 'Risk Factors', 'Intervention Opportunities']
        },
        {
          id: 'STRAT-002',
          title: 'Budget Impact Assessment',
          description: 'Financial analysis of mental health program effectiveness and ROI',
          lastGenerated: '2024-08-25T15:00:00Z',
          frequency: 'Annual',
          status: 'Ready',
          format: ['Excel', 'PDF'],
          confidentiality: 'Finance & Senior Administration',
          dataPoints: ['Cost Analysis', 'Outcome Value', 'Efficiency Metrics', 'Investment Recommendations']
        },
        {
          id: 'STRAT-003',
          title: 'Capacity Planning Report',
          description: 'Projections for future mental health service capacity needs',
          lastGenerated: '2024-09-05T12:45:00Z',
          frequency: 'Annual',
          status: 'Ready',
          format: ['PDF', 'Excel'],
          confidentiality: 'Planning Committee',
          dataPoints: ['Demand Projections', 'Staffing Needs', 'Infrastructure Requirements', 'Growth Planning']
        }
      ]
    }
  ];

  const reportQueue = [
    {
      id: 'QUEUE-001',
      title: 'Weekly Crisis Summary',
      requestedBy: 'Dr. Emily Carter, Dean of Students',
      requestedAt: '2024-09-20T14:30:00Z',
      estimatedCompletion: '2024-09-21T10:00:00Z',
      status: 'Processing',
      priority: 'High'
    },
    {
      id: 'QUEUE-002',
      title: 'Custom Volunteer Impact Report',
      requestedBy: 'Sarah Mitchell, Community Outreach',
      requestedAt: '2024-09-20T09:15:00Z',
      estimatedCompletion: '2024-09-22T16:00:00Z',
      status: 'Pending',
      priority: 'Medium'
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffDays = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'success-gradient text-white';
      case 'Generating': return 'warning-orange-bg text-white';
      case 'Processing': return 'trust-blue-bg text-white';
      case 'Pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadAnalyticsPdf = async () => {
    if (!studentId.trim()) {
      toast.error('Missing Student ID', 'Enter a studentId to download');
      return;
    }
    try {
      setDownloading(true);
      const blob = await downloadStudentAnalyticsPdf(studentId.trim());
      downloadBlob(blob, `student_${studentId.trim()}_analytics.pdf`);
      toast.success('Downloaded', 'Student analytics PDF downloaded');
    } catch (e: any) {
      toast.error('Download failed', e?.message || 'Could not download analytics PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadChatPdf = async () => {
    if (!studentId.trim()) {
      toast.error('Missing Student ID', 'Enter a studentId to download');
      return;
    }
    try {
      setDownloading(true);
      const blob = await downloadStudentChatPdf(studentId.trim());
      downloadBlob(blob, `student_${studentId.trim()}_chat.pdf`);
      toast.success('Downloaded', 'Student chat PDF downloaded');
    } catch (e: any) {
      toast.error('Download failed', e?.message || 'Could not download chat PDF');
    } finally {
      setDownloading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredReports = reportCategories.map(category => ({
    ...category,
    reports: category.reports.filter(report => 
      (reportType === 'all' || category.category.toLowerCase().includes(reportType)) &&
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.reports.length > 0);

  const handlePreview = (report: any) => {
    setSelectedReport(report);
    setPreviewModalOpen(true);
  };

  const handleDownload = async (report: any, format = 'PDF') => {
    try {
      toast.info('Generating Report', `Creating ${format} version of ${report.title}...`);
      
      // Simulate file generation
      setTimeout(() => {
        // Create mock file content
        const content = `Mock Report: ${report.title}\n\nGenerated: ${new Date().toLocaleString()}\nFormat: ${format}\nID: ${report.id}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Report Downloaded', `${report.title} has been downloaded successfully`);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download Failed', 'Please try again or contact support');
    }
  };

  const handleShare = async (report: any) => {
    try {
      const shareLink = `${window.location.origin}/reports/${report.id}?access=${Date.now()}`;
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link Copied', 'Secure sharing link copied to clipboard');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Share Failed', 'Could not generate sharing link');
    }
  };

  const handleEmailReport = (report: any) => {
    const subject = `Report: ${report.title}`;
    const body = `Dear Recipient,\n\nPlease find attached the requested report: "${report.title}"\n\nReport Details:\n- Generated: ${new Date().toLocaleString()}\n- Report ID: ${report.id}\n- Confidentiality: ${report.confidentiality}\n\nThis report contains sensitive institutional data and should be handled according to privacy policies.\n\nBest regards,\nAdministration Team`;
    
    const mailtoURL = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.open(mailtoURL, '_blank');
      toast.info('Email Client Opened', 'Draft email created for report sharing');
    } catch (error) {
      console.error('Failed to open email client:', error);
      toast.error('Email Failed', 'Please compose email manually');
    }
  };

  return (
    <AdminLayout 
      title="Institutional Reports" 
      subtitle="Comprehensive reporting for leadership and regulatory compliance"
    >
      <div className="space-y-8">
        {/* Privacy & Compliance Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Report Security & Privacy</h3>
              <p className="text-blue-800 text-sm mb-2">
                All reports are generated with appropriate privacy protections and access controls. 
                Student data is anonymized according to FERPA regulations and institutional policies.
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <span>🔒 End-to-end encryption</span>
                <span>👥 Role-based access</span>
                <span>📋 Audit trail maintained</span>
                <span>⏰ Automatic expiration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-64">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="compliance">Institutional Compliance</SelectItem>
              <SelectItem value="operational">Operational Analytics</SelectItem>
              <SelectItem value="strategic">Strategic Planning</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Backend PDF Downloads */}
          <div className="flex gap-2 items-end">
            <div>
              <label className="text-sm text-gray-700">Student ID</label>
              <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 664f0..." />
            </div>
            <Button onClick={handleDownloadAnalyticsPdf} disabled={downloading}>Download Analytics PDF</Button>
            <Button variant="outline" onClick={handleDownloadChatPdf} disabled={downloading}>Download Chat PDF</Button>
          </div>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Available Reports
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Report Queue ({reportQueue.length})
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Custom Reports
            </TabsTrigger>
          </TabsList>

          {/* Available Reports Tab */}
          <TabsContent value="available" className="space-y-6">
            {filteredReports.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {category.reports.map((report) => (
                      <Card key={report.id} className="border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {report.frequency}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-2">{report.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  Last generated: {formatTimeAgo(report.lastGenerated)}
                                </span>
                                <span>
                                  <Shield className="w-4 h-4 inline mr-1" />
                                  {report.confidentiality}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePreview(report)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                className="trust-blue-bg hover:bg-[#2570E8] text-white"
                                onClick={() => handleDownload(report)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Available Formats</h4>
                              <div className="flex gap-2">
                                {report.format.map((format, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {format}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Key Data Points</h4>
                              <div className="flex flex-wrap gap-1">
                                {report.dataPoints.slice(0, 3).map((point, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {point}
                                  </Badge>
                                ))}
                                {report.dataPoints.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{report.dataPoints.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEmailReport(report)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Email Report
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShare(report)}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share Link
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Report Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation Queue</CardTitle>
                <CardDescription>Current report generation requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {reportQueue.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports currently in queue</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportQueue.map((request) => (
                      <Card key={request.id} className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-gray-900">{request.title}</h3>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(request.priority)}`}
                                >
                                  {request.priority} Priority
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                Requested by: {request.requestedBy}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  Requested: {formatTimeAgo(request.requestedAt)}
                                </span>
                                <span>
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  ETA: {formatTimeAgo(request.estimatedCompletion)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              {request.status === 'Pending' && (
                                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>Create customized reports for specific administrative needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Quick Custom Reports</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start h-16">
                        <div className="text-left">
                          <p className="font-medium">Department Mental Health Summary</p>
                          <p className="text-sm text-gray-600">Generate report for specific academic department</p>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start h-16">
                        <div className="text-left">
                          <p className="font-medium">Date Range Crisis Analysis</p>
                          <p className="text-sm text-gray-600">Custom time period crisis intervention report</p>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start h-16">
                        <div className="text-left">
                          <p className="font-medium">Counselor Workload Analysis</p>
                          <p className="text-sm text-gray-600">Individual or comparative counselor performance</p>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start h-16">
                        <div className="text-left">
                          <p className="font-medium">Student Outcome Tracking</p>
                          <p className="text-sm text-gray-600">Treatment effectiveness and progress metrics</p>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Advanced Report Builder</h3>
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Build comprehensive custom reports with multiple data sources and visualizations
                      </p>
                      <Button className="trust-blue-bg hover:bg-[#2570E8] text-white">
                        Launch Report Builder
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Available Data Sources</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Screening Results</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Session Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Crisis Incidents</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Resource Usage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Staff Performance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Demographics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Custom Reports</CardTitle>
                <CardDescription>Previously created custom report templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Engineering Dept. Stress Analysis</h4>
                          <p className="text-sm text-gray-600">Custom report created for Engineering department stress patterns</p>
                          <p className="text-xs text-gray-500 mt-1">Last run: 5 days ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Run Report</Button>
                          <Button size="sm" variant="outline">Edit Template</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Weekly Leadership Dashboard</h4>
                          <p className="text-sm text-gray-600">Executive summary for senior leadership team</p>
                          <p className="text-xs text-gray-500 mt-1">Scheduled: Every Monday</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Run Now</Button>
                          <Button size="sm" variant="outline">Modify Schedule</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used reporting functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Export All Data</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Mail className="w-6 h-6" />
                <span>Email Summary</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule Reports</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Shield className="w-6 h-6" />
                <span>Access Audit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <span className="text-xl">Report Preview</span>
                <p className="text-sm text-gray-600 font-normal">{selectedReport?.title}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Preview of report content and data visualization
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 mt-6">
              {/* Report Info */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{selectedReport.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Last generated: {formatTimeAgo(selectedReport.lastGenerated)}
                  </p>
                </div>
              </div>

              {/* Mock Report Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    This report provides a comprehensive overview of mental health services utilization 
                    and outcomes for the reporting period. Key findings include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Total service interactions: 2,847 (↑12% from previous period)</li>
                    <li>Student satisfaction rating: 4.7/5.0 (95% confidence interval)</li>
                    <li>Crisis intervention response time: Average 2.3 hours</li>
                    <li>Counselor utilization rate: 78% (within optimal range)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Mock Data Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2,847</div>
                      <div className="text-sm text-gray-600">Total Interactions</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2.3h</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">78%</div>
                      <div className="text-sm text-gray-600">Utilization</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mock Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Mock Chart: Service Utilization Trends</p>
                      <p className="text-xs">Interactive charts would appear here in the actual report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Included Data Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedReport.dataPoints.map((point: string, index: number) => (
                      <Badge key={index} variant="outline" className="justify-start">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                        {point}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleDownload(selectedReport)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleEmailReport(selectedReport)}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleShare(selectedReport)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}