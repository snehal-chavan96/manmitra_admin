import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  UserCheck, 
  Heart, 
  BarChart3, 
  FileText, 
  Settings, 
  User,
  LogOut,
  Clock,
  Bell
} from 'lucide-react';
import SystemStatusIndicator from './SystemStatusIndicator';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { path: '/admins/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admins/crisis', icon: AlertTriangle, label: 'Crisis Management' },
    { path: '/admins/users', icon: Users, label: 'User Management' },
    { path: '/admins/users/counselors', icon: UserCheck, label: 'Counselors', indent: true },
    { path: '/admins/users/volunteers', icon: Heart, label: 'Volunteers', indent: true },
    { path: '/admins/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admins/reports', icon: FileText, label: 'Reports' },
    { path: '/admins/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admins');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path === '/admins/users' && location.pathname.startsWith('/admins/users'));
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 admin-black-bg rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ManMitra</h1>
              <p className="text-sm text-gray-600">Analytics Dashboard</p>
            </div>
          </div>
          
          {/* Institution Info */}
          <div className="admin-pale-gray-bg border border-gray-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">{user?.institution || 'Educational Institution'}</p>
              {localStorage.getItem('demo_mode') === 'true' && (
                <Badge variant="outline" className="text-xs admin-medium-gray-bg text-white">Demo</Badge>
              )}
            </div>
            <p className="text-xs text-gray-600">Mental Health Analytics</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${
                    item.indent ? 'ml-4' : ''
                  } ${isActive ? 'bg-gray-100 text-gray-900 border-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-600'}`} />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <Card className="p-3 mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Session: 2h 45m</span>
            </div>
          </Card>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-gray-600 hover:text-red-600 hover:border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-admin-header text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Status & Alerts */}
              <div className="flex items-center gap-3">
                <SystemStatusIndicator />
                
                {/* Crisis Alert Indicator */}
                <Button variant="outline" size="sm" className="gap-2 border-gray-300 hover:border-red-300">
                  <Bell className="w-4 h-4" />
                  <Badge variant="destructive" className="text-xs crisis-red-bg text-white">2</Badge>
                </Button>
              </div>
              
              {/* Current Time */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}