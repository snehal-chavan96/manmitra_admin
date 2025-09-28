import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="admin-card shadow-lg border border-gray-200">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 admin-dark-gray-bg rounded-xl mb-4 mx-auto">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-admin-subheader text-gray-900">
                  Application Error
                </CardTitle>
                <CardDescription className="text-admin-body text-gray-600">
                  The ManMitra dashboard encountered an unexpected error
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="admin-pale-gray-bg p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Don't worry - your data is safe. This appears to be a temporary issue.
                  </p>
                  {this.state.error && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer hover:text-gray-800">Technical Details</summary>
                      <pre className="mt-2 p-2 admin-pale-gray-bg rounded text-xs overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full admin-black-bg hover:bg-gray-800 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/admins'} 
                    className="w-full border-gray-300"
                  >
                    Return to Login
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    ManMitra - Mental Health Analytics Platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;