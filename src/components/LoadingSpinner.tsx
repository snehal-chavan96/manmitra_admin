import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );
}

export function LoadingCard({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`admin-card p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 admin-pale-gray-bg rounded"></div>
          <div className="h-4 admin-pale-gray-bg rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-6 admin-pale-gray-bg rounded w-1/2"></div>
          <div className="h-4 admin-pale-gray-bg rounded w-3/4"></div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 p-3 admin-pale-gray-bg rounded">
          <div className="w-8 h-8 admin-light-gray-bg rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 admin-light-gray-bg rounded w-3/4"></div>
            <div className="h-3 admin-light-gray-bg rounded w-1/2"></div>
          </div>
          <div className="w-16 h-6 admin-light-gray-bg rounded"></div>
        </div>
      ))}
    </div>
  );
}