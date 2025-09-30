import { api, ApiResponse } from './api';
import { logService } from './logService';

export interface StaticPage {
  id: number;
  brandId: number;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  creatorName?: string;
  updaterName?: string;
}

export interface CreateStaticPageRequest {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateStaticPageRequest {
  title?: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface PublishStaticPageRequest {
  publish: boolean;
}

export interface StaticPagesResponse {
  staticPages: StaticPage[];
  totalCount: number;
  page: number;
  pageSize: number;
}

class StaticPagesService {
  private getSelectedBrandId(): number {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  }

  async getStaticPages(
    brandId?: number,
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<ApiResponse<StaticPagesResponse>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    if (search) {
      params.append('search', search);
    }

    return api.get<StaticPagesResponse>(`/api/v1/static-pages/${actualBrandId}?${params}`);
  }

  async getStaticPageById(id: number, brandId?: number): Promise<ApiResponse<StaticPage>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<StaticPage>(`/api/v1/static-pages/${actualBrandId}/${id}`);
  }

  async createStaticPage(
    request: CreateStaticPageRequest,
    brandId?: number
  ): Promise<ApiResponse<StaticPage>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.post<StaticPage>(`/api/v1/static-pages/${actualBrandId}`, request);

    if (response.ok && response.data) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'static_page_create',
        `Statik sayfa oluşturuldu: ${request.title} (${brandName})`,
        { level: 'success', resourceType: 'static_page', resourceId: response.data.id.toString() }
      );
    }

    return response;
  }

  async updateStaticPage(
    id: number,
    request: UpdateStaticPageRequest,
    brandId?: number
  ): Promise<ApiResponse<StaticPage>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put<StaticPage>(`/api/v1/static-pages/${actualBrandId}/${id}`, request);

    if (response.ok && response.data) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'static_page_update',
        `Statik sayfa güncellendi: ${request.title || response.data.title} (${brandName})`,
        { level: 'success', resourceType: 'static_page', resourceId: id.toString() }
      );
    }

    return response;
  }

  async deleteStaticPage(id: number, brandId?: number): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.delete(`/api/v1/static-pages/${actualBrandId}/${id}`);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'static_page_delete',
        `Statik sayfa silindi: ${id} (${brandName})`,
        { level: 'warning', resourceType: 'static_page', resourceId: id.toString() }
      );
    }

    return response;
  }

  async publishStaticPage(
    id: number,
    request: PublishStaticPageRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.post(`/api/v1/static-pages/${actualBrandId}/${id}/publish`, request);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      const action = request.publish ? 'yayınlandı' : 'yayından kaldırıldı';
      logService.log(
        'static_page_publish',
        `Statik sayfa ${action}: ${id} (${brandName})`,
        { level: 'success', resourceType: 'static_page', resourceId: id.toString() }
      );
    }

    return response;
  }
}

export const staticPagesService = new StaticPagesService();