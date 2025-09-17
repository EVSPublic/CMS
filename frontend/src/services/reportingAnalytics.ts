import { api, ApiResponse } from './api';

// Request interfaces
export interface UsageReportRequest {
  startDate: string;
  endDate: string;
  stationId?: string;
  brandCode?: string;
  userId?: string;
  reportType?: string; // summary, detailed, hourly, daily, weekly, monthly
  exportFormat?: string; // json, csv, pdf
}

export interface RevenueAnalyticsRequest {
  startDate: string;
  endDate: string;
  stationId?: string;
  brandCode?: string;
  groupBy?: string; // hour, day, week, month, station, brand
}

export interface StationPerformanceRequest {
  startDate: string;
  endDate: string;
  stationId?: string;
  brandCode?: string;
}

export interface DashboardAnalyticsRequest {
  startDate: string;
  endDate: string;
  brandCode?: string;
}

export interface ExportReportRequest {
  reportType: string; // usage, revenue, performance, dashboard
  format: string; // csv, pdf, excel
  startDate: string;
  endDate: string;
  filters?: Record<string, any>;
}

// Response interfaces
export interface UsageReportDto {
  reportId: string;
  reportType: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  totalEnergyConsumed: number;
  totalDuration: string;
  totalRevenue: number;
  averageSessionDuration: string;
  averageEnergyPerSession: number;
  averageRevenuePerSession: number;
  stationBreakdown: StationUsageBreakdown[];
  brandBreakdown: BrandUsageBreakdown[];
  timeSeriesData: UsageTimeSeriesData[];
  filters: Record<string, any>;
  generatedAt: string;
}

export interface StationUsageBreakdown {
  stationId: string;
  stationName: string;
  location: string;
  sessionCount: number;
  energyConsumed: number;
  revenue: number;
  utilizationRate: number;
}

export interface BrandUsageBreakdown {
  brandCode: string;
  sessionCount: number;
  energyConsumed: number;
  revenue: number;
  utilizationRate: number;
}

export interface UsageTimeSeriesData {
  timestamp: string;
  sessionCount: number;
  energyConsumed: number;
  revenue: number;
}

export interface UsageReportSummaryDto {
  totalStations: number;
  activeStations: number;
  totalChargers: number;
  availableChargers: number;
  totalUsers: number;
  activeUsers: number;
  topPerformingStations: StationUsageBreakdown[];
  brandPerformance: BrandUsageBreakdown[];
  trendsComparison: TrendsComparisonData;
}

export interface TrendsComparisonData {
  currentPeriod: PeriodData;
  previousPeriod: PeriodData;
  growthPercentage: number;
}

export interface PeriodData {
  sessions: number;
  energy: number;
  revenue: number;
  users: number;
}

export interface RevenueAnalyticsDto {
  totalRevenue: number;
  averageRevenuePerSession: number;
  revenueGrowth: number;
  topRevenueStations: RevenueStationData[];
  topRevenueBrands: RevenueBrandData[];
  revenueTimeSeries: RevenueTimeSeriesData[];
}

export interface RevenueStationData {
  stationId: string;
  stationName: string;
  location: string;
  revenue: number;
  sessionCount: number;
  averagePerSession: number;
}

export interface RevenueBrandData {
  brandCode: string;
  revenue: number;
  sessionCount: number;
  marketShare: number;
}

export interface RevenueTimeSeriesData {
  timestamp: string;
  revenue: number;
  sessionCount: number;
}

export interface RevenueAnalyticsDataPointDto {
  timestamp: string;
  revenue: number;
  sessionCount: number;
  averagePerSession: number;
}

export interface RevenueAnalyticsByBrandDto {
  brandCode: string;
  brandName: string;
  revenue: number;
  sessionCount: number;
  marketShare: number;
  growth: number;
}

export interface RevenueAnalyticsByStationDto {
  stationId: string;
  stationName: string;
  location: string;
  revenue: number;
  sessionCount: number;
  averagePerSession: number;
  ranking: number;
}

