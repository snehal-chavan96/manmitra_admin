import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from '../utils/toast';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  Mail,
  Phone,
  Calendar,
  Award,
  Users,
  BarChart3,
  MessageSquare,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getTherapists, addTherapist, deleteTherapist, updateTherapistStatus } from '../api/admin';

export default function CounselorManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; phone: string; qualifications?: string }>({ name: '', email: '', phone: '', qualifications: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Mock counselor data
  const mockCounselors = [
    {
      id: 'C001',
      name: 'Dr. Sarah Johnson',
      email: 'sjohnson@university.edu',
      phone: '+1-555-0123',
      department: 'Psychology',
      specialization: 'Anxiety & Depression',
      license: 'LPC-123456',
      experience: '10 years',
      status: 'Active',
      students: 45,
      sessionsThisMonth: 67,
      averageRating: 4.8,
      availability: 'Available',
      joinedDate: '2022-08-15',
      certifications: ['Crisis Intervention', 'CBT Specialist', 'Trauma-Informed Care']
    },
    {
      id: 'C002',
      name: 'Dr. Michael Chen',
      email: 'mchen@university.edu',
      phone: '+1-555-0124',
      department: 'Clinical Psychology',
      specialization: 'Crisis Intervention',
      license: 'PhD-789012',
      experience: '8 years',
      status: 'Active',
      students: 52,
      sessionsThisMonth: 78,
      averageRating: 4.9,
      availability: 'In Session',
      joinedDate: '2023-01-20',
      certifications: ['Crisis Intervention', 'EMDR', 'Group Therapy']
    },
    {
      id: 'C003',
      name: 'Dr. Lisa Rodriguez',
      email: 'lrodriguez@university.edu',
      phone: '+1-555-0125',
      department: 'Social Work',
      specialization: 'Family Therapy',
      license: 'LCSW-345678',
      experience: '12 years',
      status: 'Active',
      students: 38,
      sessionsThisMonth: 56,
      averageRating: 4.7,
      availability: 'Available',
      joinedDate: '2021-09-10',
      certifications: ['Family Systems', 'Substance Abuse', 'Multicultural Counseling']
    }
  ];

  const performanceMetrics = {
    totalCounselors: 23,
    totalSessions: 892,
    averageRating: 4.8,
    responseTime: '2.3 hours',
    utilizationRate: 78,
    studentSatisfaction: 94
  };

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const data = await getTherapists();
      setTherapists(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load therapists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleAddTherapist = async () => {
    if (!form.name || !form.email) return setError('Name and Email are required');
    try {
      setActionLoading(true);
      await addTherapist(form);
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '', qualifications: '' });
      await fetchTherapists();
    } catch (e: any) {
      setError(e?.message || 'Failed to add therapist');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTherapist = async (id?: string) => {
    if (!id) return;
    try {
      setActionLoading(true);
      await deleteTherapist(id);
      await fetchTherapists();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete therapist');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatus = async (id?: string, status?: 'approved' | 'rejected') => {
    if (!id || !status) return;
    try {
      setActionLoading(true);
      await updateTherapistStatus(id, { status });
      await fetchTherapists();
    } catch (e: any) {
      setError(e?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success-green-bg text-white';
      case 'Inactive': return 'admin-medium-gray-bg text-white';
      case 'On Leave': return 'warning-amber-bg text-white';
      default: return 'admin-light-gray-bg text-gray-700';
    }
  };

  const handleViewProfile = (counselor: any) => {
    setSelectedCounselor(counselor);
    setProfileModalOpen(true);
  };

  const handleContact = (email: string, name: string) => {
    const subject = `Administrative Message - Counselor`;
    const body = `Dear ${name},\n\nI hope this message finds you well. I wanted to reach out regarding your counseling services.\n\nPlease let me know if you have any questions or if there's anything you need support with.\n\nBest regards,\nAdministration Team\nManMitra Mental Health Services`;
    
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
      title="Counselor Management" 
      subtitle="Professional staff oversight and performance monitoring"
    >
      <div className="space-y-8">
        {loading && (
          <div className="p-3 text-sm text-gray-600">Loading therapists...</div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-600">{error}</div>
        )}
        {/* Actions Toolbar */}
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={() => setAddOpen(true)}>Add Therapist</Button>
        </div>
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Active Counselors</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalCounselors}</p>
              <p className="text-sm text-gray-500">{performanceMetrics.utilizationRate}% utilization rate</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Sessions This Month</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalSessions}</p>
              <p className="text-sm text-gray-500">Avg response: {performanceMetrics.responseTime}</p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Student Satisfaction</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.studentSatisfaction}%</p>
              <p className="text-sm text-gray-500">Avg rating: {performanceMetrics.averageRating}/5.0</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Active Counselors ({(therapists.length || mockCounselors.length)})
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance Analytics
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Scheduling & Availability
            </TabsTrigger>
          </TabsList>

          {/* Active Counselors Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search counselors..."
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

            {/* Counselor Cards */}
            <div className="space-y-4">
              {(therapists.length ? therapists : mockCounselors)
                .filter((c:any) =>
                  !searchTerm ||
                  (c.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
                   c.email?.toLowerCase?.().includes(searchTerm.toLowerCase()))
                )
                .map((counselor:any) => (
                <Card key={counselor.id || counselor._id} className="admin-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{counselor.name || 'Counselor'}</h3>
                            <p className="text-sm text-gray-600">{counselor.department || '—'} • {counselor.specialization || '—'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(counselor.status || 'Active')}>
                              {counselor.status || 'Active'}
                            </Badge>
                            <Badge className={getAvailabilityColor(counselor.availability || 'Available')}>
                              {counselor.availability || 'Available'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Contact</p>
                            <p className="font-medium text-gray-900">
                              <Mail className="w-4 h-4 inline mr-1" />{counselor.email || '—'}
                            </p>
                            <p className="text-gray-600">
                              <Phone className="w-4 h-4 inline mr-1" />{counselor.phone}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Performance</p>
                            <p className="font-medium text-gray-900">{counselor.students ?? 0} active students</p>
                            <p className="text-sm text-gray-600">{counselor.sessionsThisMonth ?? 0} sessions this month</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Rating & Experience</p>
                            <p className="font-medium text-gray-900">⭐ {counselor.averageRating ?? '—'}/5.0</p>
                            <p className="text-gray-600">{counselor.experience || '—'} experience</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">License & Started</p>
                            <p className="font-medium text-gray-900">{counselor.license}</p>
                            <p className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {counselor.joinedDate ? new Date(counselor.joinedDate).toLocaleDateString() : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(counselor)}
                      >View Profile</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatus(counselor.id || counselor._id, 'approved')}
                        disabled={actionLoading}
                      >Approve</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatus(counselor.id || counselor._id, 'rejected')}
                        disabled={actionLoading}
                      >Reject</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteTherapist(counselor.id || counselor._id)}
                        disabled={actionLoading}
                      >Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Top Performers This Month</CardTitle>
                <CardDescription>Based on session count and student feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(therapists.length ? therapists : mockCounselors)
                    .sort((a: any, b: any) => (b.sessionsThisMonth ?? 0) - (a.sessionsThisMonth ?? 0))
                    .slice(0, 3)
                    .map((counselor: any, index: number) => (
                      <div key={counselor.id || counselor._id} className="flex items-center justify-between p-3 admin-pale-gray-bg rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'warning-amber-bg text-white' :
                            index === 1 ? 'admin-medium-gray-bg text-white' :
                            'admin-light-gray-bg text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{counselor.name || 'Counselor'}</p>
                            <p className="text-sm text-gray-600">{counselor.specialization || '—'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{counselor.sessionsThisMonth ?? 0} sessions</p>
                          <p className="text-sm text-gray-600">⭐ {counselor.averageRating ?? '—'}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Current Availability</CardTitle>
                <CardDescription>Real-time counselor availability status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(therapists.length ? therapists : mockCounselors).map((counselor: any) => (
                    <div key={counselor.id || counselor._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{counselor.name || 'Counselor'}</p>
                          <p className="text-sm text-gray-600">{counselor.specialization || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Next Available</p>
                          <p className="font-medium text-gray-900">
                            {(counselor.availability || 'Available') === 'Available' ? 'Now' : 'In 2 hours'}
                          </p>
                        </div>
                        <Badge className={getAvailabilityColor(counselor.availability || 'Available')}>
                          {counselor.availability || 'Available'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <span className="text-xl">{selectedCounselor?.name}</span>
                <p className="text-sm text-gray-600 font-normal">{selectedCounselor?.department} • {selectedCounselor?.specialization}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Complete professional profile and performance overview
            </DialogDescription>
          </DialogHeader>
          
          {selectedCounselor && (
            <div className="space-y-6 mt-6">
              {/* Status & Availability */}
              <div className="flex gap-4">
                <Badge className={getStatusColor(selectedCounselor.status)}>
                  {selectedCounselor.status}
                </Badge>
                <Badge className={getAvailabilityColor(selectedCounselor.availability)}>
                  {selectedCounselor.availability}
                </Badge>
              </div>

              {/* Contact & Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{selectedCounselor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{selectedCounselor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">Joined {new Date(selectedCounselor.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">License</p>
                      <p className="font-medium text-gray-900">{selectedCounselor.license}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium text-gray-900">{selectedCounselor.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialization</p>
                      <p className="font-medium text-gray-900">{selectedCounselor.specialization}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedCounselor.students}</div>
                      <div className="text-sm text-gray-600">Active Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedCounselor.sessionsThisMonth}</div>
                      <div className="text-sm text-gray-600">Sessions This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">⭐ {selectedCounselor.averageRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Certifications & Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedCounselor.certifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleContact(selectedCounselor.email, selectedCounselor.name)}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Counselor
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

      {/* Add Therapist Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Therapist</DialogTitle>
            <DialogDescription>Enter basic details to create a therapist</DialogDescription>
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
            <div>
              <p className="text-sm text-gray-600">Qualifications</p>
              <Input value={form.qualifications || ''} onChange={e => setForm({ ...form, qualifications: e.target.value })} placeholder="e.g. CBT, EMDR" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTherapist} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}