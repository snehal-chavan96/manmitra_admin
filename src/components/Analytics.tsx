import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Brain,
  Heart,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Eye,
  Shield,
  Activity,
  BookOpen,
  MessageSquare,
  ChevronRight,
  UserCheck,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock analytics data
  const overviewMetrics = {
    totalStudentsScreened: 1247,
    totalScreenings: 2156,
    riskDistribution: {
      low: 58,
      moderate: 32,
      high: 10
    },
    weeklyTrends: {
      screenings: [
        { week: 'Week 1', screenings: 145, newCases: 23 },
        { week: 'Week 2', screenings: 167, newCases: 31 },
        { week: 'Week 3', screenings: 189, newCases: 28 },
        { week: 'Week 4', screenings: 198, newCases: 35 }
      ],
      riskTrends: [
        { month: 'Jun', low: 65, moderate: 28, high: 7 },
        { month: 'Jul', low: 62, moderate: 30, high: 8 },
        { month: 'Aug', low: 60, moderate: 31, high: 9 },
        { month: 'Sep', low: 58, moderate: 32, high: 10 }
      ]
    },
    stressCategories: [
      { category: 'Academic Pressure', percentage: 45, count: 562 },
      { category: 'Family Issues', percentage: 23, count: 287 },
      { category: 'Relationships', percentage: 18, count: 224 },
      { category: 'Financial Problems', percentage: 14, count: 175 }
    ],
    academicBreakdown: [
      { year: 'Freshman', stress: 42, totalStudents: 312 },
      { year: 'Sophomore', stress: 38, totalStudents: 298 },
      { year: 'Junior', stress: 35, totalStudents: 334 },
      { year: 'Senior', stress: 29, totalStudents: 303 }
    ],
    departmentStress: [
      { department: 'Engineering', highStress: 18, totalStudents: 245 },
      { department: 'Business', highStress: 15, totalStudents: 198 },
      { department: 'Medicine', highStress: 22, totalStudents: 156 },
      { department: 'Arts', highStress: 8, totalStudents: 134 },
      { department: 'Sciences', highStress: 12, totalStudents: 167 }
    ]
  };

  const appointmentAnalytics = {
    totalAppointments: 892,
    statusDistribution: {
      pending: 45,
      confirmed: 156,
      completed: 678,
      cancelled: 13
    },
    categoryMapping: [
      { category: 'Academic Stress', appointments: 267, percentage: 30 },
      { category: 'Anxiety/Depression', appointments: 223, percentage: 25 },
      { category: 'Relationship Issues', appointments: 134, percentage: 15 },
      { category: 'Family Problems', appointments: 89, percentage: 10 },
      { category: 'Other', appointments: 179, percentage: 20 }
    ]
  };

  const resourceUsage = {
    totalAccess: 3456,
    videoViews: 1234,
    guideDownloads: 987,
    workshopAttendance: 456,
    topResources: [
      { title: 'Anxiety Management Techniques', views: 234, type: 'Video' },
      { title: 'Academic Stress Guide', downloads: 187, type: 'Guide' },
      { title: 'Mindfulness Workshop', attendance: 89, type: 'Workshop' },
      { title: 'Sleep Hygiene Tips', views: 156, type: 'Video' },
      { title: 'Crisis Support Resources', downloads: 145, type: 'Guide' }
    ]
  };

  const peerSupportMetrics = {
    totalPosts: 1456,
    totalReplies: 2987,
    activeVolunteers: 45,
    escalationCases: 23,
    communityActivity: [
      { day: 'Mon', posts: 45, replies: 89 },
      { day: 'Tue', posts: 52, replies: 103 },
      { day: 'Wed', posts: 67, replies: 134 },
      { day: 'Thu', posts: 43, replies: 87 },
      { day: 'Fri', posts: 38, replies: 76 },
      { day: 'Sat', posts: 29, replies: 58 },
      { day: 'Sun', posts: 31, replies: 62 }
    ]
  };

  const COLORS = ['#000000', '#404040', '#707070', '#a0a0a0', '#d0d0d0'];

  return (
    <AdminLayout 
      title="Anonymous Data Analytics" 
      subtitle="Privacy-protected insights for trend recognition and intervention planning"
    >
      <div className="space-y-8">
        {/* Privacy Protection Notice */}
        <Card className="admin-card border-l-4 border-l-gray-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">Anonymous Data Analytics</p>
                <p className="text-gray-700">
                  This dashboard displays completely anonymized and aggregated mental health data. All personal identifiers 
                  are removed, ensuring full FERPA compliance while providing institutional insights for trend recognition and 
                  intervention planning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="admin-card cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Anonymous Assessments</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.totalScreenings.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{overviewMetrics.totalStudentsScreened.toLocaleString()} data points collected</p>
            </CardContent>
          </Card>

          <Card className="admin-card cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate('/admins/analytics/counselors')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Support Connections</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.totalAppointments}</p>
                  <p className="text-sm text-gray-500">{appointmentAnalytics.statusDistribution.completed} successful matches</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Wellness Resources</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{resourceUsage.totalAccess.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Anonymous resource usage</p>
            </CardContent>
          </Card>

          <Card className="admin-card cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Peer Interactions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{peerSupportMetrics.totalPosts.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{peerSupportMetrics.totalReplies.toLocaleString()} support responses</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="screening">Screening Data</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="text-gray-900">Anonymous Risk Assessment</CardTitle>
                  <CardDescription className="text-gray-600">Aggregated mental health indicators (fully anonymized)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Risk</span>
                      <span className="text-sm font-medium">{overviewMetrics.riskDistribution.low}%</span>
                    </div>
                    <Progress value={overviewMetrics.riskDistribution.low} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Moderate Risk</span>
                      <span className="text-sm font-medium">{overviewMetrics.riskDistribution.moderate}%</span>
                    </div>
                    <Progress value={overviewMetrics.riskDistribution.moderate} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Risk</span>
                      <span className="text-sm font-medium text-red-600">{overviewMetrics.riskDistribution.high}%</span>
                    </div>
                    <Progress value={overviewMetrics.riskDistribution.high} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="text-gray-900">Engagement Trends</CardTitle>
                  <CardDescription className="text-gray-600">Anonymous assessment activity and pattern identification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={overviewMetrics.weeklyTrends.screenings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="screenings" fill="#000000" />
                      <Bar dataKey="newCases" fill="#707070" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="text-gray-900">Anonymous Stress Patterns</CardTitle>
                <CardDescription className="text-gray-600">Aggregated data on primary contributing factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {overviewMetrics.stressCategories.map((category, index) => (
                    <div key={index} className="p-4 admin-pale-gray-bg rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                      <p className="text-2xl font-bold text-gray-900">{category.percentage}%</p>
                      <p className="text-sm text-gray-600">{category.count} data points</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screening Data Tab */}
          <TabsContent value="screening" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year Stress Levels</CardTitle>
                  <CardDescription>Stress distribution across different academic years</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={overviewMetrics.academicBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stress" fill="#F39C12" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department High-Stress Cases</CardTitle>
                  <CardDescription>High-risk mental health cases by academic department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overviewMetrics.departmentStress.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{dept.department}</span>
                          <p className="text-sm text-gray-600">{dept.totalStudents} total students</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-red-600">{dept.highStress}</span>
                          <p className="text-sm text-gray-600">high stress</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Level Trends Over Time</CardTitle>
                <CardDescription>Monthly progression of mental health risk assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={overviewMetrics.weeklyTrends.riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="low" stroke="#2ECC71" strokeWidth={2} />
                    <Line type="monotone" dataKey="moderate" stroke="#F39C12" strokeWidth={2} />
                    <Line type="monotone" dataKey="high" stroke="#E74C3C" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Status Overview</CardTitle>
                  <CardDescription>Current status distribution of counseling appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-semibold">{appointmentAnalytics.statusDistribution.completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Confirmed</span>
                      </div>
                      <span className="font-semibold">{appointmentAnalytics.statusDistribution.confirmed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-semibold">{appointmentAnalytics.statusDistribution.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Cancelled</span>
                      </div>
                      <span className="font-semibold">{appointmentAnalytics.statusDistribution.cancelled}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Categories</CardTitle>
                  <CardDescription>Anonymous breakdown of appointment reasons</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={appointmentAnalytics.categoryMapping}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="appointments"
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                      >
                        {appointmentAnalytics.categoryMapping.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Privacy Protection Notice</h3>
                  <p className="text-blue-800 text-sm">
                    All appointment data is anonymized and aggregated. No individual student identifiers 
                    are stored in the analytics layer. This ensures full compliance with FERPA and institutional 
                    privacy policies while providing valuable insights for program improvement.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Video Views</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{resourceUsage.videoViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Educational content</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Guide Downloads</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{resourceUsage.guideDownloads.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Self-help resources</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Workshop Attendance</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{resourceUsage.workshopAttendance}</p>
                  <p className="text-sm text-gray-500">Live sessions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Most Accessed Resources</CardTitle>
                <CardDescription>Popular mental health resources and educational content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resourceUsage.topResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{resource.title}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{resource.type}</Badge>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {resource.views || resource.downloads || resource.attendance}
                        </span>
                        <p className="text-sm text-gray-600">
                          {resource.views ? 'views' : resource.downloads ? 'downloads' : 'attendees'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Total Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{peerSupportMetrics.totalPosts.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Total Replies</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{peerSupportMetrics.totalReplies.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Active Volunteers</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{peerSupportMetrics.activeVolunteers}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Escalations</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{peerSupportMetrics.escalationCases}</p>
                  <p className="text-sm text-gray-500">To counselors</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Community Activity</CardTitle>
                <CardDescription>Daily breakdown of peer support forum engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={peerSupportMetrics.communityActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#3A86FB" />
                    <Bar dataKey="replies" fill="#2ECC71" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to detailed analytics and specialized reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-between h-16"
                onClick={() => navigate('/admins/analytics/students')}
              >
                <div className="text-left">
                  <p className="font-medium">Student Analytics</p>
                  <p className="text-sm text-gray-600">Detailed student metrics</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button 
                variant="outline" 
                className="justify-between h-16"
                onClick={() => navigate('/admins/analytics/counselors')}
              >
                <div className="text-left">
                  <p className="font-medium">Counselor Analytics</p>
                  <p className="text-sm text-gray-600">Professional performance</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button 
                variant="outline" 
                className="justify-between h-16"
                onClick={() => navigate('/admins/reports')}
              >
                <div className="text-left">
                  <p className="font-medium">Generate Reports</p>
                  <p className="text-sm text-gray-600">Institutional reporting</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}