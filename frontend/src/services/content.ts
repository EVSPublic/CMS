import { api, ApiResponse } from './api';
import { logService } from './logService';

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
    additionalDescription?: string; // For Sharz.net only
    image: string;
  };
  bottomItems: Array<{
    image: string;
    paragraph: string;
  }>;
  products?: Array<{ // For Sharz.net only
    title: string;
    subtitle: string;
    image: string;
  }>;
  footerSection: {
    altText: string;
  };
}

// Corporate Solutions page content structure matching backend
export interface CorporateSolutionsPageContent {
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
  businessSolutions: {
    title: string;
    cards: Array<{
      image: string;
      title: string;
      content: string;
    }>;
  };
  managementCards: Array<{
    image: string;
    title: string;
    content: string;
  }>;
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

// Tarifeler page content structure matching backend
export interface TarifelerPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  pageHeader: {
    title: string;
    description: string;
  };
  tariffs: {
    isCampaign: boolean;
    campaignExpireDate: string;
    cards: Array<{
      badge: string;
      title: string;
      currentType: string;
      oldPrice: string;
      currentPrice: string;
      unit: string;
    }>;
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
    subtitle?: string;
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
    listTitle: string; // For Ovolt
    acListTitle?: string; // For Sharz.net only
    dcListTitle?: string; // For Sharz.net only
    tarifelerImage?: string; // For Sharz.net only
  };
  opet: {
    backgroundImage: string;
  };
  solutions: {
    individualImage?: string; // Individual solutions image
    individualDescription: string;
    corporateImage?: string; // Corporate solutions image
    corporateDescription: string;
    solutionsImage: string;
  };
  sustainability: {
    title: string;
    description: string;
    description2?: string; // For Sharz.net only
    backgroundImage: string;
  };
}

