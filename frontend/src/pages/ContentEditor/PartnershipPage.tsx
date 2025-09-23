import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import ImageInput from '../../components/ImageInput';

interface Partner {
  id: string;
  logo: string;
  title: string;
  alt: string;
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

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      logo: "",
      title: "",
      alt: ""
    };
    setContent(prev => ({
      ...prev,
      partners: [...prev.partners, newPartner]
    }));
  };

  const removePartner = (index: number) => {
    setContent(prev => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index)
    }));
  };

  const movePartner = (index: number, direction: 'up' | 'down') => {
    const newPartners = [...content.partners];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newPartners.length) {
      [newPartners[index], newPartners[newIndex]] = [newPartners[newIndex], newPartners[index]];
      setContent(prev => ({
        ...prev,
        partners: newPartners
      }));
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

  const handleSave = async () => {
    const validation = validateContent();

    if (!validation.isValid) {
      alert('Lütfen şu hataları düzeltin:\n\n' + validation.errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement API call to save content
      console.log('Saving content:', content);
      // await api.savePageContent('partnership', content);
      alert('İçerik başarıyla kaydedildi!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Partnerlik İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Partnerlik sayfası içeriklerini düzenleyin
        </p>
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