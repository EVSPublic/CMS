import { api, ApiResponse } from './api';
import { Station } from './stations';

export interface StationWithDistance {
  station: Station;
  distanceKm: number;
  drivingTimeMinutes: number;
  availableConnectors: string[];
  availableChargers: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface RouteOptimizationRequest {
  startPoint: Coordinate;
  endPoint: Coordinate;
  vehicleRangeKm: number;
  currentBatteryPercent: number;
  requiredConnectorTypes: string[];
  preferredBrands: string[];
  fastChargingOnly: boolean;
}

export interface RouteOptimizationResult {
  optimalStops: RouteStop[];
  totalDistance: number;
  estimatedTravelTime: number;
  totalChargingTime: number;
  warnings: string[];
  routeViable: boolean;
}

export interface RouteStop {
  station: Station;
  arrivalBatteryPercent: number;
  departureBatteryPercent: number;
  chargingTimeMinutes: number;
  recommendedCharger: any;
  distanceFromPrevious: number;
  order: number;
}

export interface LocationAnalytics {
  regionId: string;
  totalStations: number;
  averageStationDistance: number;
  stationsByStatus: Record<string, number>;
  chargersByType: Record<string, number>;
  coverageGaps: CoverageGap[];
  populationCovered: number;
  highDemandAreas: HighDemandArea[];
}

export interface CoverageGap {
  center: Coordinate;
  radiusKm: number;
  estimatedDemand: number;
  priority: string;
}

export interface HighDemandArea {
  center: Coordinate;
  radiusKm: number;
  dailyTrafficEstimate: number;
  demandFactors: string[];
}

export interface DemandPoint {
  location: Coordinate;
  demandScore: number;
  demandType: string;
  properties: Record<string, any>;
}

export interface Geofence {
  id: string;
  name: string;
  type: 'Circle' | 'Polygon';
  boundary?: Coordinate[];
  center?: Coordinate;
  radiusKm?: number;
  properties: Record<string, any>;
}

export interface GeofenceResult {
  matches: GeofenceMatch[];
  isInsideAnyGeofence: boolean;
}

export interface GeofenceMatch {
  geofence: Geofence;
  distanceFromEdge: number;
  isInside: boolean;
}

export interface LocationOptimizationRequest {
  demandPoints: DemandPoint[];
  maxStations: number;
}

export interface GeofenceCheckRequest {
  latitude: number;
  longitude: number;
  geofences: Geofence[];
}

class LocationService {
  async findNearbyStations(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10, 
    brands?: string[]
  ): Promise<ApiResponse<Station[]>> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radiusKm: radiusKm.toString()
    });
    
    if (brands) {
      brands.forEach(brand => params.append('brands', brand));
    }
    
    return api.get<Station[]>(`/api/admin/v1/location/stations/nearby?${params.toString()}`);
  }

  async findStationsWithDistance(
    latitude: number, 
    longitude: number, 
    maxDistanceKm: number = 50
  ): Promise<ApiResponse<StationWithDistance[]>> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      maxDistanceKm: maxDistanceKm.toString()
    });
    
    return api.get<StationWithDistance[]>(`/api/admin/v1/location/stations/with-distance?${params.toString()}`);
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<ApiResponse<RouteOptimizationResult>> {
    return api.post<RouteOptimizationResult>('/api/admin/v1/location/route/optimize', request);
  }

  async findStationsAlongRoute(
    routePoints: Coordinate[], 
    corridorWidthKm: number = 5.0
  ): Promise<ApiResponse<Station[]>> {
    return api.post<Station[]>(`/api/admin/v1/location/stations/along-route?corridorWidthKm=${corridorWidthKm}`, routePoints);
  }

  async getLocationAnalytics(regionId: string): Promise<ApiResponse<LocationAnalytics>> {
    return api.get<LocationAnalytics>(`/api/admin/v1/location/analytics/${regionId}`);
  }

  async calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): Promise<ApiResponse<number>> {
    const params = new URLSearchParams({
      lat1: lat1.toString(),
      lon1: lon1.toString(),
      lat2: lat2.toString(),
      lon2: lon2.toString()
    });
    
    return api.get<number>(`/api/admin/v1/location/distance?${params.toString()}`);
  }

  async findOptimalStationLocations(request: LocationOptimizationRequest): Promise<ApiResponse<Station[]>> {
    return api.post<Station[]>('/api/admin/v1/location/optimization/station-locations', request);
  }

  async checkGeofence(request: GeofenceCheckRequest): Promise<ApiResponse<GeofenceResult>> {
    return api.post<GeofenceResult>('/api/admin/v1/location/geofence/check', request);
  }
}

export const locationService = new LocationService();