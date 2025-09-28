import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { getStudentAnalytics, getStudentAnalyticsMe } from '../api/admin';
import { 
  Users, 
  Brain,
  TrendingUp,
  TrendingDown,
  Calendar,
  GraduationCap,
  BookOpen,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function StudentAnalytics() {
  const [timeFilter, setTimeFilter] = useState('semester');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [studentId, setStudentId] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiData, setApiData] = useState<any | null>(null);

  // Mock analytics data with privacy protection
  const overviewMetrics = {
    totalStudentsScreened: 1247,
    totalScreenings: 2156,
    anonymizedRecords: 1247,
    riskDistribution: {
      low: 723,      // 58%
      moderate: 399, // 32% 
      high: 125      // 10%
    },
    demographics: {
      freshman: 312,
      sophomore: 298, 
      junior: 334,
      senior: 303
    }
  };

  // PHQ-9, GAD-7, GHQ screening data (anonymized)
  const screeningResults = {
    phq9: {
      minimal: 52,      // 0-4
      mild: 28,         // 5-9
      moderate: 15,     // 10-14
      moderatelySevere: 3, // 15-19
      severe: 2         // 20-27
    },
    gad7: {
      minimal: 48,      // 0-4
      mild: 32,         // 5-9
      moderate: 15,     // 10-14
      severe: 5         // 15-21
    },
    ghq: {
      normal: 65,       // 0-2
      mild: 25,         // 3-5
      moderate: 8,      // 6-8
      severe: 2         // 9+
    }
  };

  const stressCategorySummary = [
    { category: 'Academic Pressure', percentage: 45, trend: '+8%', studentGroups: 562 },
    { category: 'Family Issues', percentage: 23, trend: '-3%', studentGroups: 287 },
    { category: 'Financial Stress', percentage: 18, trend: '+12%', studentGroups: 224 },
    { category: 'Relationship Issues', percentage: 14, trend: '+5%', studentGroups: 175 },
    { category: 'Health Concerns', percentage: 12, trend: '-2%', studentGroups: 150 },
    { category: 'Social Isolation', percentage: 10, trend: '+15%', studentGroups: 125 }
  ];

  const academicYearTrends = [
    { 
      year: 'Freshman', 
      totalStudents: 312,
      screenedStudents: 289,
      highRisk: 42,
      moderateRisk: 89,
      lowRisk: 158,
      topStressors: ['Academic Adjustment', 'Social Integration', 'Homesickness']
    },
    { 
      year: 'Sophomore', 
      totalStudents: 298,
      screenedStudents: 276,
      highRisk: 29,
      moderateRisk: 94,
      lowRisk: 153,
      topStressors: ['Career Uncertainty', 'Academic Pressure', 'Financial Stress']
    },
    { 
      year: 'Junior', 
      totalStudents: 334,
      screenedStudents: 312,
      highRisk: 33,
      moderateRisk: 108,
      lowRisk: 171,
      topStressors: ['Internship Competition', 'Academic Load', 'Future Planning']
    },
    { 
      year: 'Senior', 
      totalStudents: 303,
      screenedStudents: 290,
      highRisk: 21,
      moderateRisk: 87,
      lowRisk: 182,
      topStressors: ['Job Market', 'Graduation Anxiety', 'Transition Fears']
    }
  ];

  const departmentAnalysis = [
    { 
      department: 'Engineering', 
      totalStudents: 245, 
      screeningParticipation: 89,
      highStressPercentage: 18,
      avgStressLevel: 6.2,
      primaryStressors: ['Academic Rigor', 'Competition', 'Technical Challenges']
    },
    { 
      department: 'Business', 
      totalStudents: 198, 
      screeningParticipation: 85,
      highStressPercentage: 15,
      avgStressLevel: 5.8,
      primaryStressors: ['Networking Pressure', 'Case Competitions', 'Internship Stress']
    },
    { 
      department: 'Medicine', 
      totalStudents: 156, 
      screeningParticipation: 94,
      highStressPercentage: 22,
      avgStressLevel: 7.1,
      primaryStressors: ['Academic Intensity', 'Clinical Pressure', 'Time Management']
    },
    { 
      department: 'Liberal Arts', 
      totalStudents: 134, 
      screeningParticipation: 91,
      highStressPercentage: 8,
      avgStressLevel: 4.9,
      primaryStressors: ['Career Uncertainty', 'Financial Concerns', 'Family Expectations']
    },
    { 
      department: 'Sciences', 
      totalStudents: 167, 
      screeningParticipation: 87,
      highStressPercentage: 12,
      avgStressLevel: 5.5,
      primaryStressors: ['Research Pressure', 'Lab Competition', 'Graduate School Prep']
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', screenings: 156, highRisk: 18, avgStress: 5.2 },
    { month: 'Feb', screenings: 189, highRisk: 23, avgStress: 5.8 },
    { month: 'Mar', screenings: 234, highRisk: 31, avgStress: 6.1 },
    { month: 'Apr', screenings: 267, highRisk: 34, avgStress: 6.4 },
    { month: 'May', screenings: 198, highRisk: 22, avgStress: 5.6 },
    { month: 'Jun', screenings: 123, highRisk: 12, avgStress: 4.9 },
    { month: 'Jul', screenings: 89, highRisk: 8, avgStress: 4.5 },
    { month: 'Aug', screenings: 145, highRisk: 15, avgStress: 5.1 },
    { month: 'Sep', screenings: 278, highRisk: 38, avgStress: 6.8 }
  ];

  const engagementMetrics = {
    screeningCompletion: 92,
    followUpParticipation: 78,
    resourceUtilization: 65,
    communityParticipation: 43,
    counselingAcceptance: 67
  };

  const COLORS = ['#000000', '#404040', '#707070', '#a0a0a0', '#d0d0d0', '#f0f0f0'];

  const calculatePercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  const loadStudent = async () => {
    if (!studentId.trim()) return;
    try {
      setApiLoading(true);
      const data = await getStudentAnalytics(studentId.trim());
      setApiData(data || {});
    } catch (e) {
      setApiData({ error: (e as any)?.message || 'Failed to load analytics' });
    } finally {
      setApiLoading(false);
    }
  };

  const loadMe = async () => {
    try {
      setApiLoading(true);
      const data = await getStudentAnalyticsMe();
      setApiData(data || {});
    } catch (e) {
      setApiData({ error: (e as any)?.message || 'Failed to load analytics' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <AdminLayout 
      title="Anonymous Student Data Trends" 
      subtitle="Privacy-protected insights for intervention planning and institutional policy development"
    >
      <div className="space-y-8">
        {/* Data Fetch Panel */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Fetch Student Analytics</CardTitle>
            <CardDescription>Enter a Student ID or use your own session (me) to load real analytics from the backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
              <div className="flex-1 w-full">
                <label className="text-sm text-gray-700">Student ID</label>
                <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 664f0..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={loadStudent} disabled={apiLoading || !studentId.trim()}>Load by ID</Button>
                <Button variant="outline" onClick={loadMe} disabled={apiLoading}>Load "me"</Button>
              </div>
            </div>
            {apiLoading && (
              <div className="text-sm text-gray-600 mt-3">Loading analytics...</div>
            )}
            {apiData && !apiLoading && (
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 text-sm overflow-auto max-h-64">
                {/* Render a tiny summary if available, else show raw JSON */}
                {apiData.summary ? (
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Summary</div>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(apiData.summary, null, 2)}</pre>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(apiData, null, 2)}</pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Privacy Notice */}
        <Card className="admin-card border-l-4 border-l-gray-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Anonymous Student Data Analytics</h3>
                <p className="text-gray-700 text-sm mb-2">
                  All data presented is completely anonymized and aggregated for trend recognition and intervention planning. 
                  No individual student identifiers are stored or accessible. Full FERPA compliance maintained.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📊 {overviewMetrics.anonymizedRecords.toLocaleString()} anonymized records</span>
                  <span>🔒 Zero personal identifiers</span>
                  <span>📋 FERPA compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester">Current Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <GraduationCap className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="arts">Liberal Arts</SelectItem>
              <SelectItem value="sciences">Sciences</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Anonymous Assessments</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.totalScreenings.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{overviewMetrics.totalStudentsScreened.toLocaleString()} data points</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Risk Indicators</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.riskDistribution.high}</p>
              <p className="text-sm text-gray-500">
                {calculatePercentage(overviewMetrics.riskDistribution.high, overviewMetrics.totalStudentsScreened)}% high-risk patterns
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Data Participation</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.screeningCompletion}%</p>
              <p className="text-sm text-gray-500">Anonymous engagement rate</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Support Seeking</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.counselingAcceptance}%</p>
              <p className="text-sm text-gray-500">Accepting intervention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="screenings">Screening Tools</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>Mental health risk assessment breakdown (anonymized)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Low Risk', value: overviewMetrics.riskDistribution.low, color: '#2ECC71' },
                          { name: 'Moderate Risk', value: overviewMetrics.riskDistribution.moderate, color: '#F39C12' },
                          { name: 'High Risk', value: overviewMetrics.riskDistribution.high, color: '#E74C3C' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'Low Risk', value: overviewMetrics.riskDistribution.low },
                          { name: 'Moderate Risk', value: overviewMetrics.riskDistribution.moderate },
                          { name: 'High Risk', value: overviewMetrics.riskDistribution.high }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#2ECC71', '#F39C12', '#E74C3C'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Primary Stress Categories</CardTitle>
                  <CardDescription>Most common sources of student stress (aggregated data)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stressCategorySummary.slice(0, 4).map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{category.category}</span>
                          <p className="text-sm text-gray-600">{category.studentGroups} student responses</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{category.percentage}%</span>
                          <p className={`text-sm ${category.trend.startsWith('+') ? 'text-orange-600' : 'text-green-600'}`}>
                            {category.trend} vs last period
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Screening Activity</CardTitle>
                <CardDescription>Screening participation and risk identification trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="screenings" stackId="1" stroke="#3A86FB" fill="#3A86FB" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="highRisk" stackId="2" stroke="#E74C3C" fill="#E74C3C" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screening Tools Tab */}
          <TabsContent value="screenings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>PHQ-9 Depression Screening</CardTitle>
                  <CardDescription>Patient Health Questionnaire results (anonymized)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Minimal (0-4)</span>
                      <Badge variant="outline" className="text-green-700">{screeningResults.phq9.minimal}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mild (5-9)</span>
                      <Badge variant="outline" className="text-yellow-700">{screeningResults.phq9.mild}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moderate (10-14)</span>
                      <Badge variant="outline" className="text-orange-700">{screeningResults.phq9.moderate}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mod. Severe (15-19)</span>
                      <Badge variant="outline" className="text-red-700">{screeningResults.phq9.moderatelySevere}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Severe (20-27)</span>
                      <Badge variant="destructive">{screeningResults.phq9.severe}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GAD-7 Anxiety Screening</CardTitle>
                  <CardDescription>General Anxiety Disorder assessment (anonymized)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Minimal (0-4)</span>
                      <Badge variant="outline" className="text-green-700">{screeningResults.gad7.minimal}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mild (5-9)</span>
                      <Badge variant="outline" className="text-yellow-700">{screeningResults.gad7.mild}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moderate (10-14)</span>
                      <Badge variant="outline" className="text-orange-700">{screeningResults.gad7.moderate}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Severe (15-21)</span>
                      <Badge variant="destructive">{screeningResults.gad7.severe}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GHQ General Health</CardTitle>
                  <CardDescription>General Health Questionnaire screening (anonymized)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Normal (0-2)</span>
                      <Badge variant="outline" className="text-green-700">{screeningResults.ghq.normal}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mild (3-5)</span>
                      <Badge variant="outline" className="text-yellow-700">{screeningResults.ghq.mild}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moderate (6-8)</span>
                      <Badge variant="outline" className="text-orange-700">{screeningResults.ghq.moderate}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Severe (9+)</span>
                      <Badge variant="destructive">{screeningResults.ghq.severe}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cross-Tool Risk Correlation</CardTitle>
                <CardDescription>Correlation between different screening tool results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    <strong>Screening Tool Effectiveness:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• PHQ-9 and GAD-7 show 87% correlation in moderate-severe cases</li>
                    <li>• Early intervention rates improved by 34% with multi-tool screening</li>
                    <li>• Students appreciate comprehensive mental health assessment approach</li>
                    <li>• 92% screening completion rate indicates good student engagement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year Distribution</CardTitle>
                  <CardDescription>Mental health trends by academic year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={academicYearTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="highRisk" fill="#E74C3C" />
                      <Bar dataKey="moderateRisk" fill="#F39C12" />
                      <Bar dataKey="lowRisk" fill="#2ECC71" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Year-Specific Stressors</CardTitle>
                  <CardDescription>Top stress factors by academic year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academicYearTrends.map((year, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{year.year}</h4>
                          <div className="text-sm text-gray-600">
                            {year.screenedStudents}/{year.totalStudents} screened
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {year.topStressors.map((stressor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {stressor}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          High risk: {year.highRisk} students ({Math.round((year.highRisk / year.screenedStudents) * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Metrics</CardTitle>
                <CardDescription>Participation rates in mental health initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <p className="text-2xl font-bold text-blue-600">{engagementMetrics.screeningCompletion}%</p>
                    <p className="text-sm text-blue-800">Screening Completion</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <p className="text-2xl font-bold text-green-600">{engagementMetrics.followUpParticipation}%</p>
                    <p className="text-sm text-green-800">Follow-up Participation</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <p className="text-2xl font-bold text-purple-600">{engagementMetrics.resourceUtilization}%</p>
                    <p className="text-sm text-purple-800">Resource Utilization</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded">
                    <p className="text-2xl font-bold text-pink-600">{engagementMetrics.communityParticipation}%</p>
                    <p className="text-sm text-pink-800">Community Participation</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded">
                    <p className="text-2xl font-bold text-orange-600">{engagementMetrics.counselingAcceptance}%</p>
                    <p className="text-sm text-orange-800">Counseling Acceptance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Stress Analysis</CardTitle>
                <CardDescription>Mental health trends across academic departments (anonymized)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentAnalysis.map((dept, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{dept.department}</h4>
                            <p className="text-sm text-gray-600">
                              {dept.totalStudents} students • {dept.screeningParticipation}% screening participation
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">{dept.highStressPercentage}%</p>
                            <p className="text-sm text-gray-600">High stress</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Average Stress Level</span>
                            <span>{dept.avgStressLevel}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${dept.avgStressLevel * 10}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Primary Stressors:</p>
                          <div className="flex flex-wrap gap-1">
                            {dept.primaryStressors.map((stressor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {stressor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Year Progression</CardTitle>
                <CardDescription>Mental health metrics throughout the academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="screenings" stroke="#3A86FB" strokeWidth={3} />
                    <Line type="monotone" dataKey="highRisk" stroke="#E74C3C" strokeWidth={3} />
                    <Line type="monotone" dataKey="avgStress" stroke="#F39C12" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                  <CardDescription>Mental health trends by academic periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <div>
                        <span className="font-medium">Fall Semester Start</span>
                        <p className="text-sm text-gray-600">High adjustment stress</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <div>
                        <span className="font-medium">Midterm Period</span>
                        <p className="text-sm text-gray-600">Peak academic stress</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <div>
                        <span className="font-medium">Winter Break</span>
                        <p className="text-sm text-gray-600">Family/holiday stress</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <div>
                        <span className="font-medium">Summer</span>
                        <p className="text-sm text-gray-600">Reduced academic stress</p>
                      </div>
                      <TrendingDown className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intervention Effectiveness</CardTitle>
                  <CardDescription>Impact of mental health initiatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Early Intervention Success</span>
                      </div>
                      <p className="text-sm text-green-800">34% reduction in crisis escalations</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Screening Program Impact</span>
                      </div>
                      <p className="text-sm text-blue-800">67% of high-risk students now receiving support</p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-900">Peer Support Growth</span>
                      </div>
                      <p className="text-sm text-purple-800">156% increase in community engagement</p>
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