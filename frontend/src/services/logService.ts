import { LogEntry, LogsResponse, LogAction } from '../types/log';

class LogService {
  private logs: LogEntry[] = [];
  private nextId = 1;

  private getStoredLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem('admin_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading logs from localStorage:', error);
    }
    return [];
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('admin_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs to localStorage:', error);
    }
  }

  constructor() {
    this.logs = this.getStoredLogs();
    if (this.logs.length > 0) {
      const maxId = Math.max(...this.logs.map(log => parseInt(log.id)));
      this.nextId = maxId + 1;
    } else {
      // Add some initial sample logs if none exist
      this.seedInitialLogs();
    }
  }

  private seedInitialLogs(): void {
    const sampleLogs: Omit<LogEntry, 'id'>[] = [
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        action: 'user_login',
        details: 'Kullanıcı admin@ovolt.com sisteme giriş yaptı',
        userId: '1',
        userName: 'Admin User',
        brandId: 1,
        brandName: 'Ovolt',
        level: 'success'
      },
      {
        timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
        action: 'content_save',
        details: 'Index sayfası içeriği güncellendi (Ovolt)',
        userId: '1',
        userName: 'Admin User',
        brandId: 1,
        brandName: 'Ovolt',
        level: 'success',
        resourceType: 'content_page',
        metadata: { pageType: 'Index' }
      },
      {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        action: 'image_upload',
        details: 'Hero video dosyası yüklendi: hero-video.mp4',
        userId: '1',
        userName: 'Admin User',
        brandId: 1,
        brandName: 'Ovolt',
        level: 'info',
        resourceType: 'image',
        metadata: { imagePath: 'assets/video/hero-video.mp4' }
      },
      {
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        action: 'content_publish',
        details: 'Index sayfası yayınlandı (Ovolt)',
        userId: '1',
        userName: 'Admin User',
        brandId: 1,
        brandName: 'Ovolt',
        level: 'success',
        resourceType: 'content_page',
        metadata: { pageType: 'Index' }
      },
      {
        timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
        action: 'brand_switch',
        details: 'Marka değiştirildi: Ovolt → Sharz.net',
        userId: '1',
        userName: 'Admin User',
        brandId: 2,
        brandName: 'Sharz.net',
        level: 'info'
      }
    ];

    sampleLogs.forEach(logData => {
      const logEntry: LogEntry = {
        ...logData,
        id: this.nextId.toString()
      };
      this.logs.unshift(logEntry);
      this.nextId++;
    });

    this.saveLogs();
  }

  log(action: LogAction, details: string, options: {
    level?: 'info' | 'warning' | 'error' | 'success';
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, any>;
  } = {}): void {
    const userId = localStorage.getItem('userId') || 'unknown';
    const userName = localStorage.getItem('userName') || 'Unknown User';
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    const brandId = selectedBrand === 'Ovolt' ? 1 : 2;

    const logEntry: LogEntry = {
      id: this.nextId.toString(),
      timestamp: new Date(),
      action,
      details,
      userId,
      userName,
      brandId,
      brandName: selectedBrand,
      level: options.level || 'info',
      resourceType: options.resourceType,
      resourceId: options.resourceId,
      metadata: options.metadata
    };

    this.logs.unshift(logEntry); // Add to beginning

    // Keep only last 1000 logs to prevent unlimited growth
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    this.saveLogs();
    this.nextId++;
  }

  getRecentLogs(limit: number = 5): LogEntry[] {
    return this.logs.slice(0, limit);
  }

  getLogs(page: number = 1, limit: number = 20, filter?: {
    action?: string;
    level?: string;
    brandId?: number;
    startDate?: Date;
    endDate?: Date;
  }): LogsResponse {
    let filteredLogs = [...this.logs];

    if (filter) {
      if (filter.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filter.action);
      }
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      if (filter.brandId) {
        filteredLogs = filteredLogs.filter(log => log.brandId === filter.brandId);
      }
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!);
      }
    }

    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const logs = filteredLogs.slice(startIndex, endIndex);

    return {
      logs,
      total,
      page,
      limit,
      totalPages
    };
  }

  clearLogs(): void {
    this.logs = [];
    this.nextId = 1;
    this.saveLogs();
  }

  // Convenience methods for common actions
  logUserAction(action: LogAction, details: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    this.log(action, details, { level });
  }

  logContentAction(action: LogAction, details: string, pageType?: string, pageId?: string): void {
    this.log(action, details, {
      level: 'success',
      resourceType: 'content_page',
      resourceId: pageId,
      metadata: { pageType }
    });
  }

  logImageAction(action: LogAction, details: string, imagePath?: string): void {
    this.log(action, details, {
      level: 'info',
      resourceType: 'image',
      resourceId: imagePath,
      metadata: { imagePath }
    });
  }
}

export const logService = new LogService();