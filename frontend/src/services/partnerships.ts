import { api, ApiResponse } from './api';

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
    return api.post<Partner>(`/api/v1/partnerships/${actualBrandId}`, request);
  }

  async updatePartner(
    id: number,
    request: UpdatePartnerRequest,
    brandId?: number
  ): Promise<ApiResponse<Partner>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.put<Partner>(`/api/v1/partnerships/${actualBrandId}/${id}`, request);
  }

  async deletePartner(id: number, brandId?: number): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.delete(`/api/v1/partnerships/${actualBrandId}/${id}`);
  }

  async reorderPartners(
    request: UpdatePartnerOrderRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.put(`/api/v1/partnerships/${actualBrandId}/reorder`, request);
  }

  async togglePartnerStatus(
    id: number,
    request: TogglePartnerStatusRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.put(`/api/v1/partnerships/${actualBrandId}/${id}/toggle-status`, request);
  }
}

export const partnershipsService = new PartnershipsService();