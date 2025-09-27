// Content Management Service
// Centralized service for managing page content data

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ContentSaveResult {
  success: boolean;
  message: string;
  timestamp?: Date;
  version?: string;
}

export interface ContentBackup {
  id: string;
  pageId: string;
  content: any;
  timestamp: Date;
  version: string;
  description?: string;
}

export class ContentService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Get current brand/project from localStorage
  private getCurrentBrand(): string {
    return localStorage.getItem('selectedBrand') || 'Ovolt';
  }

  // Generate brand-specific storage key
  private getStorageKey(pageId: string, suffix: string = ''): string {
    const brand = this.getCurrentBrand().toLowerCase().replace(/[^a-z0-9]/g, '-');
    return suffix ? `${brand}_${pageId}_${suffix}` : `${brand}_content_${pageId}`;
  }

  // Enhanced validation with warnings
  validateContent(content: any, validationRules: any): ContentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Generic validation helper
    const validateField = (
      obj: any,
      path: string,
      rules: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp }
    ) => {
      const keys = path.split('.');
      let value = obj;

      for (const key of keys) {
        value = value?.[key];
      }

      const fieldName = path.split('.').pop() || path;

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push(`${fieldName} alanı gereklidir`);
        return;
      }

      if (value && typeof value === 'string') {
        if (rules.minLength && value.trim().length < rules.minLength) {
          errors.push(`${fieldName} en az ${rules.minLength} karakter olmalıdır`);
        }

        if (rules.maxLength && value.trim().length > rules.maxLength) {
          warnings.push(`${fieldName} ${rules.maxLength} karakterden uzun, kesilerek gösterilebilir`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${fieldName} geçerli bir format değil`);
        }
      }
    };

    // Apply validation rules
    if (validationRules) {
      Object.entries(validationRules).forEach(([path, rules]) => {
        validateField(content, path, rules as any);
      });
    }

    // Check for empty arrays in dynamic content
    this.validateDynamicArrays(content, errors, warnings);

    // Check for missing images
    this.validateImages(content, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  private validateDynamicArrays(obj: any, errors: string[], warnings: string[], path: string = '') {
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        warnings.push(`${path} listesi boş`);
      }
      obj.forEach((item, index) => {
        this.validateDynamicArrays(item, errors, warnings, `${path}[${index}]`);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        this.validateDynamicArrays(value, errors, warnings, newPath);
      });
    }
  }

  private validateImages(obj: any, warnings: string[], path: string = '') {
    if (typeof obj === 'string' && (obj.includes('.jpg') || obj.includes('.png') || obj.includes('.svg'))) {
      if (obj.startsWith('assets/') && !obj.includes('placeholder')) {
        // This would be where we'd check if the image actually exists
        // For now, we'll assume they exist
      }
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        this.validateImages(value, warnings, newPath);
      });
    }
  }

  // Save content with proper error handling
  async saveContent(pageId: string, content: any): Promise<ContentSaveResult> {
    try {
      const payload = {
        pageId,
        content,
        timestamp: new Date().toISOString(),
        version: this.generateVersion()
      };

      // For now, save to localStorage as a fallback
      const storageKey = this.getStorageKey(pageId);
      localStorage.setItem(storageKey, JSON.stringify(payload));

      // TODO: Implement actual API call
      // const response = await fetch(`${this.baseUrl}/content/${pageId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      //   },
      //   body: JSON.stringify(payload)
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      //
      // const result = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: 'İçerik başarıyla kaydedildi',
        timestamp: new Date(),
        version: payload.version
      };

    } catch (error) {
      console.error('Content save error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Kaydetme sırasında bilinmeyen bir hata oluştu'
      };
    }
  }

  // Load content
  async loadContent(pageId: string): Promise<any> {
    try {
      // First try localStorage
      const storageKey = this.getStorageKey(pageId);
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.content;
      }

      // TODO: Implement actual API call
      // const response = await fetch(`${this.baseUrl}/content/${pageId}`, {
      //   headers: {
      //     ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      //   }
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      //
      // const result = await response.json();
      // return result.content;

      return null; // No content found
    } catch (error) {
      console.error('Content load error:', error);
      throw error;
    }
  }

  // Create backup
  async createBackup(pageId: string, content: any, description?: string): Promise<ContentBackup> {
    const backup: ContentBackup = {
      id: this.generateBackupId(),
      pageId,
      content: JSON.parse(JSON.stringify(content)), // Deep clone
      timestamp: new Date(),
      version: this.generateVersion(),
      description
    };

    // Save backup to localStorage
    const backups = this.getBackups(pageId);
    backups.push(backup);

    // Keep only last 10 backups per page
    if (backups.length > 10) {
      backups.splice(0, backups.length - 10);
    }

    // Serialize backups, converting Date objects to ISO strings
    const serializedBackups = backups.map(b => ({
      ...b,
      timestamp: b.timestamp.toISOString()
    }));

    localStorage.setItem(this.getStorageKey(pageId, 'backups'), JSON.stringify(serializedBackups));

    return backup;
  }

  // Get backups for a page
  getBackups(pageId: string): ContentBackup[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(pageId, 'backups'));
      if (!stored) return [];

      const backups = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return backups.map((backup: any) => ({
        ...backup,
        timestamp: new Date(backup.timestamp)
      }));
    } catch {
      return [];
    }
  }

  // Restore from backup
  async restoreFromBackup(backup: ContentBackup): Promise<ContentSaveResult> {
    try {
      const result = await this.saveContent(backup.pageId, backup.content);

      if (result.success) {
        // Create a restore point backup before restoring
        await this.createBackup(
          backup.pageId,
          backup.content,
          `Geri yüklendi: ${backup.description || backup.version} - ${backup.timestamp.toLocaleString('tr-TR')}`
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Yedekten geri yükleme başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
      };
    }
  }

  // Delete backup
  deleteBackup(pageId: string, backupId: string): boolean {
    try {
      const backups = this.getBackups(pageId);
      const filteredBackups = backups.filter(backup => backup.id !== backupId);

      if (filteredBackups.length === backups.length) {
        return false; // Backup not found
      }

      // Serialize backups, converting Date objects to ISO strings
      const serializedBackups = filteredBackups.map(b => ({
        ...b,
        timestamp: b.timestamp.toISOString()
      }));

      localStorage.setItem(this.getStorageKey(pageId, 'backups'), JSON.stringify(serializedBackups));
      return true;
    } catch {
      return false;
    }
  }

  // Generate version string
  private generateVersion(): string {
    const now = new Date();
    return `v${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  }

  // Generate backup ID
  private generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Preview content (generate preview URL or data)
  generatePreview(pageId: string, content: any): { previewUrl?: string; previewData: any } {
    // For now, return the content for preview
    // In a real implementation, this might generate a temporary preview URL
    return {
      previewData: content,
      // previewUrl: `${this.baseUrl}/preview/${pageId}?token=${this.generatePreviewToken()}`
    };
  }

  // Export content for backup
  exportContent(pageId: string, content: any): Blob {
    const exportData = {
      pageId,
      content,
      exportDate: new Date().toISOString(),
      version: this.generateVersion()
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  // Import content from file
  async importContent(file: File): Promise<{ pageId: string; content: any }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const imported = JSON.parse(result);

          if (!imported.pageId || !imported.content) {
            throw new Error('Geçersiz içerik dosyası formatı');
          }

          resolve({
            pageId: imported.pageId,
            content: imported.content
          });
        } catch (error) {
          reject(new Error('İçerik dosyası okunamadı: ' + (error as Error).message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Dosya okuma hatası'));
      };

      reader.readAsText(file);
    });
  }
}

// Create singleton instance
export const contentService = new ContentService();

// Export validation rules for each page type
export const pageValidationRules = {
  index: {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'hero.title': { required: true, minLength: 5, maxLength: 100 },
    'hero.subtitle': { required: true, minLength: 10, maxLength: 200 }
  },
  about: {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'about.title': { required: true, minLength: 5, maxLength: 100 },
    'about.description': { required: true, minLength: 20, maxLength: 500 }
  },
  'individual-solutions': {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'solution.title': { required: true, minLength: 5, maxLength: 100 }
  },
  'corporate-solutions': {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'solution.title': { required: true, minLength: 5, maxLength: 100 }
  },
  tarifeler: {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'pageHeader.title': { required: true, minLength: 3, maxLength: 50 },
    'pageHeader.description': { required: true, minLength: 10, maxLength: 300 }
  },
  iletisim: {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'contactInfo.title': { required: true, minLength: 3, maxLength: 50 },
    'contactInfo.email.address': { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    'contactInfo.phone.number': { required: true, minLength: 10 }
  },
  'istasyon-haritasi': {
    'meta.title': { required: true, minLength: 3, maxLength: 60 },
    'mapHeader.title': { required: true, minLength: 3, maxLength: 50 },
    'mapConfig.embedUrl': { required: true, pattern: /^https?:\/\/.+/ }
  }
};