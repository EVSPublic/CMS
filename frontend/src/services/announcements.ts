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
  async getAnnouncements(
    brandId: number,
    searchRequest: AnnouncementSearchRequest = {}
  ): Promise<ApiResponse<AnnouncementsResponse>> {
    const params = new URLSearchParams();

    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.pageSize) params.append('pageSize', searchRequest.pageSize.toString());
    if (searchRequest.search) params.append('search', searchRequest.search);
    if (searchRequest.type) params.append('type', searchRequest.type);
    if (searchRequest.status) params.append('status', searchRequest.status);

    const endpoint = `/api/v1/announcements/${brandId}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<AnnouncementsResponse>(endpoint);
  }

  async getAnnouncementById(brandId: number, id: number): Promise<ApiResponse<Announcement>> {
    return api.get<Announcement>(`/api/v1/announcements/${brandId}/${id}`);
  }

  async createAnnouncement(
    brandId: number,
    request: CreateAnnouncementRequest
  ): Promise<ApiResponse<Announcement>> {
    return api.post<Announcement>(`/api/v1/announcements/${brandId}`, request);
  }

  async updateAnnouncement(
    brandId: number,
    id: number,
    request: UpdateAnnouncementRequest
  ): Promise<ApiResponse<Announcement>> {
    return api.put<Announcement>(`/api/v1/announcements/${brandId}/${id}`, request);
  }

  async deleteAnnouncement(brandId: number, id: number): Promise<ApiResponse<any>> {
    return api.delete(`/api/v1/announcements/${brandId}/${id}`);
  }

  async publishAnnouncement(
    brandId: number,
    id: number,
    request: PublishAnnouncementRequest
  ): Promise<ApiResponse<any>> {
    return api.post(`/api/v1/announcements/${brandId}/${id}/publish`, request);
  }
}

export const announcementsService = new AnnouncementsService();