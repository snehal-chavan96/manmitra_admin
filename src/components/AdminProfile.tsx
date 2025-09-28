import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { toast } from '../utils/toast';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  User,
  Shield,
  Bell,
  Activity,
  Calendar,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

export default function AdminProfile() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    desktop: true,
    crisis: true
  });

  // State for form data
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    extension: '',
    office: ''
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    role: '',
    department: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock profile data
  const profileData = {
    name: user?.name || 'Dr. Sarah Johnson',
    email: user?.email || 'admin@university.edu',
    role: user?.role || 'Senior Administrator',
    institution: user?.institution || 'University of Excellence',
    department: 'Student Counseling & Psychological Services',
    phone: '+1-555-0123',
    extension: '4567',
    office: 'Student Services Building, Room 203',
    employeeId: 'EMP-2024-001',
    startDate: '2023-01-15',
    lastLogin: '2024-09-20T15:30:00Z',
    totalSessions: 1247,
    permissions: ['Full Access', 'Crisis Management', 'User Management', 'Analytics', 'Reports'],
    certifications: ['Licensed Clinical Social Worker (LCSW)', 'Crisis Intervention Specialist', 'FERPA Certified']
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedContactInfo = localStorage.getItem('admin_contact_info');
      const savedProfessionalInfo = localStorage.getItem('admin_professional_info');
      const savedNotifications = localStorage.getItem('admin_notifications');

      if (savedContactInfo) {
        const parsed = JSON.parse(savedContactInfo);
        setContactInfo(parsed);
      } else {
        // Initialize with default values
        setContactInfo({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          extension: profileData.extension,
          office: profileData.office
        });
      }

      if (savedProfessionalInfo) {
        const parsed = JSON.parse(savedProfessionalInfo);
        setProfessionalInfo(parsed);
      } else {
        // Initialize with default values
        setProfessionalInfo({
          role: profileData.role,
          department: profileData.department
        });
      }

      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading saved profile data:', error);
      toast.error('Error Loading Data', 'Failed to load saved profile information');
    }
  }, []);

  // Save functions
  const saveContactInfo = () => {
    try {
      localStorage.setItem('admin_contact_info', JSON.stringify(contactInfo));
      toast.success('Contact Information Updated', 'Your contact details have been saved successfully');
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Save Failed', 'Failed to save contact information');
    }
  };

  const saveProfessionalInfo = () => {
    try {
      localStorage.setItem('admin_professional_info', JSON.stringify(professionalInfo));
      toast.success('Professional Information Updated', 'Your professional details have been saved successfully');
    } catch (error) {
      console.error('Error saving professional info:', error);
      toast.error('Save Failed', 'Failed to save professional information');
    }
  };

  const updatePassword = () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.warning('Missing Information', 'Please fill in all password fields');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Password Mismatch', 'New password and confirmation do not match');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        toast.warning('Weak Password', 'Password must be at least 8 characters long');
        return;
      }

      // In a real app, this would make an API call
      toast.success('Password Updated', 'Your password has been changed successfully');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Update Failed', 'Failed to update password');
    }
  };

  const saveNotificationPreferences = () => {
    try {
      localStorage.setItem('admin_notifications', JSON.stringify(notifications));
      toast.success('Preferences Saved', 'Your notification preferences have been updated');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Save Failed', 'Failed to save notification preferences');
    }
  };

  const activityLog = [
    { date: '2024-09-20T15:30:00Z', action: 'Logged in', details: 'IP: 192.168.1.100' },
    { date: '2024-09-20T14:45:00Z', action: 'Generated crisis report', details: 'Weekly Crisis Summary - Q3 2024' },
    { date: '2024-09-20T13:15:00Z', action: 'Approved counselor application', details: 'Dr. Michael Chen - Clinical Psychology' },
    { date: '2024-09-20T10:30:00Z', action: 'Updated system settings', details: 'Modified notification preferences' },
    { date: '2024-09-19T16:20:00Z', action: 'Accessed student analytics', details: 'Mental Health Trends Report' }
  ];

  const securityEvents = [
    { date: '2024-09-20T15:30:00Z', event: 'Successful login', status: 'success', location: 'Campus Office' },
    { date: '2024-09-19T08:45:00Z', event: 'Password changed', status: 'success', location: 'Campus Office' },
    { date: '2024-09-18T14:20:00Z', event: 'MFA verification', status: 'success', location: 'Remote Access' },
    { date: '2024-09-17T11:10:00Z', event: 'Login attempt failed', status: 'warning', location: 'Unknown IP' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout 
      title="Administrator Profile" 
      subtitle="Personal account management and security settings"
    >
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-xl font-semibold trust-blue-bg text-white">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">{profileData.name}</h1>
                  <Badge className="success-gradient text-white">Active</Badge>
                </div>
                <p className="text-lg text-gray-600 mb-2">{profileData.role}</p>
                <p className="text-gray-600 mb-4">{profileData.department}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Institution</p>
                    <p className="font-medium">{profileData.institution}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employee ID</p>
                    <p className="font-medium">{profileData.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(profileData.startDate)}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Last Login</p>
                <p className="font-medium">{formatTimeAgo(profileData.lastLogin)}</p>
                <Button variant="outline" className="mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Export Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Update your contact details and office information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={contactInfo.name} 
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      value={contactInfo.email} 
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        value={contactInfo.phone} 
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Extension</label>
                      <Input 
                        value={contactInfo.extension} 
                        onChange={(e) => setContactInfo({...contactInfo, extension: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Office Location</label>
                    <Input 
                      value={contactInfo.office} 
                      onChange={(e) => setContactInfo({...contactInfo, office: e.target.value})}
                    />
                  </div>

                  <Button 
                    className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={saveContactInfo}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Contact Information
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Role details and certifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input 
                      value={professionalInfo.role} 
                      onChange={(e) => setProfessionalInfo({...professionalInfo, role: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input 
                      value={professionalInfo.department} 
                      onChange={(e) => setProfessionalInfo({...professionalInfo, department: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Certifications</label>
                    <div className="space-y-2">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{cert}</span>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      All required certifications are current and verified
                    </p>
                  </div>

                  <Button 
                    className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={saveProfessionalInfo}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Professional Information
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Authentication</CardTitle>
                  <CardDescription>Manage your password and multi-factor authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="Enter new password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input 
                      type="password" 
                      placeholder="Confirm new password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                    <div>
                      <p className="text-sm font-medium text-green-900">Multi-Factor Authentication</p>
                      <p className="text-xs text-green-700">Additional security layer enabled</p>
                    </div>
                    <Badge className="success-gradient text-white">Enabled</Badge>
                  </div>

                  <Button 
                    className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={updatePassword}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Events</CardTitle>
                  <CardDescription>Recent security-related activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityEvents.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        {getStatusIcon(event.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    View Complete Security Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Permissions</CardTitle>
                <CardDescription>Your current access levels and authorized functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">System Access</h4>
                    <div className="space-y-3">
                      {profileData.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{permission}</span>
                          </div>
                          <Badge className="success-gradient text-white">Granted</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Data Access Levels</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">Student Records</p>
                        <p className="text-xs text-blue-700">Anonymized analytics and aggregate data only</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-medium text-green-900">Crisis Management</p>
                        <p className="text-xs text-green-700">Full access to emergency response systems</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded border border-purple-200">
                        <p className="text-sm font-medium text-purple-900">System Administration</p>
                        <p className="text-xs text-purple-700">Complete system configuration and management</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">FERPA Compliance Notice</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    All data access is logged and monitored for compliance with FERPA regulations. 
                    Unauthorized access or misuse of student information is strictly prohibited.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and system interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded">
                      <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Activity Log
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how you receive system notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS Alerts</p>
                      <p className="text-xs text-gray-600">Crisis alerts via text message</p>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Desktop Notifications</p>
                      <p className="text-xs text-gray-600">Browser push notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.desktop}
                      onCheckedChange={(checked) => setNotifications({...notifications, desktop: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Crisis Alerts</p>
                      <p className="text-xs text-gray-600">Immediate crisis notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.crisis}
                      onCheckedChange={(checked) => setNotifications({...notifications, crisis: checked})}
                    />
                  </div>

                  <Button 
                    className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={saveNotificationPreferences}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interface Preferences</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dashboard Theme</label>
                    <select className="w-full p-2 border rounded">
                      <option>Light Theme</option>
                      <option>Dark Theme</option>
                      <option>Auto (System)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Report Format</label>
                    <select className="w-full p-2 border rounded">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dashboard Refresh Rate</label>
                    <select className="w-full p-2 border rounded">
                      <option>15 seconds</option>
                      <option>30 seconds</option>
                      <option>1 minute</option>
                      <option>5 minutes</option>
                    </select>
                  </div>

                  <Button 
                    className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={() => toast.success('Interface Preferences Saved', 'Your interface settings have been updated')}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Interface Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}