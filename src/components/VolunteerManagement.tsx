import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from '../utils/toast';
import { 
  Heart, 
  Search, 
  Filter, 
  Eye, 
  Mail,
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  Star,
  Phone
} from 'lucide-react';
import { getVolunteers, addVolunteer, deleteVolunteer, updateVolunteerStatus } from '../api/admin';

export default function VolunteerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; phone: string }>({ name: '', email: '', phone: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Mock volunteer data
  const mockVolunteers = [
    {
      id: 'V001',
      name: 'Sarah Williams',
      email: 'swilliams@student.university.edu',
      year: 'Junior',
      major: 'Psychology',
      gpa: '3.8',
      status: 'Active',
      hoursThisMonth: 25,
      totalHours: 156,
      studentsHelped: 23,
      postsModerated: 45,
      averageRating: 4.7,
      joinedDate: '2024-02-15',
      specialties: ['Anxiety Support', 'Academic Stress', 'Peer Mentoring'],
      trainingCompleted: 100,
      availability: 'Available'
    },
    {
      id: 'V002',
      name: 'Alex Thompson',
      email: 'athompson@student.university.edu',
      year: 'Senior',
      major: 'Social Work',
      gpa: '3.9',
      status: 'Active',
      hoursThisMonth: 32,
      totalHours: 234,
      studentsHelped: 31,
      postsModerated: 67,
      averageRating: 4.9,
      joinedDate: '2023-09-10',
      specialties: ['Crisis Support', 'LGBTQ+ Issues', 'Family Problems'],
      trainingCompleted: 100,
      availability: 'In Session'
    },
    {
      id: 'V003',
      name: 'Maria Rodriguez',
      email: 'mrodriguez@student.university.edu',
      year: 'Sophomore',
      major: 'Mental Health Studies',
      gpa: '3.7',
      status: 'Active',
      hoursThisMonth: 18,
      totalHours: 89,
      studentsHelped: 15,
      postsModerated: 28,
      averageRating: 4.6,
      joinedDate: '2024-06-20',
      specialties: ['Depression Support', 'Study Skills', 'Cultural Adjustment'],
      trainingCompleted: 100,
      availability: 'Available'
    }
  ];

  // Compute list of approved volunteers from backend (fallback to mock as already-approved)
  const approvedVolunteers = (volunteers.length ? volunteers : mockVolunteers).filter((v: any) =>
    (v.status ?? 'approved') === 'approved'
  );

  const volunteerMetrics = {
    totalVolunteers: 45,
    totalHours: 2156,
    studentsHelped: 187,
    postsModerated: 456,
    averageRating: 4.7,
    monthlyGrowth: 12
  };

  const trainingProgress = [
    { module: 'Mental Health Basics', completed: 45, total: 45 },
    { module: 'Crisis Recognition', completed: 43, total: 45 },
    { module: 'Active Listening', completed: 45, total: 45 },
    { module: 'Referral Protocols', completed: 41, total: 45 },
    { module: 'Ethics & Boundaries', completed: 44, total: 45 }
  ];

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await getVolunteers();
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleAddVolunteer = async () => {
    if (!form.name || !form.email) {
      toast.error('Missing fields', 'Name and Email are required');
      return;
    }
    try {
      setActionLoading(true);
      await addVolunteer(form);
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '' });
      toast.success('Volunteer added', 'The volunteer has been created');
      await fetchVolunteers();
    } catch (e: any) {
      toast.error('Add failed', e?.message || 'Could not add volunteer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVolunteer = async (id?: string) => {
    if (!id) return;
    try {
      setActionLoading(true);
      await deleteVolunteer(id);
      toast.success('Volunteer deleted', 'Record removed');
      await fetchVolunteers();
    } catch (e: any) {
      toast.error('Delete failed', e?.message || 'Could not delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatus = async (id?: string, status?: 'approved' | 'rejected') => {
    if (!id || !status) return;
    try {
      setActionLoading(true);
      await updateVolunteerStatus(id, { status });
      toast.success('Status updated', `Volunteer ${status}`);
      await fetchVolunteers();
    } catch (e: any) {
      toast.error('Update failed', e?.message || 'Could not update status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success-green-bg text-white';
      case 'Inactive': return 'admin-medium-gray-bg text-white';
      case 'Training': return 'warning-amber-bg text-white';
      default: return 'admin-light-gray-bg text-gray-700';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'success-green-bg text-white';
      case 'In Session': return 'warning-amber-bg text-white';
      case 'Offline': return 'admin-medium-gray-bg text-white';
      default: return 'admin-light-gray-bg text-gray-700';
    }
  };

  const handleViewProfile = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setProfileModalOpen(true);
  };

  const handleContact = (email: string, name: string) => {
    const subject = `Volunteer Coordination - ManMitra`;
    const body = `Dear ${name},\n\nThank you for your dedicated volunteer service with ManMitra Mental Health Services. Your contribution makes a real difference in our community.\n\nI wanted to reach out regarding your volunteer activities and see if you need any support or have feedback to share.\n\nPlease let me know if you have any questions or if there's anything we can do to better support you in your role.\n\nBest regards,\nAdministration Team\nManMitra Mental Health Services`;
    
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.open(mailtoURL, '_blank');
      toast.info('Email Client Opened', `Draft email created for ${name}`);
    } catch (error) {
      console.error('Failed to open email client:', error);
      toast.error('Email Failed', 'Please contact manually via email');
    }
  };

  return (
    <AdminLayout 
      title="Volunteer Management" 
      subtitle="Peer support volunteer coordination and performance tracking"
    >
      <div className="space-y-8">
        {loading && (
          <div className="p-3 text-sm text-gray-600">Loading volunteers...</div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-600">{error}</div>
        )}
        {/* Actions Toolbar */}
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={() => setAddOpen(true)}>Add Volunteer</Button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-600">Active Volunteers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.totalVolunteers}</p>
              <p className="text-sm text-gray-500">+{volunteerMetrics.monthlyGrowth}% this month</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Hours</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.totalHours.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Volunteer time contributed</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Students Helped</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.studentsHelped}</p>
              <p className="text-sm text-gray-500">Direct peer support</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Average Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.averageRating}/5.0</p>
              <p className="text-sm text-gray-500">Student satisfaction</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Active Volunteers ({approvedVolunteers.length})
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Training & Onboarding
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Active Volunteers Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-session">In Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volunteer Cards */}
            <div className="space-y-4">
              {approvedVolunteers
                .filter((v:any) =>
                  !searchTerm ||
                  (v.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
                   v.email?.toLowerCase?.().includes(searchTerm.toLowerCase()))
                )
                .map((volunteer:any) => (
                <Card key={volunteer.id} className="admin-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{volunteer.name || 'Volunteer'}</h3>
                            <p className="text-sm text-gray-600">{volunteer.year || '—'} • {volunteer.major || '—'} • GPA: {volunteer.gpa || '—'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(volunteer.status || 'Active')}>
                              {volunteer.status || 'Active'}
                            </Badge>
                            <Badge className={getAvailabilityColor(volunteer.availability || 'Available')}>
                              {volunteer.availability || 'Available'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Contact</p>
                            <p className="font-medium text-gray-900">
                              <Mail className="w-4 h-4 inline mr-1" />{volunteer.email || '—'}
                            </p>
                            <p className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Joined: {volunteer.joinedDate ? new Date(volunteer.joinedDate).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">This Month</p>
                            <p className="font-medium text-gray-900">{volunteer.hoursThisMonth ?? 0} hours</p>
                            <p className="text-gray-600">{volunteer.studentsHelped ?? 0} students helped</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Total Contribution</p>
                            <p className="font-medium text-gray-900">{volunteer.totalHours ?? 0} total hours</p>
                            <p className="text-gray-600">{volunteer.postsModerated ?? 0} posts moderated</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Performance</p>
                            <p className="font-medium text-gray-900">⭐ {volunteer.averageRating ?? '—'}/5.0</p>
                            <p className="text-gray-600">{volunteer.trainingCompleted ?? 0}% training complete</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(volunteer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContact(volunteer.email, volunteer.name)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatus(volunteer.id || volunteer._id, 'approved')}
                          disabled={actionLoading}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatus(volunteer.id || volunteer._id, 'rejected')}
                          disabled={actionLoading}
                        >
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteVolunteer(volunteer.id || volunteer._id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {(volunteer.specialties || []).map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training Progress Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Training Module Completion</CardTitle>
                <CardDescription>Overall volunteer training progress across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingProgress.map((module: { module: string; completed: number; total: number; }, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{module.module}</span>
                        <span className="text-sm text-gray-600">{module.completed}/{module.total} volunteers</span>
                      </div>
                      <Progress 
                        value={(module.completed / module.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Training Completion Status</CardTitle>
                  <CardDescription>Volunteer readiness for peer support activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvedVolunteers.map((volunteer: any) => (
                    <div key={volunteer.id || volunteer._id} className="flex items-center justify-between p-3 admin-pale-gray-bg rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">{volunteer.year || '—'} • {volunteer.major || '—'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{volunteer.trainingCompleted ?? 0}%</p>
                          <p className="text-xs text-gray-600">Complete</p>
                        </div>
                        <Progress value={volunteer.trainingCompleted ?? 0} className="w-20 h-2" />
                        {(volunteer.trainingCompleted ?? 0) === 100 && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Training Recommendations</CardTitle>
                  <CardDescription>Suggested improvements and focus areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Crisis Recognition</p>
                      <p className="text-sm text-gray-600">
                        Focus area: 2 volunteers need to complete this critical module
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Referral Protocols</p>
                      <p className="text-sm text-gray-600">
                        4 volunteers need to complete referral protocol training
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Advanced Training</p>
                      <p className="text-sm text-gray-600">
                        Consider specialized modules for experienced volunteers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Top Contributors This Month</CardTitle>
                  <CardDescription>Based on hours contributed and impact metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {approvedVolunteers
                      .sort((a: any, b: any) => (b.hoursThisMonth ?? 0) - (a.hoursThisMonth ?? 0))
                      .slice(0, 3)
                      .map((volunteer: any, index: number) => (
                        <div key={volunteer.id || volunteer._id} className="flex items-center justify-between p-3 admin-pale-gray-bg rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'warning-amber-bg text-white' :
                              index === 1 ? 'admin-medium-gray-bg text-white' :
                              'admin-light-gray-bg text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{volunteer.name || 'Volunteer'}</p>
                              <p className="text-sm text-gray-600">{volunteer.year || '—'} • {volunteer.major || '—'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{volunteer.hoursThisMonth ?? 0} hours</p>
                            <p className="text-sm text-gray-600">⭐ {volunteer.averageRating ?? '—'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                  <CardDescription>Volunteer program effectiveness and reach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 admin-pale-gray-bg rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.studentsHelped}</p>
                      <p className="text-sm text-gray-600">Students Reached</p>
                    </div>
                    <div className="text-center p-3 admin-pale-gray-bg rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{volunteerMetrics.postsModerated}</p>
                      <p className="text-sm text-gray-600">Posts Moderated</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Hours per Volunteer</span>
                      <span className="font-semibold">{Math.round(volunteerMetrics.totalHours / volunteerMetrics.totalVolunteers)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students per Volunteer</span>
                      <span className="font-semibold">{Math.round(volunteerMetrics.studentsHelped / volunteerMetrics.totalVolunteers)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Program Growth</span>
                      <span className="font-semibold text-green-600">+{volunteerMetrics.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <span className="text-xl">{selectedVolunteer?.name}</span>
                <p className="text-sm text-gray-600 font-normal">{selectedVolunteer?.year} • {selectedVolunteer?.major}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Complete volunteer profile and contribution overview
            </DialogDescription>
          </DialogHeader>
          
          {selectedVolunteer && (
            <div className="space-y-6 mt-6">
              {/* Status & Availability */}
              <div className="flex gap-4">
                <Badge className={getStatusColor(selectedVolunteer.status)}>
                  {selectedVolunteer.status}
                </Badge>
                <Badge className={getAvailabilityColor(selectedVolunteer.availability)}>
                  {selectedVolunteer.availability}
                </Badge>
              </div>

              {/* Academic & Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{selectedVolunteer.major}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{selectedVolunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">Joined {new Date(selectedVolunteer.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Academic Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-medium text-gray-900">{selectedVolunteer.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className="font-medium text-gray-900">{selectedVolunteer.gpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Training Status</p>
                      <p className="font-medium text-gray-900">{selectedVolunteer.trainingCompleted}% Complete</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Volunteer Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Volunteer Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedVolunteer.hoursThisMonth}</div>
                      <div className="text-sm text-gray-600">Hours This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedVolunteer.totalHours}</div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedVolunteer.studentsHelped}</div>
                      <div className="text-sm text-gray-600">Students Helped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">⭐ {selectedVolunteer.averageRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Areas of Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleContact(selectedVolunteer.email, selectedVolunteer.name)}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Volunteer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Volunteer Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Volunteer</DialogTitle>
            <DialogDescription>Enter basic details to create a volunteer</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91-..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddVolunteer} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}