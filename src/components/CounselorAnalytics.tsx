import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  UserCheck, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Users,
  Calendar,
  Award,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Heart,
  Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function CounselorAnalytics() {
  const [timeFilter, setTimeFilter] = useState('month');

  // Mock counselor analytics data
  const counselorMetrics = {
    totalCounselors: 23,
    totalSessions: 892,
    averageRating: 4.8,
    responseTime: '2.3 hours',
    utilizationRate: 78,
    studentSatisfaction: 94,
    monthlyGrowth: 8
  };

  const sessionData = [
    { month: 'Jan', sessions: 156, counselors: 18, satisfaction: 4.6 },
    { month: 'Feb', sessions: 189, counselors: 19, satisfaction: 4.7 },
    { month: 'Mar', sessions: 223, counselors: 21, satisfaction: 4.8 },
    { month: 'Apr', sessions: 267, counselors: 22, satisfaction: 4.8 },
    { month: 'May', sessions: 298, counselors: 23, satisfaction: 4.9 },
    { month: 'Jun', sessions: 334, counselors: 23, satisfaction: 4.8 }
  ];

  const specializationData = [
    { specialization: 'Anxiety & Depression', sessions: 234, counselors: 8, avgRating: 4.9 },
    { specialization: 'Crisis Intervention', sessions: 189, counselors: 5, avgRating: 4.8 },
    { specialization: 'Family Therapy', sessions: 156, counselors: 4, avgRating: 4.7 },
    { specialization: 'Academic Stress', sessions: 134, counselors: 3, avgRating: 4.6 },
    { specialization: 'Substance Abuse', sessions: 98, counselors: 2, avgRating: 4.8 },
    { specialization: 'LGBTQ+ Support', sessions: 81, counselors: 1, avgRating: 5.0 }
  ];

  const performanceDistribution = [
    { range: 'Excellent (4.5-5.0)', count: 15, percentage: 65 },
    { range: 'Good (4.0-4.4)', count: 6, percentage: 26 },
    { range: 'Satisfactory (3.5-3.9)', count: 2, percentage: 9 },
    { range: 'Needs Improvement (<3.5)', count: 0, percentage: 0 }
  ];

  const workloadDistribution = [
    { range: '0-20 sessions', counselors: 3, color: '#d0d0d0' },
    { range: '21-40 sessions', counselors: 8, color: '#a0a0a0' },
    { range: '41-60 sessions', counselors: 7, color: '#707070' },
    { range: '61+ sessions', counselors: 5, color: '#404040' }
  ];

  const topPerformers = [
    { name: 'Dr. Sarah Johnson', sessions: 78, rating: 4.9, specialization: 'Anxiety & Depression' },
    { name: 'Dr. Michael Chen', sessions: 67, rating: 4.8, specialization: 'Crisis Intervention' },
    { name: 'Dr. Lisa Rodriguez', sessions: 56, rating: 4.7, specialization: 'Family Therapy' }
  ];

  const COLORS = ['#000000', '#404040', '#707070', '#a0a0a0', '#d0d0d0'];

  return (
    <AdminLayout 
      title="Counselor Analytics" 
      subtitle="Professional performance metrics and service effectiveness insights"
    >
      <div className="space-y-8">
        {/* Privacy Notice */}
        <Card className="admin-card border-l-4 border-l-gray-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">Professional Performance Analytics</p>
                <p className="text-gray-700">
                  All data is aggregated and anonymized for institutional analysis. Individual counselor 
                  metrics are used solely for professional development and service improvement purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Active Counselors</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counselorMetrics.totalCounselors}</p>
              <p className="text-sm text-gray-500">+{counselorMetrics.monthlyGrowth}% growth</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Sessions Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counselorMetrics.totalSessions}</p>
              <p className="text-sm text-gray-500">This semester</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Average Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counselorMetrics.averageRating}/5.0</p>
              <p className="text-sm text-gray-500">{counselorMetrics.studentSatisfaction}% satisfaction</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Response Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counselorMetrics.responseTime}</p>
              <p className="text-sm text-gray-500">{counselorMetrics.utilizationRate}% utilization</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Session Trends</CardTitle>
                  <CardDescription>Monthly counseling session volume and staff growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sessions" fill="#000000" name="Sessions" />
                      <Bar dataKey="counselors" fill="#707070" name="Active Counselors" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Satisfaction Trends</CardTitle>
                  <CardDescription>Student satisfaction ratings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[4.0, 5.0]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="satisfaction" stroke="#000000" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Top Performing Counselors</CardTitle>
                <CardDescription>Based on session volume and student feedback ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((counselor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 admin-pale-gray-bg rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'warning-amber-bg text-white' :
                          index === 1 ? 'admin-medium-gray-bg text-white' :
                          'admin-light-gray-bg text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{counselor.name}</p>
                          <p className="text-sm text-gray-600">{counselor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{counselor.sessions}</p>
                          <p className="text-xs text-gray-600">Sessions</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">⭐ {counselor.rating}</p>
                          <p className="text-xs text-gray-600">Rating</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Counselor rating distribution across the team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceDistribution.map((range, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{range.range}</span>
                          <span className="text-sm text-gray-600">{range.count} counselors ({range.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="admin-dark-gray-bg h-2 rounded-full transition-all duration-300"
                            style={{ width: `${range.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Key Performance Insights</CardTitle>
                  <CardDescription>Analysis and recommendations for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Excellent Team Performance</p>
                      <p className="text-sm text-gray-600">
                        91% of counselors maintain ratings above 4.0, indicating high service quality
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Satisfaction Growth</p>
                      <p className="text-sm text-gray-600">
                        Average ratings increased by 0.3 points over the past semester
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Response Time</p>
                      <p className="text-sm text-gray-600">
                        Focus area: Average 2.3 hour response time could be improved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Specializations Tab */}
          <TabsContent value="specializations" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Specialization Performance</CardTitle>
                <CardDescription>Session volume and ratings by counseling specialization area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specializationData.map((spec, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{spec.specialization}</h4>
                          <p className="text-sm text-gray-600">{spec.counselors} counselors specializing</p>
                        </div>
                        <Badge className="admin-dark-gray-bg text-white">
                          ⭐ {spec.avgRating}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Sessions</p>
                          <p className="font-semibold text-gray-900">{spec.sessions}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg per Counselor</p>
                          <p className="font-semibold text-gray-900">{Math.round(spec.sessions / spec.counselors)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workload Analysis Tab */}
          <TabsContent value="workload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Workload Distribution</CardTitle>
                  <CardDescription>Number of counselors by session volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={workloadDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="counselors"
                        label={({ range, counselors }) => `${range}: ${counselors}`}
                      >
                        {workloadDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Workload Balance Insights</CardTitle>
                  <CardDescription>Analysis of counselor capacity and distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 admin-pale-gray-bg rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{counselorMetrics.utilizationRate}%</p>
                      <p className="text-sm text-gray-600">Average Utilization</p>
                    </div>
                    <div className="text-center p-3 admin-pale-gray-bg rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{Math.round(counselorMetrics.totalSessions / counselorMetrics.totalCounselors)}</p>
                      <p className="text-sm text-gray-600">Sessions per Counselor</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Balanced Distribution</p>
                        <p className="text-sm text-gray-600">
                          Most counselors (35%) handle 21-40 sessions, indicating good balance
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">High Volume Counselors</p>
                        <p className="text-sm text-gray-600">
                          5 counselors handle 61+ sessions - monitor for burnout risk
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}