import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { toast } from '../utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  UserCheck, 
  Heart, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Calendar,
  Mail,
  GraduationCap,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { getPendingRequests, updateTherapistStatus, updateVolunteerStatus } from '../api/admin';

export default function UserManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for pending users - fetched from backend
  const [pendingCounselors, setPendingCounselors] = useState<any[]>([]);
  const [pendingVolunteers, setPendingVolunteers] = useState<any[]>([]);

  const activeUsers = {
    counselors: 23,
    volunteers: 45,
    students: 1247,
    totalSessions: 892,
    totalPosts: 1456
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffDays = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const handleApproval = async (userId: string, userType: 'counselor' | 'volunteer', action: 'approve' | 'reject') => {
    try {
      if (userType === 'counselor') {
        await updateTherapistStatus(userId, { status: action === 'approve' ? 'approved' : 'rejected' });
      } else {
        await updateVolunteerStatus(userId, { status: action === 'approve' ? 'approved' : 'rejected' });
      }
      toast.success(
        action === 'approve' ? 'Approved' : 'Update Sent',
        userType === 'counselor' ? 'Counselor status updated' : 'Volunteer status updated'
      );
      await loadPending();
    } catch (error: any) {
      console.error('Approval/rejection failed:', error);
      toast.error('Action Failed', error?.message || 'Please try again later');
    }
  };

  const loadPending = async () => {
    try {
      const data = await getPendingRequests();
      setPendingCounselors(data?.therapists || []);
      setPendingVolunteers(data?.volunteers || []);
    } catch (e: any) {
      toast.error('Load Failed', e?.message || 'Could not load pending requests');
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleContactApplicant = (email: string, name: string, type: 'counselor' | 'volunteer') => {
    const subject = `Application Review - ${type.charAt(0).toUpperCase() + type.slice(1)} Position`;
    const body = `Dear ${name},\n\nWe are currently reviewing your application for the ${type} position. We may need additional information or clarification on some aspects of your application.\n\nPlease reply to this email at your earliest convenience so we can discuss the next steps in the review process.\n\nBest regards,\nAdministration Team\nManMitra Mental Health Services`;
    
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
      title="User Management" 
      subtitle="Comprehensive oversight of counselors, volunteers, and student users"
    >
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admins/users/counselors')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Counselors</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers.counselors}</p>
                  <p className="text-sm text-gray-500">{pendingCounselors.length} pending approval</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admins/users/volunteers')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span className="text-sm font-medium text-gray-600">Volunteers</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers.volunteers}</p>
                  <p className="text-sm text-gray-500">{pendingVolunteers.length} pending approval</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Active Students</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeUsers.students.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Platform users</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Total Sessions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{activeUsers.totalSessions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">This semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              New counselor and volunteer applications requiring administrative review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="counselors" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="counselors" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Counselors ({pendingCounselors.length})
                </TabsTrigger>
                <TabsTrigger value="volunteers" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Volunteers ({pendingVolunteers.length})
                </TabsTrigger>
              </TabsList>

              {/* Counselor Approvals */}
              <TabsContent value="counselors" className="space-y-4">
                <div className="flex gap-4 mb-6">
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
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {pendingCounselors.map((counselor: any) => (
                    <Card key={counselor._id || counselor.id} className="border-orange-200 bg-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{counselor.name}</h3>
                              <Badge 
                                variant={counselor.status === 'Under Review' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {counselor.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <p><Mail className="w-4 h-4 inline mr-1" />{counselor.email}</p>
                                <p className="mt-1">Department: {counselor.department ?? '—'}</p>
                              </div>
                              <div>
                                <p>Specialization: {counselor.specialization ?? '—'}</p>
                                <p className="mt-1">License: {counselor.license ?? '—'}</p>
                              </div>
                              <div>
                                <p>Experience: {counselor.experience}</p>
                                <p className="mt-1">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  Applied: {formatTimeAgo(counselor.submittedAt ?? counselor.createdAt ?? new Date().toISOString())}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Submitted Documents:</p>
                          <div className="flex gap-2">
                            {(counselor.documents ?? []).map((doc: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="success-green-bg text-white hover:bg-green-700"
                            onClick={() => handleApproval(counselor._id || counselor.id, 'counselor', 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Application
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => handleApproval(counselor._id || counselor.id, 'counselor', 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleContactApplicant(counselor.email, counselor.name, 'counselor')}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Applicant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Volunteer Approvals */}
              <TabsContent value="volunteers" className="space-y-4">
                <div className="flex gap-4 mb-6">
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
                      <SelectItem value="ready">Ready for Review</SelectItem>
                      <SelectItem value="training">Training Incomplete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {pendingVolunteers.map((volunteer: any) => (
                    <Card key={volunteer._id || volunteer.id} className="border-pink-200 bg-pink-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{volunteer.name}</h3>
                              <Badge 
                                variant={volunteer.status === 'Ready for Review' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {volunteer.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <p><Mail className="w-4 h-4 inline mr-1" />{volunteer.email}</p>
                                <p className="mt-1">{volunteer.year ?? '—'} • {volunteer.major ?? '—'}</p>
                              </div>
                              <div>
                                <p>GPA: {volunteer.gpa ?? '—'}</p>
                                <p className="mt-1">Training: {typeof volunteer.trainingCompleted === 'number' ? volunteer.trainingCompleted : 0}% Complete</p>
                              </div>
                              <div>
                                <p>References: {(volunteer.references ?? []).join(', ')}</p>
                                <p className="mt-1">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  Applied: {formatTimeAgo(volunteer.submittedAt ?? volunteer.createdAt ?? new Date().toISOString())}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Motivation Statement:</p>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                            {volunteer.motivation ?? '—'}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="success-green-bg text-white hover:bg-green-700"
                            onClick={() => handleApproval(volunteer._id || volunteer.id, 'volunteer', 'approve')}
                            disabled={typeof volunteer.trainingCompleted === 'number' ? volunteer.trainingCompleted < 100 : false}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve as Volunteer
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => handleApproval(volunteer._id || volunteer.id, 'volunteer', 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleContactApplicant(volunteer.email, volunteer.name, 'volunteer')}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Applicant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}