import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, X, Eye, Database } from 'lucide-react';

export default function DemoNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const isDemo = localStorage.getItem('demo_mode') === 'true';

  if (!isDemo || !isVisible) return null;

  return (
    <Card className="admin-card border-l-4 border-l-gray-900 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 admin-dark-gray-bg rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-gray-900">Demo Mode Active</h3>
                <Badge variant="outline" className="text-xs admin-medium-gray-bg text-white">
                  Sample Data
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                You're viewing the ManMitra analytics dashboard with anonymized sample data. 
                All features are fully functional and demonstrate real-world capabilities.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Anonymous sample data</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>No real student information</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}