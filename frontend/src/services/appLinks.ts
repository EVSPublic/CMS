import { api, ApiResponse } from './api';
import { logService } from './logService';

export interface AppLinks {
  iosAppLink?: string;
  androidAppLink?: string;
}

export interface UpdateAppLinksRequest {
  iosAppLink?: string;
  androidAppLink?: string;
}

class AppLinksService {
  private getSelectedBrandId(): number {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  }

  async getAppLinks(brandId?: number): Promise<ApiResponse<AppLinks>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    return api.get<AppLinks>(`/api/v1/app-links/${actualBrandId}`);
  }

  async updateAppLinks(
    data: UpdateAppLinksRequest,
    brandId?: number
  ): Promise<ApiResponse<any>> {
    const actualBrandId = brandId || this.getSelectedBrandId();
    const response = await api.put(`/api/v1/app-links/${actualBrandId}`, data);

    if (response.ok) {
      const brandName = actualBrandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.log(
        'app_links_update',
        `Uygulama linkleri güncellendi (${brandName})`,
        { level: 'success', resourceType: 'app_links' }
      );
    }

    return response;
  }
}

export const appLinksService = new AppLinksService();
