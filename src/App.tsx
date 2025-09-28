import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CrisisManagement from './components/CrisisManagement';
import UserManagement from './components/UserManagement';
import CounselorManagement from './components/CounselorManagement';
import VolunteerManagement from './components/VolunteerManagement';
import Analytics from './components/Analytics';
import CounselorAnalytics from './components/CounselorAnalytics';
import StudentAnalytics from './components/StudentAnalytics';
import Reports from './components/Reports';
import AdminSettings from './components/AdminSettings';
import AdminProfile from './components/AdminProfile';
import PendingRequests from './components/PendingRequests';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { Shield } from 'lucide-react';
import { adminLogin, getAdminMe } from './api/admin';
import type { AdminProfile as AdminProfileType } from './api/admin';

// Enhanced authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state from persisted token (Portal-first)
    const checkSession = () => {
      try {
        const token = localStorage.getItem('mm_admin_token') || localStorage.getItem('token');
        if (token) {
          // Fetch real admin profile from backend
          (async () => {
            try {
              const profile: AdminProfileType = await getAdminMe();
              setUser(profile);
              setIsAuthenticated(true);
            } catch (e) {
              // Do NOT clear tokens on first failure; backend might be starting up or CORS may transiently fail.
              // Keeping the token allows ProtectedRoute to proceed while hydration retries later.
              console.error('Failed to fetch admin profile (will retain token):', e);
              setIsAuthenticated(false);
              setUser(null);
            } finally {
              setLoading(false);
            }
          })();
          return; // early return; we'll set loading in finally above
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Keep tokens if present; just proceed to show fallback UI
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting admin login for:', email);
      await adminLogin(email, password); // stores token internally
      setIsAuthenticated(true);
      setUser({ role: 'admin', email });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      console.log('Logging out...');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Enhanced loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* ManMitra Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 admin-black-bg rounded-xl mb-6 shadow-xl admin-fade-in">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          {/* Loading Text */}
          <h2 className="text-admin-subheader text-gray-900 mb-3 admin-slide-in">ManMitra Analytics</h2>
          <p className="text-gray-600 mb-6 admin-slide-in">Initializing secure dashboard...</p>
          
          {/* Enhanced Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden admin-slide-in">
            <div className="admin-dark-gray-bg h-2 rounded-full animate-pulse transition-all duration-1000" style={{width: '75%'}}></div>
          </div>
          
          {/* Loading Spinner */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          <p className="text-xs text-gray-500">
            Loading anonymous analytics and institutional insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) return <>{children}</>;

  // Not authenticated: auto-redirect logic
  try {
    // First, capture token from URL hash if present (to avoid bounce back to Portal)
    const hash = window.location.hash || '';
    const hashMatch = hash.match(/[#&]token=([^&]+)/);
    const hashToken = hashMatch ? decodeURIComponent(hashMatch[1]) : null;
    if (hashToken) {
      try {
        localStorage.setItem('mm_admin_token', hashToken);
        localStorage.setItem('token', hashToken);
      } catch {}
      // Clean URL and go to dashboard
      const { protocol, host, pathname } = window.location;
      window.history.replaceState({}, document.title, `${protocol}//${host}${pathname}`);
      // Permit access to protected children immediately; hydration will follow
      return <>{children}</>;
    }

    const token = localStorage.getItem('mm_admin_token') || localStorage.getItem('token');
    if (token) {
      // Token present but auth not hydrated yet: permit access without redirect
      return <>{children}</>;
    }
  } catch {}

  // No token: show the /admins entry page instead of auto-redirecting away
  return <Navigate to="/admins" replace />;
}

function AdminsEntryRedirect() {
  const { isAuthenticated, loading } = useAuth();

  // After hydration, handle token capture and navigation
  useEffect(() => {
    if (loading) return; // wait for AuthProvider hydration
    try {
      const hash = window.location.hash || '';
      const hashMatch = hash.match(/[#&]token=([^&]+)/);
      const hashToken = hashMatch ? decodeURIComponent(hashMatch[1]) : null;

      if (hashToken) {
        try {
          localStorage.setItem('mm_admin_token', hashToken);
          localStorage.setItem('token', hashToken);
        } catch {}
        // Clean URL and navigate to dashboard
        const { protocol, host, pathname } = window.location;
        window.history.replaceState({}, document.title, `${protocol}//${host}${pathname}`);
        window.location.replace('/admins/dashboard');
        return;
      }

      const token = localStorage.getItem('mm_admin_token') || localStorage.getItem('token');
      if (token) {
        // Token exists even if isAuthenticated hasn't hydrated yet; go to dashboard
        window.location.replace('/admins/dashboard');
        return;
      }
    } catch {
      // ignore
    }
  }, [loading, isAuthenticated]);

  // While loading, show spinner (do not show fallback yet)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admins/dashboard" replace />;
  }

  // Fallback UI (only if no token + not authenticated)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Admin access requires Portal login</h2>
        <p className="text-gray-600 mb-4">Please authenticate via the ManMitra Portal. You will return here with secure access.</p>
        <button
          onClick={() => window.location.assign('http://localhost:3002')}
          className="px-6 py-3 rounded-md bg-black text-white"
        >
          Go to Portal (3002)
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Handle any preview_page.html requests by redirecting
  useEffect(() => {
    if (window.location.pathname === '/preview_page.html') {
      window.location.replace('/admins');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<AdminsEntryRedirect />} />
              <Route path="/preview_page.html" element={<AdminsEntryRedirect />} />
              <Route
                path="/admins"
                element={<AdminsEntryRedirect />}
              />
              <Route
                path="/admins/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/crisis"
                element={
                  <ProtectedRoute>
                    <CrisisManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/users"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/users/counselors"
                element={
                  <ProtectedRoute>
                    <CounselorManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/users/volunteers"
                element={
                  <ProtectedRoute>
                    <VolunteerManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/users/pending"
                element={
                  <ProtectedRoute>
                    <PendingRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/analytics/counselors"
                element={
                  <ProtectedRoute>
                    <CounselorAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/analytics/students"
                element={
                  <ProtectedRoute>
                    <StudentAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admins/profile"
                element={
                  <ProtectedRoute>
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all route for any unmatched paths */}
              <Route path="*" element={<Navigate to="/admins" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}