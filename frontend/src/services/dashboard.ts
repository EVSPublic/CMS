import { api, ApiResponse } from './api';

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export interface ServerResourceUsage {
  cpu: number;
  memory: number;
}

export interface RecentActivity {
  user: string;
  action: string;
  timestamp: string;
}

export interface ContentCounts {
  announcements: number;
  partners: number;
  staticPages: number;
  products: number;
  brandId: number;
}

export interface DashboardStats {
  mediaUploadsCount: number;
  activeUserSessions: number;
  serverResourceUsage: ServerResourceUsage;
  contentCounts: ContentCounts;
  recentActivity: RecentActivity[];
  systemHealth: HealthStatus;
}

class DashboardService {
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    return api.get<HealthStatus>('/api/health');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // Get the selected brand from localStorage
    const userStr = localStorage.getItem('user');
    let brandId = 1; // Default to Ovolt

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        brandId = user.brandId || 1;
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    const healthResponse = await this.getHealthStatus();
    const statsResponse = await api.get<any>(`/api/Dashboard/stats?brandId=${brandId}`);

    if (healthResponse.ok && healthResponse.data && statsResponse.ok && statsResponse.data) {
      return {
        ok: true,
        data: {
          ...statsResponse.data,
          systemHealth: healthResponse.data,
        },
      };
    }

    // Handle errors if one of the calls fails
    if (!healthResponse.ok) {
      return { ok: false, error: healthResponse.error };
    }
    if (!statsResponse.ok) {
        return { ok: false, error: statsResponse.error };
    }

    return { ok: false, error: { code: 'UNKNOWN_ERROR', message: 'Failed to fetch dashboard data' } };
  }
}

export const dashboardService = new DashboardService();
