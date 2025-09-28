import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AlertCircle, CheckCircle, Clock, Database, Activity, BarChart3 } from 'lucide-react';
import SystemStatusManager, { SystemStatus } from '../utils/systemStatus';

export default function SystemStatusIndicator() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const statusManager = SystemStatusManager.getInstance();
    
    // Get initial status
    setStatus(statusManager.getStatus());
    
    // Subscribe to status updates
    const unsubscribe = statusManager.subscribe(setStatus);
    
    // Start periodic health checks
    statusManager.startPeriodicChecks();
    
    return unsubscribe;
  }, []);

  if (!status) return null;

  const getOverallStatus = () => {
    if (status.backend === 'online' && status.database === 'online' && status.analytics === 'online') {
      return 'online';
    }
    if (status.backend === 'checking' || status.database === 'checking' || status.analytics === 'checking') {
      return 'checking';
    }
    return 'offline';
  };

  const overallStatus = getOverallStatus();
  const isDemo = localStorage.getItem('demo_mode') === 'true';

  const getStatusIcon = (componentStatus: string) => {
    switch (componentStatus) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'checking': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'online': return 'success-green-bg text-white';
      case 'checking': return 'warning-amber-bg text-white';
      case 'offline': return 'crisis-red-bg text-white';
      default: return 'admin-medium-gray-bg text-white';  
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 border-gray-300 hover:border-gray-400 ${overallStatus === 'online' ? 'status-online' : ''}`}
        >
          <div className={`w-2 h-2 rounded-full ${
            overallStatus === 'online' ? 'success-green-bg' : 
            overallStatus === 'checking' ? 'warning-amber-bg' :
            'crisis-red-bg'
          }`}></div>
          <span className="text-sm">
            {overallStatus === 'online' ? 'System Online' :
             overallStatus === 'checking' ? 'Checking...' :
             'System Issues'}
          </span>
          {isDemo && (
            <Badge variant="secondary" className="text-xs admin-dark-gray-bg text-white ml-1">
              Demo
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">System Status</h3>
            <Badge className={`text-xs ${getStatusColor()}`}>
              {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span>Backend Services</span>
              </div>
              {getStatusIcon(status.backend)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span>Database</span>
              </div>
              {getStatusIcon(status.database)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span>Analytics Engine</span>
              </div>
              {getStatusIcon(status.analytics)}
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Last checked:</span>
              <span>{status.lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>
          
          {isDemo && (
            <div className="pt-3 border-t border-gray-200">
              <div className="admin-pale-gray-bg p-3 rounded text-xs">
                <p className="font-medium text-gray-900 mb-1">Demo Mode</p>
                <p className="text-gray-700">
                  All systems are simulated for demonstration purposes.
                </p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}