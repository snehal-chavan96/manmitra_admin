import { apiFetch } from '../api/client';

export interface SystemStatus {
  backend: 'online' | 'offline' | 'checking';
  database: 'online' | 'offline' | 'checking';
  analytics: 'online' | 'offline' | 'checking';
  lastChecked: Date;
}

export class SystemStatusManager {
  private static instance: SystemStatusManager;
  private status: SystemStatus = {
    backend: 'checking',
    database: 'checking', 
    analytics: 'checking',
    lastChecked: new Date()
  };
  private listeners: ((status: SystemStatus) => void)[] = [];

  static getInstance(): SystemStatusManager {
    if (!SystemStatusManager.instance) {
      SystemStatusManager.instance = new SystemStatusManager();
    }
    return SystemStatusManager.instance;
  }

  async checkSystemHealth(): Promise<SystemStatus> {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemo) {
      this.status = {
        backend: 'online',
        database: 'online', 
        analytics: 'online',
        lastChecked: new Date()
      };
    } else {
      // Check backend health
      try {
        // Call Node backend health endpoint
        await apiFetch('/api/health');
        this.status.backend = 'online';
        this.status.database = 'online';
        this.status.analytics = 'online';
      } catch (error) {
        console.warn('System health check failed:', error);
        this.status.backend = 'offline';
        this.status.database = 'offline';
        this.status.analytics = 'offline';
      }
    }
    
    this.status.lastChecked = new Date();
    this.notifyListeners();
    return this.status;
  }

  getStatus(): SystemStatus {
    return { ...this.status };
  }

  subscribe(callback: (status: SystemStatus) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  startPeriodicChecks(intervalMs: number = 30000) {
    // Initial check
    this.checkSystemHealth();
    
    // Periodic checks (only if not in demo mode)
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (!isDemo) {
      setInterval(() => {
        this.checkSystemHealth();
      }, intervalMs);
    }
  }
}

export default SystemStatusManager;