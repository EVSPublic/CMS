import { api, ApiResponse } from './api';
import { logService } from './logService';

export interface Partner {
  id: number;
  brandId: number;
  title: string;
  logo?: string;
  alt?: string;
  status: string;
  displayOrder: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  creatorName?: string;
  updaterName?: string;
}

export interface CreatePartnerRequest {
  title: string;
  logo?: string;
  alt?: string;
}

export interface UpdatePartnerRequest {
  title?: string;
  logo?: string;
  alt?: string;
}

export interface UpdatePartnerOrderRequest {
  partnerIds: number[];
}

export interface TogglePartnerStatusRequest {
  active: boolean;
}

export interface PartnersResponse {
  partners: Partner[];
}

export interface SlideSettings {
  slideInterval: number;
  slideDuration: number;
}

export interface UpdateSlideSettingsRequest {
  slideInterval: number;
  slideDuration: number;
}

class PartnershipsService {
  private getSelectedBrandId(): number {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  }

  async getPartners(brandId?: number): Promise<ApiResponse<PartnersResponse>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<PartnersResponse>(`/api/v1/partnerships/${actualBrandId}`);
  }

  async getPartnerById(id: number, brandId?: number): Promise<ApiResponse<Partner>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<Partner>(`/api/v1/partnerships/${actualBrandId}/${id}`);
  }

  async createPartner(
    request: CreatePartnerRequest,
    brandId?: number
  ): Promise<ApiResponse<Partner>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.post<Partner>(`/api/v1/partnerships/${actualBrandId}`, request);

    if (response.ok && response.data) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'partner_create',
        `Partner oluşturuldu: ${request.title} (${brandName})`,
        { level: 'success', resourceType: 'partner', resourceId: response.data.id.toString() }
      );
    }

    return response;
  }

  async updatePartner(
    id: number,
    request: UpdatePartnerRequest,
    brandId?: number
  ): Promise<ApiResponse<Partner>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put<Partner>(`/api/v1/partnerships/${actualBrandId}/${id}`, request);

    if (response.ok && response.data) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'partner_update',
        `Partner güncellendi: ${request.title || response.data.title} (${brandName})`,
        { level: 'success', resourceType: 'partner', resourceId: id.toString() }
      );
    }

    return response;
  }

  async deletePartner(id: number, brandId?: number): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.delete(`/api/v1/partnerships/${actualBrandId}/${id}`);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'partner_delete',
        `Partner silindi: ${id} (${brandName})`,
        { level: 'warning', resourceType: 'partner', resourceId: id.toString() }
      );
    }

    return response;
  }

  async reorderPartners(
    request: UpdatePartnerOrderRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put(`/api/v1/partnerships/${actualBrandId}/reorder`, request);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'partner_reorder',
        `Partner sıralaması değiştirildi (${brandName})`,
        { level: 'info', resourceType: 'partner' }
      );
    }

    return response;
  }

  async togglePartnerStatus(
    id: number,
    request: TogglePartnerStatusRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put(`/api/v1/partnerships/${actualBrandId}/${id}/toggle-status`, request);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      const status = request.active ? 'aktif' : 'pasif';
      logService.log(
        'partner_toggle_status',
        `Partner durumu değiştirildi: ${id} - ${status} (${brandName})`,
        { level: 'info', resourceType: 'partner', resourceId: id.toString() }
      );
    }

    return response;
  }

  async getSlideSettings(brandId?: number): Promise<ApiResponse<SlideSettings>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<SlideSettings>(`/api/v1/partnerships/${actualBrandId}/slide-settings`);
  }

  async updateSlideSettings(
    request: UpdateSlideSettingsRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put(`/api/v1/partnerships/${actualBrandId}/slide-settings`, request);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'partnership_slide_settings_update',
        `Partner slide ayarları güncellendi (${brandName})`,
        { level: 'success', resourceType: 'slide-settings' }
      );
    }

    return response;
  }
}

export const partnershipsService = new PartnershipsService();