export interface StationPerformanceDto {
  stationId: string;
  stationName: string;
  location: string;
  status: string;
  totalChargers: number;
  availableChargers: number;
  activeChargers: number;
  maintenanceChargers: number;
  offlineChargers: number;
  utilizationRate: number;
  uptimePercentage: number;
  totalSessions: number;
  totalEnergyConsumed: number;
  totalRevenue: number;
  averageSessionDuration: string;
  peakUsageHours: string[];
  maintenanceAlerts: number;
  performanceScore: number;
  ranking: number;
}

export interface StationPerformanceMetricDto {
  stationId: string;
  stationName: string;
  location: string;
  status: string;
  totalChargers: number;
  availableChargers: number;
  activeChargers: number;
  maintenanceChargers: number;
  offlineChargers: number;
  utilizationRate: number;
  uptimePercentage: number;
  totalSessions: number;
  totalEnergyConsumed: number;
  totalRevenue: number;
  averageSessionDuration: string;
  peakUsageHours: string[];
  maintenanceAlerts: number;
  performanceScore: number;
  ranking: number;
  activeSessions: number;
  recentActivity: Record<string, any>;
}

export interface StationPerformanceOverallDto {
  totalStations: number;
  averageUtilization: number;
  averageUptime: number;
  topPerformers: StationPerformanceMetricDto[];
  poorPerformers: StationPerformanceMetricDto[];
  utilizationTrends: PerformanceTrendData[];
  uptimeTrends: PerformanceTrendData[];
  maintenanceSchedule: MaintenanceScheduleItem[];
}

export interface PerformanceTrendData {
  date: string;
  value: number;
}

export interface MaintenanceScheduleItem {
  stationId: string;
  stationName: string;
  scheduledDate: string;
  maintenanceType: string;
  priority: string;
}

export interface DashboardAnalyticsDto {
  overview: DashboardOverviewData;
  kpis: DashboardKpiDto;
  trends: DashboardTrendsDto;
  charts: DashboardChartDataDto[];
  alerts: DashboardAlertsDto;
}

export interface DashboardOverviewData {
  totalStations: number;
  activeStations: number;
  totalSessions: number;
  activeSessions: number;
  totalRevenue: number;
  totalEnergyConsumed: number;
}

export interface DashboardKpiDto {
  utilizationRate: number;
  averageSessionDuration: string;
  revenueGrowth: number;
  userGrowth: number;
  sessionGrowth: number;
  energyEfficiency: number;
}