// Contact page content structure matching backend
export interface ContactPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  contactInfo: {
    title: string;
    office: {
      title: string;
      address: string[];
    };
    email: {
      title: string;
      address: string;
    };
    phone: {
      title: string;
      number: string;
    };
  };
  contactForm: {
    title: string;
    tabs: {
      individual: string;
      corporate: string;
    };
    fields: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      company: string;
      title: string;
      subject: string;
      message: string;
    };
    subjectOptions: Array<{
      value: string;
      label: string;
    }>;
    emailConfig: {
      smtpHost: string;
      smtpPort: string;
      smtpUsername: string;
      smtpPassword: string;
      smtpSecurityType: string;
      extraDetails: string;
    };
    submitButton: string;
    kvkkText: string;
    kvkkLinkText: string;
  };
  socialMedia: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export type PageType = 'Index' | 'About' | 'IndividualSolutions' | 'CorporateSolutions' |
  'Tariffs' | 'Contact' | 'StationMap';

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
    const response = await api.put<ContentPageDto>(`/api/v1/content/${brandId}/${pageType}`, request);

    if (response.ok) {
      const brandName = brandId === 1 ? 'Ovolt' : 'Sharz.net';
      logService.logContentAction(
        'content_save',
        `${pageType} sayfası içeriği güncellendi (${brandName})`,
        pageType
      );
    }

    return response;
  }

  /**
   * Publish or unpublish content page
   */
  async publishContentPage(
    brandId: number,
    pageType: PageType,
    publish: boolean
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<{ message: string }>(`/api/v1/content/${brandId}/${pageType}/publish`, { publish });

    if (response.ok) {
      const brandName = brandId === 1 ? 'Ovolt' : 'Sharz.net';
      const action = publish ? 'content_publish' : 'content_unpublish';
      const actionText = publish ? 'yayınlandı' : 'yayından kaldırıldı';

      logService.logContentAction(
        action,
        `${pageType} sayfası ${actionText} (${brandName})`,
        pageType
      );
    }

    return response;
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
    const response = await this.getContentPage(brandId, 'Index');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure and merge meta fields
      const content = response.data.content as IndexPageContent;

      // Merge meta fields from DTO into content structure
      if (content.meta) {
        content.meta.title = response.data.metaTitle || content.meta.title || '';
        content.meta.description = response.data.metaDescription || content.meta.description || '';
        content.meta.keywords = response.data.metaKeywords || content.meta.keywords || '';
      }

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
      'Index',
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
    const response = await this.getContentPage(brandId, 'About');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure and merge meta fields
      const content = response.data.content as AboutPageContent;

      // Merge meta fields from DTO into content structure
      if (content.meta) {
        content.meta.title = response.data.metaTitle || content.meta.title || '';
        content.meta.description = response.data.metaDescription || content.meta.description || '';
        content.meta.keywords = response.data.metaKeywords || content.meta.keywords || '';
      }

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
      'About',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get typed individual solutions page content
   */
  async getIndividualSolutionsPageContent(brandId: number): Promise<ApiResponse<IndividualSolutionsPageContent>> {
    const response = await this.getContentPage(brandId, 'IndividualSolutions');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure and merge meta fields
      const content = response.data.content as IndividualSolutionsPageContent;

      // Merge meta fields from DTO into content structure
      if (content.meta) {
        content.meta.title = response.data.metaTitle || content.meta.title || '';
        content.meta.description = response.data.metaDescription || content.meta.description || '';
        content.meta.keywords = response.data.metaKeywords || content.meta.keywords || '';
      }

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
   * Save typed individual solutions page content
   */
  async saveIndividualSolutionsPageContent(
    brandId: number,
    content: IndividualSolutionsPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'IndividualSolutions',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get typed corporate solutions page content
   */
  async getCorporateSolutionsPageContent(brandId: number): Promise<ApiResponse<CorporateSolutionsPageContent>> {
    const response = await this.getContentPage(brandId, 'CorporateSolutions');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure and merge meta fields
      const content = response.data.content as CorporateSolutionsPageContent;

      // Merge meta fields from DTO into content structure
      if (content.meta) {
        content.meta.title = response.data.metaTitle || content.meta.title || '';
        content.meta.description = response.data.metaDescription || content.meta.description || '';
        content.meta.keywords = response.data.metaKeywords || content.meta.keywords || '';
      }

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
   * Save typed corporate solutions page content
   */
  async saveCorporateSolutionsPageContent(
    brandId: number,
    content: CorporateSolutionsPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'CorporateSolutions',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get typed tarifeler page content
   */
  async getTarifelerPageContent(brandId: number): Promise<ApiResponse<TarifelerPageContent>> {
    const response = await this.getContentPage(brandId, 'Tariffs');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure
      const rawContent = response.data.content as any;

      // Map backend PascalCase to frontend camelCase
      const content: TarifelerPageContent = {
        meta: {
          title: response.data.metaTitle || rawContent.Meta?.Title || rawContent.meta?.title || '',
          description: response.data.metaDescription || rawContent.Meta?.Description || rawContent.meta?.description || '',
          keywords: response.data.metaKeywords || rawContent.Meta?.Keywords || rawContent.meta?.keywords || ''
        },
        hero: {
          image: rawContent.Hero?.Image || rawContent.hero?.image || ''
        },
        pageHeader: {
          title: rawContent.PageHeader?.Title || rawContent.pageHeader?.title || '',
          description: rawContent.PageHeader?.Description || rawContent.pageHeader?.description || ''
        },
        tariffs: {
          isCampaign: rawContent.Tariffs?.IsCampaign ?? rawContent.tariffs?.isCampaign ?? false,
          campaignExpireDate: rawContent.Tariffs?.CampaignExpireDate || rawContent.tariffs?.campaignExpireDate || '30-31 ağustos tarihleri arasında geçerlidir',
          cards: (rawContent.Tariffs?.Cards || rawContent.tariffs?.cards || []).map((card: any) => ({
            badge: card.Badge || card.badge || '',
            title: card.Title || card.title || '',
            currentType: card.CurrentType || card.currentType || 'AC',
            oldPrice: card.OldPrice || card.oldPrice || '',
            currentPrice: card.CurrentPrice || card.currentPrice || '',
            unit: card.Unit || card.unit || 'kWh'
          }))
        }
      };

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
   * Save typed tarifeler page content
   */
  async saveTarifelerPageContent(
    brandId: number,
    content: TarifelerPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'Tariffs',
      content,
      content.meta.title,
      content.meta.description,
      content.meta.keywords
    );
  }

  /**
   * Get typed contact page content
   */
  async getContactPageContent(brandId: number): Promise<ApiResponse<ContactPageContent>> {
    const response = await this.getContentPage(brandId, 'Contact');
    if (response.ok && response.data) {
      // Extract content from the ContentPageDto structure
      const rawContent = response.data.content as any;

      // Normalize to camelCase structure
      // Priority: camelCase (user edits) -> PascalCase (defaults)
      const content: ContactPageContent = {
        meta: {
          title: response.data.metaTitle || rawContent.meta?.title || rawContent.Meta?.Title || '',
          description: response.data.metaDescription || rawContent.meta?.description || rawContent.Meta?.Description || '',
          keywords: response.data.metaKeywords || rawContent.meta?.keywords || rawContent.Meta?.Keywords || ''
        },
        hero: {
          image: rawContent.hero?.image || rawContent.Hero?.Image || ''
        },
        pageHero: {
          backgroundImage: rawContent.pageHero?.backgroundImage || rawContent.PageHero?.BackgroundImage || '',
          logoImage: rawContent.pageHero?.logoImage || rawContent.PageHero?.LogoImage || '',
          logoAlt: rawContent.pageHero?.logoAlt || rawContent.PageHero?.LogoAlt || ''
        },
        contactInfo: {
          title: rawContent.contactInfo?.title || rawContent.ContactInfo?.Title || '',
          office: {
            title: rawContent.contactInfo?.office?.title || rawContent.ContactInfo?.Office?.Title || '',
            address: rawContent.contactInfo?.office?.address || rawContent.ContactInfo?.Office?.Address || []
          },
          email: {
            title: rawContent.contactInfo?.email?.title || rawContent.ContactInfo?.Email?.Title || '',
            address: rawContent.contactInfo?.email?.address || rawContent.ContactInfo?.Email?.Address || ''
          },
          phone: {
            title: rawContent.contactInfo?.phone?.title || rawContent.ContactInfo?.Phone?.Title || '',
            number: rawContent.contactInfo?.phone?.number || rawContent.ContactInfo?.Phone?.Number || ''
          }
        },
        contactForm: {
          title: rawContent.contactForm?.title || rawContent.ContactForm?.Title || '',
          tabs: {
            individual: rawContent.contactForm?.tabs?.individual || rawContent.ContactForm?.Tabs?.Individual || '',
            corporate: rawContent.contactForm?.tabs?.corporate || rawContent.ContactForm?.Tabs?.Corporate || ''
          },
          fields: {
            firstName: rawContent.contactForm?.fields?.firstName || rawContent.ContactForm?.Fields?.FirstName || '',
            lastName: rawContent.contactForm?.fields?.lastName || rawContent.ContactForm?.Fields?.LastName || '',
            email: rawContent.contactForm?.fields?.email || rawContent.ContactForm?.Fields?.Email || '',
            phone: rawContent.contactForm?.fields?.phone || rawContent.ContactForm?.Fields?.Phone || '',
            company: rawContent.contactForm?.fields?.company || rawContent.ContactForm?.Fields?.Company || '',
            title: rawContent.contactForm?.fields?.title || rawContent.ContactForm?.Fields?.Title || '',
            subject: rawContent.contactForm?.fields?.subject || rawContent.ContactForm?.Fields?.Subject || '',
            message: rawContent.contactForm?.fields?.message || rawContent.ContactForm?.Fields?.Message || ''
          },
          subjectOptions: (rawContent.contactForm?.subjectOptions || rawContent.ContactForm?.SubjectOptions || []).map((opt: any) => ({
            value: opt.value || opt.Value || '',
            label: opt.label || opt.Label || ''
          })),
          emailConfig: {
            smtpHost: rawContent.contactForm?.emailConfig?.smtpHost || rawContent.ContactForm?.EmailConfig?.SmtpHost || '',
            smtpPort: rawContent.contactForm?.emailConfig?.smtpPort || rawContent.ContactForm?.EmailConfig?.SmtpPort || '',
            smtpUsername: rawContent.contactForm?.emailConfig?.smtpUsername || rawContent.ContactForm?.EmailConfig?.SmtpUsername || '',
            smtpPassword: rawContent.contactForm?.emailConfig?.smtpPassword || rawContent.ContactForm?.EmailConfig?.SmtpPassword || '',
            smtpSecurityType: rawContent.contactForm?.emailConfig?.smtpSecurityType || rawContent.ContactForm?.EmailConfig?.SmtpSecurityType || 'StartTls',
            extraDetails: rawContent.contactForm?.emailConfig?.extraDetails || rawContent.ContactForm?.EmailConfig?.ExtraDetails || ''
          },
          submitButton: rawContent.contactForm?.submitButton || rawContent.ContactForm?.SubmitButton || '',
          kvkkText: rawContent.contactForm?.kvkkText || rawContent.ContactForm?.KvkkText || '',
          kvkkLinkText: rawContent.contactForm?.kvkkLinkText || rawContent.ContactForm?.KvkkLinkText || ''
        },
        socialMedia: (rawContent.socialMedia || rawContent.SocialMedia || []).map((social: any) => ({
          name: social.name || social.Name || '',
          url: social.url || social.Url || '',
          icon: social.icon || social.Icon || ''
        }))
      };

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
   * Save typed contact page content
   */
  async saveContactPageContent(
    brandId: number,
    content: ContactPageContent
  ): Promise<ApiResponse<ContentPageDto>> {
    return this.saveContentPage(
      brandId,
      'Contact',
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