import { api, ApiResponse } from './api';

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  chargers: Charger[];
  hours: Record<string, string>;
  contact: StationContact;
  images: string[];
  amenities: string[];
  brandVisibility: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  totalChargers: number;
  availableChargers: number;
}

export interface Charger {
  id: string;
  type: string;
  powerKW: number;
  status: string;
  connectorType: string;
  lastMaintenance?: string;
}

export interface StationContact {
  phone: string;
  email: string;
  socialLinks: Record<string, string>;
}

export interface StationSearchRequest {
  search?: string;
  status?: string;
  brandVisibility?: string[];
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status?: string;
  chargers: CreateChargerRequest[];
  hours?: Record<string, string>;
  contact?: CreateStationContactRequest;
  images?: string[];
  amenities?: string[];
  brandVisibility?: string[];
}

export interface CreateChargerRequest {
  type: string;
  powerKW: number;
  status?: string;
  connectorType: string;
  lastMaintenance?: string;
}

export interface CreateStationContactRequest {
  phone?: string;
  email?: string;
  socialLinks?: Record<string, string>;
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  chargers?: CreateChargerRequest[];
  hours?: Record<string, string>;
  contact?: CreateStationContactRequest;
  images?: string[];
  amenities?: string[];
  brandVisibility?: string[];
}

export interface UpdateChargerStatusRequest {
  chargerId: string;
  status: string;
  lastMaintenance?: string;
}

export interface StationWithDistance {
  station: Station;
  distanceKm: number;
  drivingTimeMinutes: number;
  availableConnectors: string[];
  availableChargers: number;
}

class StationsService {
  async getStations(request: StationSearchRequest = {}): Promise<ApiResponse<Station[]>> {
    const queryParams = new URLSearchParams();
    
    if (request.search) queryParams.append('search', request.search);
    if (request.status) queryParams.append('status', request.status);
    if (request.brandVisibility) request.brandVisibility.forEach(brand => queryParams.append('brandVisibility', brand));
    if (request.latitude !== undefined) queryParams.append('latitude', request.latitude.toString());
    if (request.longitude !== undefined) queryParams.append('longitude', request.longitude.toString());
    if (request.radiusKm !== undefined) queryParams.append('radiusKm', request.radiusKm.toString());
    if (request.page !== undefined) queryParams.append('page', request.page.toString());
    if (request.perPage !== undefined) queryParams.append('perPage', request.perPage.toString());
    if (request.sortBy) queryParams.append('sortBy', request.sortBy);
    if (request.sortOrder) queryParams.append('sortOrder', request.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `/api/admin/v1/stations${queryString ? `?${queryString}` : ''}`;
    
    return api.get<Station[]>(endpoint);
  }

  async getStation(id: string): Promise<ApiResponse<Station>> {
    return api.get<Station>(`/api/admin/v1/stations/${id}`);
  }

  async createStation(request: CreateStationRequest): Promise<ApiResponse<Station>> {
    return api.post<Station>('/api/admin/v1/stations', request);
  }

  async updateStation(id: string, request: UpdateStationRequest): Promise<ApiResponse<Station>> {
    return api.put<Station>(`/api/admin/v1/stations/${id}`, request);
  }

  async deleteStation(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/api/admin/v1/stations/${id}`);
  }

  async updateChargerStatus(stationId: string, chargerId: string, request: Omit<UpdateChargerStatusRequest, 'chargerId'>): Promise<ApiResponse<Station>> {
    return api.put<Station>(`/api/admin/v1/stations/${stationId}/chargers/${chargerId}/status`, {
      chargerId,
      ...request
    });
  }

  async getNearbyStations(latitude: number, longitude: number, radiusKm: number = 10): Promise<ApiResponse<Station[]>> {
    return api.get<Station[]>(`/api/admin/v1/stations/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`);
  }

  async getStationStatusSummary(): Promise<ApiResponse<Record<string, number>>> {
    return api.get<Record<string, number>>('/api/admin/v1/stations/status-summary');
  }

  async getStationsByBrand(brand: string): Promise<ApiResponse<Station[]>> {
    return api.get<Station[]>(`/api/admin/v1/stations/brand/${brand}`);
  }

  async getStationsWithDistance(latitude: number, longitude: number, maxDistanceKm: number = 50): Promise<ApiResponse<StationWithDistance[]>> {
    return api.get<StationWithDistance[]>(`/api/admin/v1/location/stations/with-distance?latitude=${latitude}&longitude=${longitude}&maxDistanceKm=${maxDistanceKm}`);
  }
}

export const stationsService = new StationsService();