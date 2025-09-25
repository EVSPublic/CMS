import { api, ApiResponse } from './api';

// TypeScript interfaces matching the backend DTOs
export interface ContentPageDto {
  id: number;
  brandId: number;
  pageType: string;
  content: any;
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

export interface UpdateContentPageDto {
  content: any;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface PublishContentPageDto {
  publish: boolean;
}

// Individual Solutions page content structure matching backend
export interface IndividualSolutionsPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  mainSolution: {
    title: string;
    description: string;
    image: string;
  };
  bottomItems: Array<{
    image: string;
    paragraph: string;
  }>;
  footerSection: {
    altText: string;
  };
}

// About page content structure matching backend
export interface AboutPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  mainSection: {
    title: string;
    description: string;
    image: string;
  };
  additionalSection: {
    description: string;
    image: string;
  };
  missionVision: {
    vision: {
      title: string;
      quote: string;
      description: string;
    };
    mission: {
      title: string;
      quote: string;
      description: string;
    };
  };
}

// Index page content structure matching backend
export interface IndexPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    title: string;
    mediaType: 'video' | 'image';
    mediaUrl: string;
    count: string;
    countText: string;
  };
  services: {
    title: string;
    content: string;
    subtitle: string;
  };
  tariffs: {
    title: string;
    description: string;
    listTitle: string;
  };
  opet: {
    backgroundImage: string;
  };
  solutions: {
    individualDescription: string;
    corporateDescription: string;
    solutionsImage: string;
  };
  sustainability: {
    title: string;
    description: string;
    backgroundImage: string;
  };
}

export type PageType = 'index' | 'about' | 'individual-solutions' | 'corporate-solutions' |
  'tarifeler' | 'iletisim' | 'istasyon-haritasi' | 'announcements' | 'partnership';

class ContentService {
  /**
   * Get content page for a specific brand and page type
   */
  async getContentPage(brandId: number, pageType: PageType): Promise<ApiResponse<ContentPageDto>> {
    return api.get<ContentPageDto>(`/api/v1/content/${brandId}/${pageType}`);
  }

  /**
   * Update content page
   */
  async updateContentPage(
    brandId: number,
    pageType: PageType,
    request: UpdateContentPageDto
  ): Promise<ApiResponse<ContentPageDto>> {
    return api.put<ContentPageDto>(`/api/v1/content/${brandId}/${pageType}`, request);
  }

  /**
   * Publish or unpublish content page
   */
  async publishContentPage(
    brandId: number,
    pageType: PageType,
    publish: boolean
  ): Promise<ApiResponse<{ message: string }>> {
    return api.post<{ message: string }>(`/api/v1/content/${brandId}/${pageType}/publish`, { publish });
  }

  /**
   * Save content page with proper data structure
   */
  async saveContentPage(
    brandId: number,
    pageType: PageType,
    content: any,
    metaTitle?: string,
    metaDescription?: string,
    metaKeywords?: string
  ): Promise<ApiResponse<ContentPageDto>> {
    const request: UpdateContentPageDto = {
      content,
      metaTitle,
      metaDescription,
      metaKeywords
    };

    return this.updateContentPage(brandId, pageType, request);
  }

  /**
   * Get typed index page content
   */
  async getIndexPageContent(brandId: number): Promise<ApiResponse<IndexPageContent>> {
    const response = await this.getContentPage(brandId, 'index');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure
      const content = response.data.content as IndexPageContent;
      return {
        ok: true,
        data: content
      };
    }
    return {
      ok: false,
      error: response.error || { code: 'LOAD_ERROR', message: 'Failed to load content' }
    };
  }

  /**
   * Save typed index page content
   */
  async saveIndexPageContent(
    brandId: number,
    content: IndexPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'index',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get typed about page content
   */
  async getAboutPageContent(brandId: number): Promise<ApiResponse<AboutPageContent>> {
    const response = await this.getContentPage(brandId, 'about');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure
      const content = response.data.content as AboutPageContent;
      return {
        ok: true,
        data: content
      };
    }
    return {
      ok: false,
      error: response.error || { code: 'LOAD_ERROR', message: 'Failed to load content' }
    };
  }

  /**
   * Save typed about page content
   */
  async saveAboutPageContent(
    brandId: number,
    content: AboutPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'about',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get brand statistics including charging station count
   */
  async getBrandStatistics(brandId: number): Promise<ApiResponse<{ chargingStationCount: number; formattedCount: string }>> {
    return api.get<{ chargingStationCount: number; formattedCount: string }>(`/api/v1/content/${brandId}/statistics`);
  }
}

export const contentService = new ContentService();