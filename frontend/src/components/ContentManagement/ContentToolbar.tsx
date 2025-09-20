import React, { useState, useRef } from 'react';
import Button from '../Base/Button';
import { UseContentManagerReturn } from '../../hooks/useContentManager';
import { ContentBackup } from '../../services/contentService';

interface ContentToolbarProps {
  contentManager: UseContentManagerReturn;
  pageTitle: string;
}

const ContentToolbar: React.FC<ContentToolbarProps> = ({ contentManager, pageTitle }) => {
  const [showBackups, setShowBackups] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<ContentBackup | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    validation,
    saveContent,
    exportContent,
    importContent,
    backups,
    createBackup,
    restoreFromBackup,
    generatePreview,
    validateContent
  } = contentManager;

  const handleSave = async () => {
    const result = await saveContent();
    if (result.success) {
      alert('✅ ' + result.message);
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleValidate = () => {
    const result = validateContent();
    if (result.isValid) {
      alert('✅ İçerik geçerli' + (result.warnings?.length ? `\n\n⚠️ Uyarılar:\n${result.warnings.join('\n')}` : ''));
    } else {
      alert('❌ İçerik geçerli değil:\n\n' + result.errors.join('\n'));
    }
  };

  const handleCreateBackup = async () => {
    const description = prompt('Yedek açıklaması (isteğe bağlı):');
    if (description !== null) {
      try {
        await createBackup(description || undefined);
        alert('✅ Yedek oluşturuldu');
      } catch (error) {
        alert('❌ Yedek oluşturulamadı: ' + (error as Error).message);
      }
    }
  };

  const handleRestoreBackup = async (backup: ContentBackup) => {
    if (hasUnsavedChanges) {
      const confirmed = confirm('Kaydedilmemiş değişiklikler var. Yedekten geri yüklemek istediğinizden emin misiniz?');
      if (!confirmed) return;
    }

    try {
      const result = await restoreFromBackup(backup);
      if (result.success) {
        alert('✅ Yedekten geri yüklendi');
        setShowBackups(false);
        setSelectedBackup(null);
      } else {
        alert('❌ Geri yükleme başarısız: ' + result.message);
      }
    } catch (error) {
      alert('❌ Geri yükleme hatası: ' + (error as Error).message);
    }
  };

  const handleDeleteBackup = async (backup: ContentBackup) => {
    const confirmed = confirm(`"${backup.description || 'İsimsiz yedek'}" yedeğini silmek istediğinizden emin misiniz?`);
    if (!confirmed) return;

    try {
      const deleted = contentManager.deleteBackup(backup.id);
      if (deleted) {
        alert('✅ Yedek silindi');
        setSelectedBackup(null);
      } else {
        alert('❌ Yedek silinemedi');
      }
    } catch (error) {
      alert('❌ Yedek silme hatası: ' + (error as Error).message);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (hasUnsavedChanges) {
      const confirmed = confirm('Kaydedilmemiş değişiklikler var. İçe aktarmaya devam etmek istediğinizden emin misiniz?');
      if (!confirmed) return;
    }

    try {
      await importContent(file);
      alert('✅ İçerik başarıyla içe aktarıldı');
      setShowImport(false);
    } catch (error) {
      alert('❌ İçe aktarma hatası: ' + (error as Error).message);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreview = () => {
    const { previewData, previewUrl } = generatePreview();

    // Open preview in a new window/tab
    const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');

    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Önizleme - ${pageTitle}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .preview-header {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              margin-bottom: 20px;
              border-left: 4px solid #3b82f6;
            }
            .preview-content {
              background: #fff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .section {
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .section:last-child {
              border-bottom: none;
            }
            .section-title {
              color: #1f2937;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 15px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-weight: 500;
              color: #374151;
              margin-bottom: 5px;
            }
            .field-value {
              color: #6b7280;
              padding: 8px 12px;
              background: #f3f4f6;
              border-radius: 4px;
              border: 1px solid #d1d5db;
            }
            .array-item {
              background: #f8fafc;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 10px;
              border-left: 3px solid #06b6d4;
            }
            .close-btn {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #ef4444;
              color: white;
              border: none;
              padding: 10px 15px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
              z-index: 1000;
            }
            .close-btn:hover {
              background: #dc2626;
            }
            img {
              max-width: 200px;
              height: auto;
              border-radius: 4px;
              border: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <button class="close-btn" onclick="window.close()">✕ Kapat</button>
          <div class="preview-header">
            <h1>📋 İçerik Önizleme: ${pageTitle}</h1>
            <p style="margin: 0; color: #6b7280;">Oluşturulma: ${new Date().toLocaleString('tr-TR')}</p>
          </div>
          <div class="preview-content">
            ${generatePreviewHTML(previewData)}
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    } else {
      // Fallback to console if popup is blocked
      console.log('Preview Data:', previewData);
      alert('📋 Popup engellendi. Önizleme verileri konsola yazdırıldı.');
    }
  };

  const generatePreviewHTML = (data: any, path: string = ''): string => {
    if (typeof data !== 'object' || data === null) {
      if (typeof data === 'string' && (data.includes('.jpg') || data.includes('.png') || data.includes('.svg'))) {
        return `<img src="${data}" alt="Preview Image" onerror="this.style.display='none'" />`;
      }
      return `<div class="field-value">${String(data)}</div>`;
    }

    if (Array.isArray(data)) {
      return data.map((item, index) => `
        <div class="array-item">
          <div class="field-label">Item ${index + 1}</div>
          ${generatePreviewHTML(item, `${path}[${index}]`)}
        </div>
      `).join('');
    }

    return Object.entries(data).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      return `
        <div class="section">
          <div class="section-title">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
          ${generatePreviewHTML(value, currentPath)}
        </div>
      `;
    }).join('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>

          {hasUnsavedChanges && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Kaydedilmemiş değişiklikler
            </span>
          )}

          {validation && !validation.isValid && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {validation.errors.length} hata
            </span>
          )}

          {validation && validation.isValid && validation.warnings?.length && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              {validation.warnings.length} uyarı
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Son kaydedilme: {lastSaved.toLocaleTimeString('tr-TR')}
            </span>
          )}

          <Button
            variant="soft-secondary"
            onClick={handleValidate}
          >
            Doğrula
          </Button>

          <Button
            variant="soft-secondary"
            onClick={handlePreview}
          >
            Önizleme
          </Button>

          <div className="relative">
            <Button
              variant="soft-secondary"
              onClick={() => setShowBackups(!showBackups)}
            >
              Yedekler ({backups.length})
            </Button>

            {showBackups && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Yedekler</h3>
                    <Button
                      variant="soft-primary"
                      onClick={handleCreateBackup}
                    >
                      Yeni Yedek
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {backups.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        Henüz yedek yok
                      </p>
                    ) : (
                      backups.map((backup) => (
                        <div
                          key={backup.id}
                          className={`p-3 rounded border cursor-pointer transition-colors ${
                            selectedBackup?.id === backup.id
                              ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setSelectedBackup(backup)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {backup.description || 'İsimsiz yedek'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {backup.timestamp.toLocaleString('tr-TR')}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {backup.version}
                              </p>
                            </div>
                            {selectedBackup?.id === backup.id && (
                              <div className="flex space-x-2">
                                <Button
                                  variant="soft-primary"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleRestoreBackup(backup);
                                  }}
                                >
                                  Geri Yükle
                                </Button>
                                <Button
                                  variant="soft-secondary"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleDeleteBackup(backup);
                                  }}
                                >
                                  Sil
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="soft-secondary"
              onClick={() => setShowImport(!showImport)}
            >
              İçe/Dışa Aktar
            </Button>

            {showImport && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 space-y-3">
                  <Button
                    variant="soft-secondary"
                    onClick={exportContent}
                    className="w-full"
                  >
                    Dışa Aktar
                  </Button>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportFile}
                      accept=".json"
                      className="hidden"
                    />
                    <Button
                      variant="soft-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      İçe Aktar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showBackups || showImport) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowBackups(false);
            setShowImport(false);
          }}
        />
      )}
    </div>
  );
};

export default ContentToolbar;