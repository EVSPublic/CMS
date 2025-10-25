import { LogEntry, LogsResponse, LogAction } from '../types/log';
import { api } from './api';

// Logger utility for development
const logger = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[LogService] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[LogService] ${message}`, error);
    }
  },
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[LogService] ${message}`, data);
    }
  }
};

class LogService {
  async log(action: LogAction, details: string, options: {
    level?: 'info' | 'warning' | 'error' | 'success';
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, any>;
  } = {}): Promise<void> {
    try {
      const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
      const brandId = selectedBrand === 'Ovolt' ? 1 : 2;

      const logData = {
        action,
        details,
        resourceType: options.resourceType,
        resourceId: options.resourceId,
        brandId,
        brandName: selectedBrand,
        level: options.level || 'info',
        metadata: options.metadata ? JSON.stringify(options.metadata) : undefined
      };

      await api.post('/api/v1/logs', logData);
    } catch (error) {
      logger.error('Error logging activity:', error);
      // Silently fail - don't break the user experience if logging fails
    }
  }

  async getRecentLogs(limit: number = 5): Promise<LogEntry[]> {
    try {
      const response = await api.get<LogEntry[]>(`/api/v1/logs/recent?limit=${limit}`);
      if (response.ok && response.data) {
        return response.data.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
      return [];
    } catch (error) {
      logger.error('Error fetching recent logs:', error);
      return [];
    }
  }

  async getLogs(page: number = 1, limit: number = 20, filter?: {
    action?: string;
    level?: string;
    brandId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<LogsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (filter) {
        if (filter.action) params.append('action', filter.action);
        if (filter.level) params.append('level', filter.level);
        if (filter.brandId) params.append('brandId', filter.brandId.toString());
        if (filter.startDate) params.append('startDate', filter.startDate.toISOString());
        if (filter.endDate) params.append('endDate', filter.endDate.toISOString());
      }

      const response = await api.get<{
        logs: LogEntry[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/api/v1/logs?${params.toString()}`);

      if (response.ok && response.data) {
        return {
          logs: response.data.logs.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp)
          })),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        };
      }

      return {
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    } catch (error) {
      logger.error('Error fetching logs:', error);
      return {
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await api.delete('/api/v1/logs');
    } catch (error) {
      logger.error('Error clearing logs:', error);
      throw error;
    }
  }

  // Convenience methods for common actions
  async logUserAction(action: LogAction, details: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): Promise<void> {
    return this.log(action, details, { level });
  }

  async logContentAction(action: LogAction, details: string, pageType?: string, pageId?: string): Promise<void> {
    return this.log(action, details, {
      level: 'success',
      resourceType: 'content_page',
      resourceId: pageId,
      metadata: { pageType }
    });
  }

  async logImageAction(action: LogAction, details: string, imagePath?: string): Promise<void> {
    return this.log(action, details, {
      level: 'info',
      resourceType: 'image',
      resourceId: imagePath,
      metadata: { imagePath }
    });
  }
}

export const logService = new LogService();