import { api, ApiResponse } from './api';

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export interface DashboardStats {
  totalUsers?: number;
  totalAnnouncements?: number;
  totalBrands?: number;
  systemHealth: HealthStatus;
}

class DashboardService {
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    return api.get<HealthStatus>('/api/health');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get<HealthStatus>('/api/health');

    if (response.ok && response.data) {
      // Transform the health response into dashboard stats format
      return {
        ok: true,
        data: {
          systemHealth: response.data
        }
      };
    }

    return response as unknown as ApiResponse<DashboardStats>;
  }
}

export const dashboardService = new DashboardService();