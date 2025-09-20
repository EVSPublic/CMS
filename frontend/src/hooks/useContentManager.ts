import { useState, useEffect, useCallback } from 'react';
import {
  contentService,
  ContentValidationResult,
  ContentSaveResult,
  ContentBackup,
  pageValidationRules
} from '../services/contentService';

export interface UseContentManagerOptions {
  pageId: string;
  initialContent: any;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export interface UseContentManagerReturn {
  content: any;
  setContent: (content: any) => void;
  updateContent: (path: string, value: any) => void;

  // Validation
  validation: ContentValidationResult | null;
  validateContent: () => ContentValidationResult;

  // Saving
  isSaving: boolean;
  lastSaved: Date | null;
  saveContent: () => Promise<ContentSaveResult>;
  hasUnsavedChanges: boolean;

  // Backup/Restore
  backups: ContentBackup[];
  createBackup: (description?: string) => Promise<ContentBackup>;
  restoreFromBackup: (backup: ContentBackup) => Promise<ContentSaveResult>;
  refreshBackups: () => void;
  deleteBackup: (backupId: string) => boolean;

  // Import/Export
  exportContent: () => void;
  importContent: (file: File) => Promise<void>;

  // Preview
  generatePreview: () => { previewUrl?: string; previewData: any };

  // Loading
  isLoading: boolean;
  loadContent: () => Promise<void>;
}

export const useContentManager = (options: UseContentManagerOptions): UseContentManagerReturn => {
  const { pageId, initialContent, autoSave = false, autoSaveInterval = 30000 } = options;

  const [content, setContentState] = useState(initialContent);
  const [validation, setValidation] = useState<ContentValidationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [backups, setBackups] = useState<ContentBackup[]>([]);
  const [originalContent, setOriginalContent] = useState(initialContent);

  // Enhanced content setter that tracks changes
  const setContent = useCallback((newContent: any) => {
    setContentState(newContent);
    setHasUnsavedChanges(JSON.stringify(newContent) !== JSON.stringify(originalContent));

    // Clear validation when content changes
    if (validation) {
      setValidation(null);
    }
  }, [originalContent, validation]);

  // Update content by path helper
  const updateContent = useCallback((path: string, value: any) => {
    const keys = path.split('.');
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  }, [content, setContent]);

  // Enhanced validation
  const validateContent = useCallback((): ContentValidationResult => {
    const rules = pageValidationRules[pageId as keyof typeof pageValidationRules];
    const result = contentService.validateContent(content, rules);
    setValidation(result);
    return result;
  }, [content, pageId]);

  // Save content
  const saveContent = useCallback(async (): Promise<ContentSaveResult> => {
    // Validate before saving
    const validationResult = validateContent();
    if (!validationResult.isValid) {
      return {
        success: false,
        message: 'İçerik geçerli değil: ' + validationResult.errors.join(', ')
      };
    }

    setIsSaving(true);
    try {
      const result = await contentService.saveContent(pageId, content);

      if (result.success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        setOriginalContent(JSON.parse(JSON.stringify(content)));

        // Create automatic backup on successful save
        await createBackup(`Otomatik yedek - ${new Date().toLocaleString('tr-TR')}`);
      }

      return result;
    } finally {
      setIsSaving(false);
    }
  }, [content, pageId, validateContent]);

  // Load content
  const loadContent = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const loaded = await contentService.loadContent(pageId);
      if (loaded) {
        setContentState(loaded);
        setOriginalContent(loaded);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  // Create backup
  const createBackup = useCallback(async (description?: string): Promise<ContentBackup> => {
    const backup = await contentService.createBackup(pageId, content, description);
    refreshBackups();
    return backup;
  }, [pageId, content]);

  // Restore from backup
  const restoreFromBackup = useCallback(async (backup: ContentBackup): Promise<ContentSaveResult> => {
    const result = await contentService.restoreFromBackup(backup);
    if (result.success) {
      setContent(backup.content);
      setLastSaved(new Date());
    }
    return result;
  }, [setContent]);

  // Refresh backups
  const refreshBackups = useCallback(() => {
    const pageBackups = contentService.getBackups(pageId);
    setBackups(pageBackups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [pageId]);

  // Export content
  const exportContent = useCallback(() => {
    const blob = contentService.exportContent(pageId, content);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageId}-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pageId, content]);

  // Import content
  const importContent = useCallback(async (file: File): Promise<void> => {
    try {
      const imported = await contentService.importContent(file);
      if (imported.pageId === pageId) {
        setContent(imported.content);
      } else {
        throw new Error(`Bu dosya ${imported.pageId} sayfası için, ${pageId} için değil`);
      }
    } catch (error) {
      throw error;
    }
  }, [pageId, setContent]);

  // Generate preview
  const generatePreview = useCallback(() => {
    return contentService.generatePreview(pageId, content);
  }, [pageId, content]);

  // Delete backup
  const deleteBackup = useCallback((backupId: string): boolean => {
    const result = contentService.deleteBackup(pageId, backupId);
    if (result) {
      refreshBackups();
    }
    return result;
  }, [pageId, refreshBackups]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      saveContent().catch(console.error);
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [autoSave, hasUnsavedChanges, autoSaveInterval, saveContent]);

  // Load initial content and backups
  useEffect(() => {
    loadContent();
    refreshBackups();
  }, [pageId]);

  // Warning on page unload with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Kaydedilmemiş değişiklikler var. Sayfadan çıkmak istediğinizden emin misiniz?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    content,
    setContent,
    updateContent,

    validation,
    validateContent,

    isSaving,
    lastSaved,
    saveContent,
    hasUnsavedChanges,

    backups,
    createBackup,
    restoreFromBackup,
    refreshBackups,

    exportContent,
    importContent,

    generatePreview,

    isLoading,
    loadContent,
    deleteBackup
  };
};