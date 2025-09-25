import { api, ApiResponse } from './api';

export interface MediaFolder {
  id: number;
  name: string;
  description?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  brandId: number;
  filename: string;
  url: string;
  thumbnail: string;
  size: number;
  type: string;
  alt: string;
  tags: string[];
  category: string;
  folders: MediaFolder[];
  uploadDate: string;
  status: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  creatorName?: string;
  updaterName?: string;
}

export interface MediaSearchRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  fileType?: string;
  status?: string;
}

export interface MediaResponse {
  mediaItems: MediaItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateMediaItemRequest {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
}

export interface UpdateMediaItemRequest {
  fileName?: string;
  altText?: string;
  caption?: string;
}

export interface PublishMediaItemRequest {
  publish: boolean;
}

export interface CreateMediaFolderRequest {
  name: string;
  description?: string;
}

export interface UpdateMediaFolderRequest {
  name?: string;
  description?: string;
}

export interface UpdateMediaItemFoldersRequest {
  folderIds: number[];
}

class MediaService {
  async getMediaItems(
    brandId: number,
    searchRequest: MediaSearchRequest = {}
  ): Promise<ApiResponse<MediaResponse>> {
    const params = new URLSearchParams();

    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.pageSize) params.append('pageSize', searchRequest.pageSize.toString());
    if (searchRequest.search) params.append('search', searchRequest.search);
    if (searchRequest.fileType) params.append('fileType', searchRequest.fileType);
    if (searchRequest.status) params.append('status', searchRequest.status);

    const endpoint = `/api/v1/media/${brandId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get<MediaResponse>(endpoint);

    // Check if it's an error response
    if (response.ok === false) {
      return response;
    }

    // Success case: response.data is the data from backend
    const backendData = response.data;
    return {
      ok: true,
      data: {
        mediaItems: backendData?.mediaItems || [],
        totalCount: backendData?.totalCount || 0,
        page: backendData?.page || 1,
        pageSize: backendData?.pageSize || 10
      }
    };
  }

  async getMediaItemById(brandId: number, id: string): Promise<ApiResponse<MediaItem>> {
    return api.get<MediaItem>(`/api/v1/media/${brandId}/${id}`);
  }

  async createMediaItem(
    brandId: number,
    request: CreateMediaItemRequest
  ): Promise<ApiResponse<MediaItem>> {
    return api.post<MediaItem>(`/api/v1/media/${brandId}`, request);
  }

  async updateMediaItem(
    brandId: number,
    id: string,
    request: UpdateMediaItemRequest
  ): Promise<ApiResponse<MediaItem>> {
    return api.put<MediaItem>(`/api/v1/media/${brandId}/${id}`, request);
  }

  async deleteMediaItem(brandId: number, id: string): Promise<ApiResponse<any>> {
    return api.delete(`/api/v1/media/${brandId}/${id}`);
  }

  async publishMediaItem(
    brandId: number,
    id: string,
    request: PublishMediaItemRequest
  ): Promise<ApiResponse<any>> {
    return api.post(`/api/v1/media/${brandId}/${id}/publish`, request);
  }

  async uploadFile(
    brandId: number,
    file: File,
    altText?: string,
    caption?: string
  ): Promise<ApiResponse<MediaItem>> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);
    if (caption) formData.append('caption', caption);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/v1/media/${brandId}/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          ok: true,
          data: data as MediaItem
        };
      }

      return {
        ok: false,
        error: data.error || {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload file'
        }
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to upload file',
          details: error
        }
      };
    }
  }

  // Folder methods
  async getMediaFolders(brandId: number): Promise<ApiResponse<MediaFolder[]>> {
    return api.get<MediaFolder[]>(`/api/v1/media/${brandId}/folders`);
  }

  async createMediaFolder(
    brandId: number,
    request: CreateMediaFolderRequest
  ): Promise<ApiResponse<MediaFolder>> {
    return api.post<MediaFolder>(`/api/v1/media/${brandId}/folders`, request);
  }

  async updateMediaFolder(
    brandId: number,
    folderId: number,
    request: UpdateMediaFolderRequest
  ): Promise<ApiResponse<MediaFolder>> {
    return api.put<MediaFolder>(`/api/v1/media/${brandId}/folders/${folderId}`, request);
  }

  async deleteMediaFolder(brandId: number, folderId: number): Promise<ApiResponse<any>> {
    return api.delete(`/api/v1/media/${brandId}/folders/${folderId}`);
  }

  async updateMediaItemFolders(
    brandId: number,
    mediaItemId: string,
    request: UpdateMediaItemFoldersRequest
  ): Promise<ApiResponse<any>> {
    return api.put(`/api/v1/media/${brandId}/${mediaItemId}/folders`, request);
  }
}

export const mediaService = new MediaService();