export interface DashboardTrendsDto {
  sessionTrends: TrendDataPoint[];
  revenueTrends: TrendDataPoint[];
  utilizationTrends: TrendDataPoint[];
  userTrends: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface DashboardChartDataDto {
  chartId: string;
  chartType: string; // line, bar, pie, donut
  title: string;
  data: ChartDataPoint[];
  metadata: Record<string, any>;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DashboardAlertsDto {
  criticalAlerts: AlertDto[];
  warningAlerts: AlertDto[];
  infoAlerts: AlertDto[];
  totalCount: number;
}

export interface AlertDto {
  id: string;
  type: string; // critical, warning, info
  title: string;
  message: string;
  stationId?: string;
  stationName?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
}

export interface ExportReportDto {
  reportId: string;
  fileName: string;
  format: string;
  size: number;
  downloadUrl: string;
  status: string; // pending, processing, completed, failed
  createdAt: string;
  expiresAt: string;
}

// Service class
class ReportingAnalyticsService {
  private baseUrl = '/api/ReportingAnalytics';

  // Usage Reports
  async getUsageReport(request: UsageReportRequest): Promise<ApiResponse<UsageReportDto>> {
    return api.post(`${this.baseUrl}/usage/report`, request);
  }

  async getUsageReportSummary(request: UsageReportRequest): Promise<ApiResponse<UsageReportSummaryDto>> {
    return api.post(`${this.baseUrl}/usage/summary`, request);
  }

  // Revenue Analytics
  async getRevenueAnalytics(request: RevenueAnalyticsRequest): Promise<ApiResponse<RevenueAnalyticsDto>> {
    return api.post(`${this.baseUrl}/revenue/analytics`, request);
  }

  async getRevenueTimeSeries(request: RevenueAnalyticsRequest): Promise<ApiResponse<RevenueAnalyticsDataPointDto[]>> {
    return api.post(`${this.baseUrl}/revenue/time-series`, request);
  }

  async getRevenueByBrand(request: RevenueAnalyticsRequest): Promise<ApiResponse<RevenueAnalyticsByBrandDto[]>> {
    return api.post(`${this.baseUrl}/revenue/by-brand`, request);
  }

  async getRevenueByStation(request: RevenueAnalyticsRequest): Promise<ApiResponse<RevenueAnalyticsByStationDto[]>> {
    return api.post(`${this.baseUrl}/revenue/by-station`, request);
  }

  // Station Performance
  async getStationPerformance(request: StationPerformanceRequest): Promise<ApiResponse<StationPerformanceDto>> {
    return api.post(`${this.baseUrl}/station/performance`, request);
  }

  async getStationPerformanceMetrics(request: StationPerformanceRequest): Promise<ApiResponse<StationPerformanceMetricDto[]>> {
    return api.post(`${this.baseUrl}/station/performance/metrics`, request);
  }

  async getStationPerformanceOverall(request: StationPerformanceRequest): Promise<ApiResponse<StationPerformanceOverallDto>> {
    return api.post(`${this.baseUrl}/station/performance/overall`, request);
  }

  // Dashboard Analytics
  async getDashboardAnalytics(request: DashboardAnalyticsRequest): Promise<ApiResponse<DashboardAnalyticsDto>> {
    return api.post(`${this.baseUrl}/dashboard/analytics`, request);
  }

  async getDashboardKpis(request: DashboardAnalyticsRequest): Promise<ApiResponse<DashboardKpiDto>> {
    return api.post(`${this.baseUrl}/dashboard/kpis`, request);
  }

  async getDashboardTrends(request: DashboardAnalyticsRequest): Promise<ApiResponse<DashboardTrendsDto>> {
    return api.post(`${this.baseUrl}/dashboard/trends`, request);
  }

  async getDashboardCharts(request: DashboardAnalyticsRequest): Promise<ApiResponse<DashboardChartDataDto[]>> {
    return api.post(`${this.baseUrl}/dashboard/charts`, request);
  }

  async getDashboardAlerts(): Promise<ApiResponse<DashboardAlertsDto>> {
    return api.get(`${this.baseUrl}/dashboard/alerts`);
  }

  // Export Reports
  async generateExportReport(request: ExportReportRequest): Promise<ApiResponse<ExportReportDto>> {
    return api.post(`${this.baseUrl}/export/generate`, request);
  }

  async getExportReportStatus(reportId: string): Promise<ApiResponse<ExportReportDto>> {
    return api.get(`${this.baseUrl}/export/status/${reportId}`);
  }

  async downloadExportReport(reportId: string): Promise<void> {
    const response = await fetch(`/api/ReportingAnalytics/export/download/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  async getExportReportHistory(): Promise<ApiResponse<ExportReportDto[]>> {
    return api.get(`${this.baseUrl}/export/history`);
  }

  // System Health & Alerts
  async getSystemHealthMetrics(): Promise<ApiResponse<Record<string, any>>> {
    return api.get(`${this.baseUrl}/system/health`);
  }

  async getActiveAlerts(): Promise<ApiResponse<AlertDto[]>> {
    return api.get(`${this.baseUrl}/alerts/active`);
  }

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<boolean>> {
    return api.post(`${this.baseUrl}/alerts/${alertId}/acknowledge`);
  }

  // Comparative Analysis
  async getComparativePeriodAnalysis(
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ): Promise<ApiResponse<Record<string, number>>> {
    return api.post(`${this.baseUrl}/analysis/comparative`, {
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    });
  }
}

export const reportingAnalyticsService = new ReportingAnalyticsService();
export default reportingAnalyticsService;