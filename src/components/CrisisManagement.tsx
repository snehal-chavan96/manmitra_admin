import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  User, 
  MapPin, 
  FileText,
  CheckCircle,
  Shield,
  Users,
  Calendar,
  TrendingDown,
  Activity
} from 'lucide-react';
import { getActiveCrises } from '../api/admin';

export default function CrisisManagement() {
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);
  const [activeCrises, setActiveCrises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock crisis data fallback
  const mockCrises = [
    {
      id: 'CRISIS-001',
      studentId: '2024-5678',
      severity: 'High',
      trigger: 'Suicide ideation keywords detected in chat',
      timestamp: '2024-09-20T15:30:00Z',
      duration: '12 minutes ago',
      status: 'Active Response',
      location: 'Dormitory - West Campus',
      counselorAssigned: 'Dr. Sarah Johnson',
      contactAttempts: 2,
      lastActivity: 'Student responded to outreach call',
      riskFactors: ['Previous counseling history', 'Recent academic stress', 'Social isolation indicators'],
      conversationExcerpts: [
        { time: '15:28', message: 'I don\'t see any point in continuing...' },
        { time: '15:29', message: 'Everything feels overwhelming and hopeless' }
      ]
    },
    {
      id: 'CRISIS-002',
      studentId: '2024-3421', 
      severity: 'Medium',
      trigger: 'Extended crisis chat session (>2 hours)',
      timestamp: '2024-09-20T14:15:00Z',
      duration: '1 hour 27 minutes ago',
      status: 'Under Review',
      location: 'Library - Main Campus',
      counselorAssigned: 'Dr. Michael Chen',
      contactAttempts: 1,
      lastActivity: 'Counselor session initiated',
      riskFactors: ['Anxiety patterns', 'Sleep disruption', 'Academic performance decline'],
      conversationExcerpts: [
        { time: '14:10', message: 'Having panic attacks almost daily now' },
        { time: '14:12', message: 'Can\'t focus on anything, failing multiple classes' }
      ]
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getActiveCrises();
        const items = (res?.items && Array.isArray(res.items)) ? res.items : [];
        setActiveCrises(items.length ? items : mockCrises);
      } catch (e: any) {
        setError(e?.message || 'Failed to fetch crises');
        setActiveCrises(mockCrises);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recentResolutions = [
    {
      id: 'CRISIS-098',
      studentId: '2024-2156',
      resolvedAt: '2024-09-20T10:45:00Z',
      duration: '45 minutes',
      outcome: 'Successful intervention - Student connected with counseling services',
      followUpScheduled: true
    },
    {
      id: 'CRISIS-097',
      studentId: '2024-7834',
      resolvedAt: '2024-09-19T16:20:00Z', 
      duration: '1 hour 20 minutes',
      outcome: 'Emergency services contacted - Student safe and receiving care',
      followUpScheduled: true
    }
  ];

  const responseTeam = [
    { name: 'Dr. Sarah Johnson', role: 'Lead Crisis Counselor', status: 'Available', phone: '+1-555-0123' },
    { name: 'Dr. Michael Chen', role: 'Clinical Psychologist', status: 'In Session', phone: '+1-555-0124' },
    { name: 'Campus Security', role: 'Emergency Response', status: 'On Standby', phone: '+1-555-0911' },
    { name: 'Dean of Students', role: 'Administrative Liaison', status: 'Available', phone: '+1-555-0125' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <AdminLayout 
      title="Crisis Management Center" 
      subtitle="Emergency response coordination and student safety oversight"
    >
      <div className="space-y-8">
        {/* Demo Banner: No backend endpoints for crisis yet */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong>Demo Data:</strong> Crisis endpoints are not implemented in the backend yet. This module currently displays mock data only.
          </AlertDescription>
        </Alert>
        {/* Emergency Alert Banner */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{activeCrises.length} Active Crisis Situations</strong> requiring immediate administrative oversight. 
            Emergency protocols are currently activated.
          </AlertDescription>
        </Alert>

        {loading && <div className="text-sm text-gray-600">Loading crises...</div>}
        {error && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Crises ({activeCrises.length})
            </TabsTrigger>
            <TabsTrigger value="response" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Response Team
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Resolutions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Crisis Analytics
            </TabsTrigger>
          </TabsList>

          {/* Active Crises Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {activeCrises.map((crisis) => (
                <Card key={crisis.id} className="border-red-200 bg-red-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-red-900">{crisis.id}</CardTitle>
                          <Badge className={getSeverityColor(crisis.severity)}>
                            {crisis.severity} Priority
                          </Badge>
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            {crisis.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-red-700">
                          Student ID: {crisis.studentId} • {crisis.trigger}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <Phone className="w-4 h-4 mr-1" />
                          Emergency Call
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Intervene
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Crisis Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-red-200">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">Timeline</span>
                        </div>
                        <p className="text-sm text-gray-600">Started: {crisis.duration}</p>
                        <p className="text-sm text-gray-600">Duration: {crisis.duration}</p>
                        <p className="text-sm text-gray-600">Last Activity: {crisis.lastActivity}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">Location & Contact</span>
                        </div>
                        <p className="text-sm text-gray-600">Location: {crisis.location}</p>
                        <p className="text-sm text-gray-600">Counselor: {crisis.counselorAssigned}</p>
                        <p className="text-sm text-gray-600">Contact Attempts: {crisis.contactAttempts}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">Risk Assessment</span>
                        </div>
                        <div className="space-y-1">
                          {crisis.riskFactors.map((factor: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Conversation Excerpts */}
                    <div className="p-4 bg-white rounded-lg border border-red-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Recent Conversation Excerpts
                      </h4>
                      <div className="space-y-2">
                        {crisis.conversationExcerpts.map((excerpt: { time: string; message: string }, index: number) => (
                          <div key={index} className="flex gap-3">
                            <span className="text-xs text-gray-500 font-mono min-w-0">{excerpt.time}</span>
                            <p className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded flex-1">
                              "{excerpt.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button className="admin-black-bg hover:bg-gray-800 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Document Response
                      </Button>
                      <Button variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Coordinate Team
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Notify Family
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Response Team Tab */}
          <TabsContent value="response" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Response Team</CardTitle>
                <CardDescription>
                  Current availability and contact information for crisis intervention personnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {responseTeam.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          className={
                            member.status === 'Available' ? 'success-green-bg text-white' :
                            member.status === 'In Session' ? 'warning-amber-bg text-white' :
                            'admin-medium-gray-bg text-white'
                          }
                        >
                          {member.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          {member.phone}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Resolutions Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Crisis Resolutions</CardTitle>
                <CardDescription>
                  Successfully resolved crisis situations and follow-up status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResolutions.map((resolution) => (
                    <div key={resolution.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-900">{resolution.id}</span>
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              Resolved
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700">Student ID: {resolution.studentId}</p>
                        </div>
                        <div className="text-right text-sm text-green-600">
                          <p>Resolved: {formatTimeAgo(resolution.resolvedAt)}</p>
                          <p>Duration: {resolution.duration}</p>
                        </div>
                      </div>
                      <p className="text-sm text-green-800 mb-2">{resolution.outcome}</p>
                      {resolution.followUpScheduled && (
                        <Badge className="success-green-bg text-white text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Follow-up Scheduled
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crisis Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Crises</span>
                      <span className="text-2xl font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Resolution Time</span>
                      <span className="text-lg font-semibold">1.2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-lg font-semibold text-green-600">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Response Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Response Time</span>
                      <span className="text-lg font-semibold">3.2 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Team Utilization</span>
                      <span className="text-lg font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Follow-up Rate</span>
                      <span className="text-lg font-semibold text-blue-600">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">vs Last Week</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-semibold">-15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Peak Hours</span>
                      <span className="text-lg font-semibold">2-6 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Most Common Trigger</span>
                      <span className="text-sm font-semibold">Academic Stress</span>
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