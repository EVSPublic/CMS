import { api, ApiResponse } from './api';
import { logService } from './logService';

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
  private getSelectedBrandFilter(): string[] | undefined {
    const selectedBrand = localStorage.getItem('selectedBrand');
    if (selectedBrand) {
      return [selectedBrand];
    }
    return undefined;
  }

  async getStations(request: StationSearchRequest = {}): Promise<ApiResponse<Station[]>> {
    const queryParams = new URLSearchParams();

    // Apply project selection filter
    const brandFilter = this.getSelectedBrandFilter();
    const brandVisibility = request.brandVisibility || brandFilter;

    if (request.search) queryParams.append('search', request.search);
    if (request.status) queryParams.append('status', request.status);
    if (brandVisibility) brandVisibility.forEach(brand => queryParams.append('brandVisibility', brand));
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
    // Apply project selection to new stations
    const brandFilter = this.getSelectedBrandFilter();
    const stationRequest = {
      ...request,
      brandVisibility: request.brandVisibility || brandFilter || []
    };

    const response = await api.post<Station>('/api/admin/v1/stations', stationRequest);

    if (response.ok && response.data) {
      const brands = stationRequest.brandVisibility.join(', ') || 'All';
      logService.log(
        'station_create',
        `İstasyon oluşturuldu: ${request.name} (${brands})`,
        { level: 'success', resourceType: 'station', resourceId: response.data.id }
      );
    }

    return response;
  }

  async updateStation(id: string, request: UpdateStationRequest): Promise<ApiResponse<Station>> {
    const response = await api.put<Station>(`/api/admin/v1/stations/${id}`, request);

    if (response.ok && response.data) {
      logService.log(
        'station_update',
        `İstasyon güncellendi: ${request.name || response.data.name}`,
        { level: 'success', resourceType: 'station', resourceId: id }
      );
    }

    return response;
  }

  async deleteStation(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<void>(`/api/admin/v1/stations/${id}`);

    if (response.ok) {
      logService.log(
        'station_delete',
        `İstasyon silindi: ${id}`,
        { level: 'warning', resourceType: 'station', resourceId: id }
      );
    }

    return response;
  }

  async updateChargerStatus(stationId: string, chargerId: string, request: Omit<UpdateChargerStatusRequest, 'chargerId'>): Promise<ApiResponse<Station>> {
    const response = await api.put<Station>(`/api/admin/v1/stations/${stationId}/chargers/${chargerId}/status`, {
      chargerId,
      ...request
    });

    if (response.ok) {
      logService.log(
        'charger_status_update',
        `Şarj cihazı durumu güncellendi: ${chargerId} -> ${request.status}`,
        { level: 'info', resourceType: 'charger', resourceId: chargerId, metadata: { stationId } }
      );
    }

    return response;
  }

  async getNearbyStations(latitude: number, longitude: number, radiusKm: number = 10): Promise<ApiResponse<Station[]>> {
    const brandFilter = this.getSelectedBrandFilter();
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radiusKm: radiusKm.toString()
    });

    if (brandFilter) {
      brandFilter.forEach(brand => params.append('brandVisibility', brand));
    }

    return api.get<Station[]>(`/api/admin/v1/stations?${params.toString()}`);
  }

  async getStationStatusSummary(): Promise<ApiResponse<Record<string, number>>> {
    return api.get<Record<string, number>>('/api/admin/v1/stations/status-summary');
  }

  async getStationsByBrand(brand?: string): Promise<ApiResponse<Station[]>> {
    const targetBrand = brand || this.getSelectedBrandFilter()?.[0];
    if (!targetBrand) {
      return this.getStations();
    }
    return this.getStations({ brandVisibility: [targetBrand] });
  }

  async getStationsWithDistance(latitude: number, longitude: number, maxDistanceKm: number = 50): Promise<ApiResponse<StationWithDistance[]>> {
    const brandFilter = this.getSelectedBrandFilter();
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radiusKm: maxDistanceKm.toString()
    });

    if (brandFilter) {
      brandFilter.forEach(brand => params.append('brandVisibility', brand));
    }

    return api.get<StationWithDistance[]>(`/api/admin/v1/stations?${params.toString()}`);
  }
}

export const stationsService = new StationsService();