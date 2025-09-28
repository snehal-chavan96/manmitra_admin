import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from '../utils/toast';
import { 
  Settings,
  Shield,
  Users,
  Bell,
  Database,
  Mail,
  Calendar,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export default function AdminSettings() {
  const [notifications, setNotifications] = useState({
    crisisAlerts: true,
    dailyReports: true,
    weeklyAnalytics: false,
    systemUpdates: true,
    userRegistrations: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: '7years',
    anonymization: 'automatic',
    accessLogging: true,
    dataExport: 'authorized-only',
    auditTrail: true
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    mfaRequired: true,
    loginAttempts: '3',
    autoBackup: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('adminSettings_notifications');
      const savedPrivacySettings = localStorage.getItem('adminSettings_privacy');
      const savedSystemSettings = localStorage.getItem('adminSettings_system');

      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedPrivacySettings) {
        setPrivacySettings(JSON.parse(savedPrivacySettings));
      }
      if (savedSystemSettings) {
        setSystemSettings(JSON.parse(savedSystemSettings));
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      toast.error('Settings Load Failed', 'Could not restore saved settings');
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('adminSettings_notifications', JSON.stringify(notifications));
      localStorage.setItem('adminSettings_privacy', JSON.stringify(privacySettings));
      localStorage.setItem('adminSettings_system', JSON.stringify(systemSettings));
      
      toast.success('Settings Saved', 'All administrative settings have been saved successfully');
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      toast.error('Save Failed', 'Could not save settings. Please try again.');
    }
  };

  const resetSettings = () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('adminSettings_notifications');
      localStorage.removeItem('adminSettings_privacy');
      localStorage.removeItem('adminSettings_system');

      // Reset to defaults
      setNotifications({
        crisisAlerts: true,
        dailyReports: true,
        weeklyAnalytics: false,
        systemUpdates: true,
        userRegistrations: true
      });

      setPrivacySettings({
        dataRetention: '7years',
        anonymization: 'automatic',
        accessLogging: true,
        dataExport: 'authorized-only',
        auditTrail: true
      });

      setSystemSettings({
        sessionTimeout: '30',
        passwordPolicy: 'strong',
        mfaRequired: true,
        loginAttempts: '3',
        autoBackup: true
      });

      toast.success('Settings Reset', 'All settings have been restored to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Reset Failed', 'Could not reset settings');
    }
  };

  // Mock admin users data
  const adminUsers = [
    {
      id: 'ADMIN-001',
      name: 'Dr. Sarah Johnson',
      email: 'sjohnson@university.edu',
      role: 'Senior Administrator',
      lastLogin: '2024-09-20T15:30:00Z',
      permissions: ['Full Access'],
      status: 'Active',
      mfaEnabled: true
    },
    {
      id: 'ADMIN-002',
      name: 'Michael Chen',
      email: 'mchen@university.edu',
      role: 'IT Administrator',
      lastLogin: '2024-09-19T09:15:00Z',
      permissions: ['System Management', 'User Management'],
      status: 'Active',
      mfaEnabled: true
    },
    {
      id: 'ADMIN-003',
      name: 'Emily Rodriguez',
      email: 'erodriguez@university.edu',
      role: 'Clinical Director',
      lastLogin: '2024-09-18T14:20:00Z',
      permissions: ['Analytics', 'Reports', 'Crisis Management'],
      status: 'Active',
      mfaEnabled: false
    }
  ];

  const integrationSettings = [
    {
      name: 'Student Information System',
      status: 'Connected',
      lastSync: '2024-09-20T16:00:00Z',
      endpoint: 'https://sis.university.edu/api',
      authentication: 'OAuth 2.0'
    },
    {
      name: 'Campus Directory (LDAP)',
      status: 'Connected',
      lastSync: '2024-09-20T15:45:00Z',
      endpoint: 'ldap://directory.university.edu',
      authentication: 'LDAP Bind'
    },
    {
      name: 'Email Notification Service',
      status: 'Connected',
      lastSync: '2024-09-20T16:10:00Z',
      endpoint: 'smtp://mail.university.edu',
      authentication: 'SMTP Auth'
    },
    {
      name: 'Emergency Alert System',
      status: 'Pending Setup',
      lastSync: null,
      endpoint: 'Not Configured',
      authentication: 'API Key Required'
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': case 'Active': return 'success-gradient text-white';
      case 'Pending Setup': return 'warning-orange-bg text-white';
      case 'Disconnected': case 'Inactive': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <AdminLayout 
      title="Administrative Settings" 
      subtitle="System configuration and institutional policy management"
    >
      <div className="space-y-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="users">Admin Users</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Institution Configuration</CardTitle>
                  <CardDescription>Basic institutional settings and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution Name</label>
                    <Input defaultValue="University of Excellence" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mental Health Department</label>
                    <Input defaultValue="Student Counseling & Psychological Services" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Contact Email</label>
                    <Input defaultValue="mentalhealth@university.edu" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crisis Hotline</label>
                    <Input defaultValue="+1-555-CRISIS (555-274-7474)" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Zone</label>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>General system behavior and display settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Dark Mode Interface</label>
                      <p className="text-sm text-gray-600">Enable dark theme for admin interface</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Real-time Updates</label>
                      <p className="text-sm text-gray-600">Automatically refresh dashboard data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dashboard Refresh Interval</label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Report Format</label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full trust-blue-bg hover:bg-[#2570E8] text-white"
                      onClick={saveSettings}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save General Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>Security policies for user authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <Input 
                      type="number" 
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Policy</label>
                    <Select 
                      value={systemSettings.passwordPolicy}
                      onValueChange={(value) => setSystemSettings({...systemSettings, passwordPolicy: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="strong">Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                        <SelectItem value="complex">Complex (16+ chars, all requirements)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Login Attempts</label>
                    <Input 
                      type="number" 
                      value={systemSettings.loginAttempts}
                      onChange={(e) => setSystemSettings({...systemSettings, loginAttempts: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Require Multi-Factor Authentication</label>
                      <p className="text-sm text-gray-600">Mandatory for all admin accounts</p>
                    </div>
                    <Switch 
                      checked={systemSettings.mfaRequired}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, mfaRequired: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Automatic Backup</label>
                      <p className="text-sm text-gray-600">Daily system and data backup</p>
                    </div>
                    <Switch 
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>Current security configuration overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">SSL Certificate</span>
                      </div>
                      <Badge className="success-gradient text-white">Valid</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Database Encryption</span>
                      </div>
                      <Badge className="success-gradient text-white">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">Last Security Audit</span>
                      </div>
                      <Badge className="warning-orange-bg text-white">45 days ago</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Firewall Status</span>
                      </div>
                      <Badge className="trust-blue-bg text-white">Protected</Badge>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Run Security Scan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Security Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FERPA Compliance Settings</CardTitle>
                <CardDescription>Privacy protection and data handling configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Retention Period</label>
                      <Select 
                        value={privacySettings.dataRetention}
                        onValueChange={(value) => setPrivacySettings({...privacySettings, dataRetention: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="5years">5 Years</SelectItem>
                          <SelectItem value="7years">7 Years (Recommended)</SelectItem>
                          <SelectItem value="10years">10 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Anonymization</label>
                      <Select 
                        value={privacySettings.anonymization}
                        onValueChange={(value) => setPrivacySettings({...privacySettings, anonymization: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (Real-time)</SelectItem>
                          <SelectItem value="automatic">Automatic (24 hours)</SelectItem>
                          <SelectItem value="manual">Manual Review Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Export Policy</label>
                      <Select 
                        value={privacySettings.dataExport}
                        onValueChange={(value) => setPrivacySettings({...privacySettings, dataExport: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disabled">Disabled</SelectItem>
                          <SelectItem value="authorized-only">Authorized Personnel Only</SelectItem>
                          <SelectItem value="approval-required">Approval Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Access Logging</label>
                        <p className="text-sm text-gray-600">Log all data access attempts</p>
                      </div>
                      <Switch 
                        checked={privacySettings.accessLogging}
                        onCheckedChange={(checked) => setPrivacySettings({...privacySettings, accessLogging: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Audit Trail</label>
                        <p className="text-sm text-gray-600">Maintain comprehensive audit logs</p>
                      </div>
                      <Switch 
                        checked={privacySettings.auditTrail}
                        onCheckedChange={(checked) => setPrivacySettings({...privacySettings, auditTrail: checked})}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">FERPA Compliance Status</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Current configuration meets FERPA requirements for educational records privacy protection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className="trust-blue-bg hover:bg-[#2570E8] text-white"
                    onClick={saveSettings}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure alerts and automated notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">Crisis Alerts</h4>
                      <p className="text-sm text-gray-600">Immediate notifications for crisis situations</p>
                    </div>
                    <Switch 
                      checked={notifications.crisisAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, crisisAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">Daily Summary Reports</h4>
                      <p className="text-sm text-gray-600">Daily activity and metrics summary</p>
                    </div>
                    <Switch 
                      checked={notifications.dailyReports}
                      onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">Weekly Analytics</h4>
                      <p className="text-sm text-gray-600">Comprehensive weekly performance reports</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyAnalytics}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyAnalytics: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-gray-600">Notifications about system maintenance and updates</p>
                    </div>
                    <Switch 
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">New User Registrations</h4>
                      <p className="text-sm text-gray-600">Alerts for new counselor/volunteer applications</p>
                    </div>
                    <Switch 
                      checked={notifications.userRegistrations}
                      onCheckedChange={(checked) => setNotifications({...notifications, userRegistrations: checked})}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Notification Delivery Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Email</label>
                      <Input defaultValue="admin@university.edu" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SMS Number (Crisis Only)</label>
                      <Input defaultValue="+1-555-0123" />
                    </div>
                  </div>
                </div>

                <Button 
                  className="trust-blue-bg hover:bg-[#2570E8] text-white"
                  onClick={saveSettings}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Integrations</CardTitle>
                <CardDescription>External system connections and API configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationSettings.map((integration, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{integration.name}</h4>
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Endpoint: {integration.endpoint}</p>
                              <p>Authentication: {integration.authentication}</p>
                              <p>Last Sync: {formatTimeAgo(integration.lastSync)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {integration.status === 'Connected' ? (
                              <>
                                <Button size="sm" variant="outline">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Test
                                </Button>
                                <Button size="sm" variant="outline">
                                  Configure
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" className="trust-blue-bg hover:bg-[#2570E8] text-white">
                                Setup
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-4">Add New Integration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Database className="w-6 h-6" />
                      <span>Database Connection</span>
                    </Button>
                    
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Mail className="w-6 h-6" />
                      <span>Email Service</span>
                    </Button>
                    
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Bell className="w-6 h-6" />
                      <span>Alert System</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Administrative Users</CardTitle>
                    <CardDescription>Manage admin accounts and permissions</CardDescription>
                  </div>
                  <Button className="trust-blue-bg hover:bg-[#2570E8] text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Add Admin User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((user) => (
                    <Card key={user.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{user.name}</h4>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              {user.mfaEnabled && (
                                <Badge variant="outline" className="text-green-700 border-green-300">
                                  <Shield className="w-3 h-3 mr-1" />
                                  MFA
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Email: {user.email}</p>
                              <p>Role: {user.role}</p>
                              <p>Last Login: {formatTimeAgo(user.lastLogin)}</p>
                              <div className="flex gap-1 mt-2">
                                {user.permissions.map((permission, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            {!user.mfaEnabled && (
                              <Button size="sm" variant="outline" className="text-orange-600">
                                <Lock className="w-4 h-4 mr-1" />
                                Enable MFA
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset Settings */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Reset All Settings</h3>
                <p className="text-sm text-red-700">
                  This will reset all administrative settings to their default values. This action cannot be undone.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={resetSettings}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">System Status: Operational</span>
                </div>
                <div className="text-sm text-gray-600">
                  Last Updated: {new Date().toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh Status
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}