import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  Users, 
  UserCheck, 
  Heart, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Shield
} from 'lucide-react';
import { LoadingCard } from './LoadingSpinner';
import DemoNotification from './DemoNotification';
import { getDashboardSummary } from '../api/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summary = await getDashboardSummary();
        // Expect shape { activeUsers, ongoingSessions, communityActivity, weeklyTrends }
        setDashboardData({
          crises: [],
          analytics: summary,
        });
        setError('');
      } catch (error: any) {
        console.error('Error loading dashboard:', error);
        // Fallback demo data if API fails
        setDashboardData({
          crises: [],
          analytics: {
            activeUsers: 1247,
            ongoingSessions: 23,
            communityActivity: 156,
            weeklyTrends: {
              newRegistrations: 89,
              sessionsCompleted: 234,
              crisisInterventions: 12,
              volunteerActions: 445,
            },
          },
        });
        setError('Using fallback data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for dashboard (fallback)
  const crisisAlerts = dashboardData?.crises || [
    {
      id: 'C001',
      student: 'Student ID: 2024-5678',
      severity: 'High',
      trigger: 'Suicide ideation keywords detected',
      time: '12 minutes ago',
      status: 'Active Response'
    },
    {
      id: 'C002', 
      student: 'Student ID: 2024-3421',
      severity: 'Medium',
      trigger: 'Extended crisis chat session',
      time: '1 hour ago',
      status: 'Under Review'
    }
  ];

  const pendingApprovals = [
    { type: 'Counselor', name: 'Dr. Michael Chen', department: 'Psychology', submitted: '2 days ago' },
    { type: 'Volunteer', name: 'Sarah Williams', year: 'Junior', submitted: '1 day ago' },
    { type: 'Counselor', name: 'Dr. Lisa Rodriguez', department: 'Social Work', submitted: '3 hours ago' }
  ];

  const recentActivity = [
    { action: 'New user registration', details: '15 students registered today', time: '30 min ago', type: 'info' },
    { action: 'Counseling session completed', details: 'Dr. Johnson - Student consultation', time: '1 hour ago', type: 'success' },
    { action: 'Community post moderated', details: 'Volunteer Alex reviewed anxiety support thread', time: '2 hours ago', type: 'info' },
    { action: 'Crisis intervention completed', details: 'Emergency response resolved successfully', time: '4 hours ago', type: 'success' }
  ];

  const metrics = dashboardData?.analytics || {
    activeUsers: 1247,
    ongoingSessions: 23,
    communityActivity: 156,
    weeklyTrends: {
      newRegistrations: 89,
      sessionsCompleted: 234,
      crisisInterventions: 12,
      volunteerActions: 445
    }
  };

  return (
    <AdminLayout 
      title="Mental Health Analytics Dashboard" 
      subtitle="Anonymous data insights for trend recognition and intervention planning"
    >
      <div className="space-y-8">
        <DemoNotification />

        {loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LoadingCard className="h-96" />
              </div>
              <div className="space-y-4">
                <LoadingCard className="h-40" />
                <LoadingCard className="h-48" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LoadingCard className="h-80" />
              <LoadingCard className="h-80" />
            </div>
            <div className="text-center text-gray-500 text-sm">
              Loading anonymous analytics data...
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="admin-pale-gray-bg border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-800 font-medium">⚠️ {error}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {error.includes('server connection') 
                    ? 'Dashboard is running with sample data for demonstration purposes.' 
                    : 'Using fallback data to ensure dashboard functionality.'}
                </p>
                {!error.includes('server connection') && (
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-gray-800 underline mt-2 text-sm hover:text-gray-900"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Analytics Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trend Analysis */}
          <div className="lg:col-span-2">
            <Card className="admin-card admin-fade-in border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-900" />
                    <CardTitle className="text-gray-900">Mental Health Trends</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs admin-dark-gray-bg text-white">Live Data</Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Anonymous aggregated data showing institutional mental health patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Trend Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Stress Levels</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">↑ 12%</p>
                    <p className="text-xs text-gray-600">vs. last month</p>
                  </div>
                  
                  <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Help-Seeking</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">↑ 8%</p>
                    <p className="text-xs text-gray-600">seeking support</p>
                  </div>
                </div>

                {/* Risk Categories */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Risk Distribution (Anonymous)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-3/5 h-2 admin-dark-gray-bg rounded"></div>
                        </div>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Moderate Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-1/3 h-2 admin-medium-gray-bg rounded"></div>
                        </div>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded">
                          <div className="w-1/5 h-2 crisis-red-bg rounded"></div>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 admin-black-bg hover:bg-gray-800 text-white"
                  onClick={() => navigate('/admins/analytics')}
                >
                  View Detailed Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Data Insights */}
          <div className="space-y-4">
            <Card className="admin-card admin-slide-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-900">Data Collection Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Data Stream</span>
                  </div>
                  <Badge className="success-green-bg text-white">Active</Badge>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Privacy Compliance</span>
                    <span className="text-gray-900">100%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className="w-full h-2 success-green-bg rounded"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Anonymization Level</span>
                    <span className="font-medium text-gray-900">Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className="w-full h-2 admin-dark-gray-bg rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="admin-card admin-slide-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-900">Today's Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Points Collected</span>
                  <span className="font-semibold text-lg text-gray-900">{metrics.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anonymous Sessions</span>
                  <span className="font-semibold text-lg text-gray-900">{metrics.ongoingSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trend Indicators</span>
                  <span className="font-semibold text-lg text-gray-900">{metrics.communityActivity}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Intervention Opportunities & Pattern Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Intervention Opportunities */}
          <Card className="admin-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-gray-900">Intervention Opportunities</CardTitle>
                </div>
                <Badge variant="secondary" className="admin-dark-gray-bg text-white">3 Areas</Badge>
              </div>
              <CardDescription className="text-gray-600">
                Data-driven insights for targeted mental health interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Academic Stress Patterns */}
                <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm text-gray-900">Academic Stress Peak</span>
                    </div>
                    <Badge variant="outline" className="text-xs warning-amber-bg text-white">High Priority</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Engineering students showing 22% higher stress levels
                  </p>
                  <p className="text-xs text-gray-500">
                    Suggested: Targeted academic support programs
                  </p>
                </div>

                {/* Social Isolation Indicators */}
                <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm text-gray-900">Social Connection Deficit</span>
                    </div>
                    <Badge variant="outline" className="text-xs admin-medium-gray-bg text-white">Medium Priority</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    15% increase in isolation-related indicators
                  </p>
                  <p className="text-xs text-gray-500">
                    Suggested: Peer support group expansion
                  </p>
                </div>

                {/* Seasonal Pattern Alert */}
                <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm text-gray-900">Seasonal Trend Alert</span>
                    </div>
                    <Badge variant="outline" className="text-xs admin-dark-gray-bg text-white">Predictive</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Winter semester stress patterns emerging early
                  </p>
                  <p className="text-xs text-gray-500">
                    Suggested: Preemptive wellness campaigns
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-gray-300">
                Generate Intervention Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Pattern Analysis */}
          <Card className="admin-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-gray-900">Pattern Analysis</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Real-time anonymous data patterns and behavioral insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 rounded-full mt-2 success-green-bg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Stress Level Stabilization</p>
                    <p className="text-sm text-gray-600">Overall stress indicators showing 5% improvement</p>
                    <p className="text-xs text-gray-500 mt-1">30 min ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 rounded-full mt-2 warning-amber-bg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Help-Seeking Behavior Increase</p>
                    <p className="text-sm text-gray-600">Anonymous support requests up 12% this week</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 rounded-full mt-2 admin-dark-gray-bg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Demographic Pattern Shift</p>
                    <p className="text-sm text-gray-600">Freshman engagement patterns changing</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 admin-medium-gray-bg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Predictive Model Update</p>
                    <p className="text-sm text-gray-600">New risk assessment algorithms deployed</p>
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Insights */}
        <Card className="admin-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-gray-900">Strategic Planning Insights</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Anonymous data trends for institutional mental health strategy development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 admin-pale-gray-bg rounded-lg border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">{metrics.weeklyTrends.newRegistrations}</span>
                </div>
                <p className="text-sm text-gray-700">Anonymous Assessments</p>
                <p className="text-xs text-gray-600 mt-1">↑ 12% engagement</p>
              </div>

              <div className="text-center p-4 admin-pale-gray-bg rounded-lg border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">{metrics.weeklyTrends.sessionsCompleted}</span>
                </div>
                <p className="text-sm text-gray-700">Support Connections</p>
                <p className="text-xs text-gray-600 mt-1">↑ 8% completion rate</p>
              </div>

              <div className="text-center p-4 admin-pale-gray-bg rounded-lg border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">{metrics.weeklyTrends.crisisInterventions}</span>
                </div>
                <p className="text-sm text-gray-700">Risk Indicators</p>
                <p className="text-xs text-gray-600 mt-1">↓ 3% early intervention</p>
              </div>

              <div className="text-center p-4 admin-pale-gray-bg rounded-lg border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">{metrics.weeklyTrends.volunteerActions}</span>
                </div>
                <p className="text-sm text-gray-700">Wellbeing Factors</p>
                <p className="text-xs text-gray-600 mt-1">↑ 15% positive trends</p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg admin-pale-gray-bg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">Privacy Protection Active</p>
                  <p className="text-gray-700">
                    All displayed data is completely anonymized and aggregated. No individual student information 
                    is accessible through this dashboard. Data is used solely for trend analysis and institutional 
                    planning purposes in compliance with FERPA regulations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}