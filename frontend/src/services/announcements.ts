import { api, ApiResponse } from './api';

export interface Announcement {
  id: number;
  brandId: number;
  title: string;
  content: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  creatorName?: string;
  updaterName?: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface PublishAnnouncementRequest {
  publish: boolean;
}

export interface AnnouncementSearchRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  status?: string;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
  totalCount: number;
  page: number;
  pageSize: number;
}

class AnnouncementsService {
  private getSelectedBrandId(): number {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  }

  async getAnnouncements(
    brandId?: number,
    searchRequest: AnnouncementSearchRequest = {}
  ): Promise<ApiResponse<AnnouncementsResponse>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const params = new URLSearchParams();

    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.pageSize) params.append('pageSize', searchRequest.pageSize.toString());
    if (searchRequest.search) params.append('search', searchRequest.search);
    if (searchRequest.type) params.append('type', searchRequest.type);
    if (searchRequest.status) params.append('status', searchRequest.status);

    const endpoint = `/api/v1/announcements/${actualBrandId}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<AnnouncementsResponse>(endpoint);
  }

  async getAnnouncementById(id: number, brandId?: number): Promise<ApiResponse<Announcement>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<Announcement>(`/api/v1/announcements/${actualBrandId}/${id}`);
  }

  async createAnnouncement(
    request: CreateAnnouncementRequest,
    brandId?: number
  ): Promise<ApiResponse<Announcement>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.post<Announcement>(`/api/v1/announcements/${actualBrandId}`, request);
  }

  async updateAnnouncement(
    id: number,
    request: UpdateAnnouncementRequest,
    brandId?: number
  ): Promise<ApiResponse<Announcement>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.put<Announcement>(`/api/v1/announcements/${actualBrandId}/${id}`, request);
  }

  async deleteAnnouncement(id: number, brandId?: number): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.delete(`/api/v1/announcements/${actualBrandId}/${id}`);
  }

  async publishAnnouncement(
    id: number,
    request: PublishAnnouncementRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.post(`/api/v1/announcements/${actualBrandId}/${id}/publish`, request);
  }
}

export const announcementsService = new AnnouncementsService();