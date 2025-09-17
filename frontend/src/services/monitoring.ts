import { api, ApiResponse } from './api';

export interface SystemHealthSummary {
  totalStations: number;
  onlineStations: number;
  offlineStations: number;
  maintenanceStations: number;
  totalChargers: number;
  availableChargers: number;
  occupiedChargers: number;
  offlineChargers: number;
  systemUptimePercentage: number;
  criticalAlerts: string[];
  lastUpdated: string;
}

export interface StationHealthReport {
  stationId: string;
  stationName: string;
  status: string;
  lastHeartbeat: string;
  isOnline: boolean;
  chargerHealths: ChargerHealth[];
  systemMetrics: Record<string, any>;
  alerts: string[];
}

export interface ChargerHealth {
  chargerId: string;
  status: string;
  temperature: number;
  voltage: number;
  current: number;
  lastStatusUpdate: string;
  errors: string[];
  requiresMaintenance: boolean;
}

export interface StationHeartbeat {
  timestamp: string;
  status: string;
  chargerStatuses: Record<string, ChargerStatus>;
  systemMetrics: Record<string, any>;
}

export interface ChargerStatus {
  status: string;
  temperature: number;
  voltage: number;
  current: number;
  errors: string[];
}

export interface StationStatusMetrics {
  stationId: string;
  fromDate: string;
  toDate: string;
  uptimePercentage: number;
  totalSessions: number;
  averageSessionDuration: number;
  totalEnergyDispensed: number;
  maintenanceEvents: number;
  outages: OutageEvent[];
}

export interface OutageEvent {
  startTime: string;
  endTime?: string;
  duration: string;
  reason: string;
  affectedChargers: string[];
}

class MonitoringService {
  async getSystemHealth(): Promise<ApiResponse<SystemHealthSummary>> {
    return api.get<SystemHealthSummary>('/api/admin/v1/monitoring/system/health');
  }

  async getAllStationsHealth(): Promise<ApiResponse<StationHealthReport[]>> {
    return api.get<StationHealthReport[]>('/api/admin/v1/monitoring/stations/health');
  }

  async getStationHealth(stationId: string): Promise<ApiResponse<StationHealthReport>> {
    return api.get<StationHealthReport>(`/api/admin/v1/monitoring/stations/${stationId}/health`);
  }

  async updateStationHeartbeat(stationId: string, heartbeat: StationHeartbeat): Promise<ApiResponse<void>> {
    return api.post<void>(`/api/admin/v1/monitoring/stations/${stationId}/heartbeat`, heartbeat);
  }

  async getOfflineStations(thresholdMinutes: number = 5): Promise<ApiResponse<any[]>> {
    return api.get<any[]>(`/api/admin/v1/monitoring/stations/offline?thresholdMinutes=${thresholdMinutes}`);
  }

  async getStationsRequiringMaintenance(): Promise<ApiResponse<any[]>> {
    return api.get<any[]>('/api/admin/v1/monitoring/stations/maintenance');
  }

  async getStationMetrics(
    stationId: string, 
    fromDate?: string, 
    toDate?: string
  ): Promise<ApiResponse<StationStatusMetrics>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const endpoint = `/api/admin/v1/monitoring/stations/${stationId}/metrics${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<StationStatusMetrics>(endpoint);
  }
}

export const monitoringService = new MonitoringService();