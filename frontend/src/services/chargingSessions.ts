import { api, ApiResponse } from './api';

export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  chargerId: string;
  chargerName: string;
  connectorType: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCardId?: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  energyConsumed?: number;
  totalCost?: number;
  status: string;
  failureReason?: string;
  brandCode?: string;
  maxChargingAmount?: number;
  maxChargingTime?: string;
  sessionData?: Record<string, any>;
  realtimeData?: ChargingSessionRealtime;
  createdAt: string;
  updatedAt: string;
}

export interface ChargingSessionRealtime {
  currentPower?: number;
  currentVoltage?: number;
  currentCurrent?: number;
  energyConsumedSoFar?: number;
  elapsedTime?: string;
  estimatedTimeRemaining?: number;
  status?: string;
  timestamp: string;
}

export interface ActiveSession {
  id: string;
  stationName: string;
  chargerName: string;
  userName: string;
  startTime: string;
  elapsedTime: string;
  energyConsumedSoFar?: number;
  currentPower?: number;
  status: string;
  brandCode?: string;
  estimatedTimeRemaining?: number;
}

export interface SessionHistory {
  id: string;
  stationName: string;
  chargerName: string;
  userName: string;
  startTime: string;
  endTime?: string;
  energyConsumed?: number;
  totalCost?: number;
  status: string;
  brandCode?: string;
}

export interface CreateChargingSessionRequest {
  stationId: string;
  chargerId: string;
  userId: string;
  userCardId?: string;
  startTime: string;
  maxChargingAmount?: number;
  maxChargingTime?: string;
  brandCode?: string;
}

export interface UpdateChargingSessionRequest {
  endTime?: string;
  energyConsumed?: number;
  totalCost?: number;
  status: string;
  failureReason?: string;
  sessionData?: Record<string, any>;
}

export interface ChargingSessionSearchRequest {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  stationId?: string;
  userId?: string;
  brandCode?: string;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SessionRealtimeUpdateRequest {
  sessionId: string;
  currentPower?: number;
  currentVoltage?: number;
  currentCurrent?: number;
  energyConsumedSoFar?: number;
  elapsedTime?: string;
  estimatedTimeRemaining?: number;
  status?: string;
  timestamp?: string;
}

export interface ChargingSessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  failedSessions: number;
  totalEnergyConsumed: number;
  totalRevenue: number;
  averageSessionDuration: number;
  averageEnergyPerSession: number;
  sessionsByStatus: Record<string, number>;
  sessionsByBrand: Record<string, number>;
  revenueByBrand: Record<string, number>;
}

class ChargingSessionsService {
  async getSessions(searchRequest: ChargingSessionSearchRequest = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.perPage) params.append('perPage', searchRequest.perPage.toString());
    if (searchRequest.search) params.append('search', searchRequest.search);
    if (searchRequest.status) params.append('status', searchRequest.status);
    if (searchRequest.stationId) params.append('stationId', searchRequest.stationId);
    if (searchRequest.userId) params.append('userId', searchRequest.userId);
    if (searchRequest.brandCode) params.append('brandCode', searchRequest.brandCode);
    if (searchRequest.startDateFrom) params.append('startDateFrom', searchRequest.startDateFrom);
    if (searchRequest.startDateTo) params.append('startDateTo', searchRequest.startDateTo);
    if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
    if (searchRequest.sortOrder) params.append('sortOrder', searchRequest.sortOrder);
    
    const endpoint = `/api/admin/v1/charging-sessions${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<ChargingSession[]>(endpoint);
  }

  async getSessionById(sessionId: string): Promise<ApiResponse<ChargingSession>> {
    return api.get<ChargingSession>(`/api/admin/v1/charging-sessions/${sessionId}`);
  }

  async createSession(request: CreateChargingSessionRequest): Promise<ApiResponse<ChargingSession>> {
    return api.post<ChargingSession>('/api/admin/v1/charging-sessions', request);
  }

  async updateSession(sessionId: string, request: UpdateChargingSessionRequest): Promise<ApiResponse<ChargingSession>> {
    return api.put<ChargingSession>(`/api/admin/v1/charging-sessions/${sessionId}`, request);
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<any>> {
    return api.delete(`/api/admin/v1/charging-sessions/${sessionId}`);
  }

  async getActiveSessions(): Promise<ApiResponse<ActiveSession[]>> {
    return api.get<ActiveSession[]>('/api/admin/v1/charging-sessions/active');
  }

  async getSessionStats(from?: string, to?: string): Promise<ApiResponse<ChargingSessionStats>> {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const endpoint = `/api/admin/v1/charging-sessions/stats${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<ChargingSessionStats>(endpoint);
  }

  async getSessionHistory(userId?: string, limit: number = 50): Promise<ApiResponse<SessionHistory[]>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('limit', limit.toString());
    
    const endpoint = `/api/admin/v1/charging-sessions/history?${params.toString()}`;
    return api.get<SessionHistory[]>(endpoint);
  }

  async updateRealtimeData(sessionId: string, request: Omit<SessionRealtimeUpdateRequest, 'sessionId'>): Promise<ApiResponse<any>> {
    return api.post(`/api/admin/v1/charging-sessions/${sessionId}/realtime`, {
      ...request,
      sessionId
    });
  }

  async getRealtimeData(sessionId: string): Promise<ApiResponse<ChargingSessionRealtime>> {
    return api.get<ChargingSessionRealtime>(`/api/admin/v1/charging-sessions/${sessionId}/realtime`);
  }

  async endSession(sessionId: string, request: UpdateChargingSessionRequest): Promise<ApiResponse<any>> {
    return api.post(`/api/admin/v1/charging-sessions/${sessionId}/end`, request);
  }

  async getSessionsByStation(stationId: string, page: number = 1, perPage: number = 20, status?: string): Promise<ApiResponse<ChargingSession[]>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('perPage', perPage.toString());
    if (status) params.append('status', status);
    
    const endpoint = `/api/admin/v1/charging-sessions/by-station/${stationId}?${params.toString()}`;
    return api.get<ChargingSession[]>(endpoint);
  }

  async getSessionsByUser(userId: string, page: number = 1, perPage: number = 20, status?: string): Promise<ApiResponse<ChargingSession[]>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('perPage', perPage.toString());
    if (status) params.append('status', status);
    
    const endpoint = `/api/admin/v1/charging-sessions/by-user/${userId}?${params.toString()}`;
    return api.get<ChargingSession[]>(endpoint);
  }

  async getTodaysSessions(page: number = 1, perPage: number = 20): Promise<ApiResponse<ChargingSession[]>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('perPage', perPage.toString());
    
    const endpoint = `/api/admin/v1/charging-sessions/today?${params.toString()}`;
    return api.get<ChargingSession[]>(endpoint);
  }
}

export const chargingSessionsService = new ChargingSessionsService();