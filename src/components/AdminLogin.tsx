import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, CheckCircle, User, Lock } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting login form...');
      const success = await login(email, password);
      if (success) {
        console.log('Login successful, navigating to dashboard...');
        navigate('/admins/dashboard');
      } else {
        setError('Invalid Admin ID or password. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50">
      <div className="w-full max-w-md">
        {/* ManMitra + Institution Branding */}
        <div className="text-center mb-8 admin-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 admin-black-bg rounded-xl mb-6 shadow-xl hover:shadow-2xl transition-all duration-300 admin-card-interactive">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-3 text-admin-header">ManMitra</h1>
          <p className="text-gray-600 text-lg font-medium">Educational Institution</p>
          <p className="text-gray-500 mt-2 text-sm">Analytics Dashboard Portal</p>
        </div>

        <Card className="admin-card shadow-xl border border-gray-200 admin-slide-in hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-admin-subheader text-gray-900">Administrative Access</CardTitle>
            <CardDescription className="text-admin-body text-gray-600">
              Secure access to mental health analytics and institutional insights
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-admin-body">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@institution.edu"
                    className="pl-10 h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-admin-body">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 admin-black-bg hover:bg-gray-800 text-white transition-all duration-200 hover:shadow-lg"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </form>

            {/* Optional: Demo access note can be reintroduced if needed */}

            {/* Security Notice */}
            <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">Secure Authentication</p>
                  <p className="text-gray-700 mb-2">
                    This dashboard provides access to anonymized mental health analytics for institutional planning and intervention strategies.
                  </p>
                  <p className="text-xs text-gray-600">
                    All data is privacy-protected and FERPA compliant
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Protected by institutional-grade security protocols</p>
          <p className="mt-1">© 2024 ManMitra - Anonymous Mental Health Analytics</p>
        </div>
      </div>
    </div>
  );
}