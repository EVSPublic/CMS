import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { partnershipsService, Partner as ApiPartner } from '../../services/partnerships';

interface Partner {
  id: number;
  logo: string;
  title: string;
  alt: string;
  status?: string;
  displayOrder?: number;
}

interface PartnershipPageContent {
  partners: Partner[];
}

const initialContent: PartnershipPageContent = {
  partners: []
};

const PartnershipPageEditor: React.FC = () => {
  const [content, setContent] = useState<PartnershipPageContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());

  // Load partners on component mount
  useEffect(() => {
    loadPartners();
  }, []);

  // Listen for brand changes and reload partners
  useEffect(() => {
    const handleBrandChange = () => {
      const newBrandId = getCurrentBrandId();
      setCurrentBrandId(newBrandId);
      loadPartners(newBrandId);
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadPartners = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;
    setLoading(true);
    setError(null);

    try {
      const response = await partnershipsService.getPartners(actualBrandId);

      if (response.ok && response.data) {
        const apiPartners = response.data.partners;
        const convertedPartners: Partner[] = apiPartners.map(p => ({
          id: p.id,
          title: p.title,
          logo: p.logo || '',
          alt: p.alt || '',
          status: p.status,
          displayOrder: p.displayOrder
        }));

        setContent(prev => ({
          ...prev,
          partners: convertedPartners
        }));
      }
    } catch (err) {
      setError('Partnerler yüklenirken bir hata oluştu');
      console.error('Partners load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = (index: number, field: keyof Partner, value: string) => {
    const newPartners = [...content.partners];
    newPartners[index] = {
      ...newPartners[index],
      [field]: value
    };
    setContent(prev => ({
      ...prev,
      partners: newPartners
    }));
  };

  const addPartner = async () => {
    try {
      const response = await partnershipsService.createPartner({
        title: "Yeni Partner",
        logo: "",
        alt: "Yeni Partner"
      });

      if (response.ok) {
        await loadPartners(); // Reload to get updated list
      } else {
        alert('Partner eklenirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Add partner error:', error);
      alert('Partner eklenirken bir hata oluştu!');
    }
  };

  const removePartner = async (index: number) => {
    const partner = content.partners[index];
    if (partner && typeof partner.id === 'number') {
      if (confirm('Bu partneri silmek istediğinizden emin misiniz?')) {
        try {
          const response = await partnershipsService.deletePartner(partner.id);

          if (response.ok) {
            await loadPartners(); // Reload to get updated list
          } else {
            alert('Partner silinirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
          }
        } catch (error) {
          console.error('Delete partner error:', error);
          alert('Partner silinirken bir hata oluştu!');
        }
      }
    }
  };

  const movePartner = async (index: number, direction: 'up' | 'down') => {
    const newPartners = [...content.partners];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newPartners.length) {
      [newPartners[index], newPartners[newIndex]] = [newPartners[newIndex], newPartners[index]];

      // Update local state immediately for better UX
      setContent(prev => ({
        ...prev,
        partners: newPartners
      }));

      // Update order in backend
      try {
        const partnerIds = newPartners.map(p => p.id as number);
        const response = await partnershipsService.reorderPartners({ partnerIds });

        if (!response.ok) {
          // Revert on error
          await loadPartners();
          alert('Partner sıralaması değiştirilirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
        }
      } catch (error) {
        console.error('Reorder partners error:', error);
        await loadPartners(); // Revert on error
        alert('Partner sıralaması değiştirilirken bir hata oluştu!');
      }
    }
  };

  const validateContent = () => {
    const errors: string[] = [];

    content.partners.forEach((partner, index) => {
      if (!partner.title.trim()) {
        errors.push(`Partner ${index + 1} başlığı boş olamaz`);
      }
      if (!partner.alt.trim()) {
        errors.push(`Partner ${index + 1} alt metni boş olamaz`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const savePartner = async (partner: Partner) => {
    if (typeof partner.id === 'number') {
      try {
        const response = await partnershipsService.updatePartner(partner.id, {
          title: partner.title,
          logo: partner.logo,
          alt: partner.alt
        });

        if (!response.ok) {
          throw new Error(response.error?.message || 'Güncelleme başarısız');
        }
      } catch (error) {
        console.error('Update partner error:', error);
        throw error;
      }
    }
  };

  const handleSave = async () => {
    const validation = validateContent();

    if (!validation.isValid) {
      alert('Lütfen şu hataları düzeltin:\n\n' + validation.errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      // Save all partners
      const savePromises = content.partners.map(partner => savePartner(partner));
      await Promise.all(savePromises);

      await loadPartners(); // Reload to get updated data
      alert('Tüm partnerler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Lucide icon="Loader2" className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Partnerler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Partnerlik İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Partnerlik sayfası içeriklerini düzenleyin
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Partner Yönetimi</h3>
                  <Button
                    variant="primary"
                    onClick={addPartner}
                  >
                    Yeni Partner Ekle
                  </Button>
                </div>

                {content.partners.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      Henüz partner eklenmemiş. Yeni partner eklemek için yukarıdaki butonu kullanın.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.partners.map((partner, index) => (
                      <div key={partner.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Partner {index + 1}
                          </h4>
                          <div className="flex gap-1">
                            <Button
                              variant="soft-secondary"
                              onClick={() => movePartner(index, 'up')}
                              disabled={index === 0}
                              className="text-xs px-2 py-1"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="soft-secondary"
                              onClick={() => movePartner(index, 'down')}
                              disabled={index === content.partners.length - 1}
                              className="text-xs px-2 py-1"
                            >
                              ↓
                            </Button>
                            <Button
                              variant="soft-secondary"
                              onClick={() => removePartner(index)}
                              className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                            >
                              ×
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <FormLabel htmlFor={`partner-logo-${index}`} className="text-xs">Partner Logosu</FormLabel>
                            <ImageInput
                              value={partner.logo}
                              onChange={(url) => updatePartner(index, 'logo', url)}
                              placeholder="Logo seçin..."
                            />
                          </div>

                          <div>
                            <FormLabel htmlFor={`partner-title-${index}`} className="text-xs">Partner Adı</FormLabel>
                            <FormInput
                              id={`partner-title-${index}`}
                              value={partner.title}
                              onChange={(e) => updatePartner(index, 'title', e.target.value)}
                              placeholder="Partner adını girin"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <FormLabel htmlFor={`partner-alt-${index}`} className="text-xs">Alt Metni</FormLabel>
                            <FormInput
                              id={`partner-alt-${index}`}
                              value={partner.alt}
                              onChange={(e) => updatePartner(index, 'alt', e.target.value)}
                              placeholder="Logo alt metni girin"
                              className="text-sm"
                            />
                          </div>

                          {/* Logo Preview */}
                          {partner.logo && (
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-center">
                              <img
                                src={partner.logo}
                                alt={partner.alt || partner.title}
                                className="max-h-12 mx-auto object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPageEditor;