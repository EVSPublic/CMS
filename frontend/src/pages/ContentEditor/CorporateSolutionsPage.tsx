import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService, CorporateSolutionsPageContent } from '../../services/content';
import { useScrollEffect } from '../../hooks/useScrollEffect';


// Helper function to get initial business cards based on brand
const getInitialBusinessCards = (brandId: number) => {
  const ovoltCards = [
    {
      image: "",
      title: "Ağ Entegrasyonu",
      content: "Şarj ünitelerinizi Ovolt ağına dahil ederek, işletmenizin gelir modeline katkı sağlıyoruz."
    },
    {
      image: "",
      title: "Filo Dönüşüm Desteği",
      content: "Akaryakıttan elektriğe geçiş sürecinizde Ovolt çözümleriyle yanınızdayız."
    },
    {
      image: "",
      title: "Merkezi Yönetim",
      content: "Şarj ünitelerinizi kolayca yönetebileceğiniz, kullanım raporlarına erişebileceğiniz gelişmiş bir yazılım paneli sunuyoruz."
    }
  ];

  const sharzCards = [
    ...ovoltCards,
    {
      image: "",
      title: "Kart 4",
      content: ""
    },
    {
      image: "",
      title: "Kart 5",
      content: ""
    },
    {
      image: "",
      title: "Kart 6",
      content: ""
    }
  ];

  return brandId === 2 ? sharzCards : ovoltCards;
};

const getInitialContent = (brandId: number): CorporateSolutionsPageContent => ({
  meta: {
    title: "Kurumsal Çözümler - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  mainSolution: {
    title: "Kurumsal Çözümler",
    description: "Ovolt, Opet iş birliği ile Türkiye genelinde hibrit enerji yaklaşımı sunarak, elektrik ve akaryakıt satışını bir arada buluşturuyor. Bu güçlü altyapı sayesinde, işletmeler hem elektrikli araç şarj hizmeti hem de akaryakıt çözümlerini tek noktadan yönetebiliyor.",
    image: ""
  },
  businessSolutions: {
    title: "İşletmelere Özel Çözümler",
    cards: getInitialBusinessCards(brandId)
  },
  managementCards: [
    {
      image: "",
      title: "Yönetim Paneli",
      content: "Şarj ünitelerinizin uzaktan yönetimi, kullanıcı tanımlamaları ve yetkilendirme işlemleri tek bir panel üzerinden yapılabilir."
    },
    {
      image: "",
      title: "Raporlama Paneli",
      content: "Tüm şarj işlemlerine ait detaylı veriler, grafiklerle desteklenmiş raporlarla kolayca görüntülenebilir."
    },
    {
      image: "",
      title: "Filo Paneli",
      content: "Filo müşterileri, araçlarını yönetebilir, şarj limitleri tanımlayabilir ve kullanım verilerini kontrol altında tutabilir."
    },
    {
      image: "",
      title: "Mobil Uygulama",
      content: "Kullanıcılar, şarj noktalarını harita üzerinden görüntüleyebilir, ünitelerde şarja başlayabilir ve ödemelerini kolayca yapabilir."
    }
  ]
});

const CorporateSolutionsPageEditor: React.FC = () => {
  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());
  const [content, setContent] = useState<CorporateSolutionsPageContent>(getInitialContent(currentBrandId));
  const isScrolled = useScrollEffect();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load content on component mount
  useEffect(() => {
    loadContent();
  }, []);

  // Listen for brand changes and reload content
  useEffect(() => {
    const handleBrandChange = () => {
      const newBrandId = getCurrentBrandId();
      setCurrentBrandId(newBrandId);
      loadContent(newBrandId); // Reload content for new brand with specific ID
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadContent = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;
    setLoading(true);
    setError(null);

    try {
      const response = await contentService.getCorporateSolutionsPageContent(actualBrandId);

      let finalContent = getInitialContent(actualBrandId);

      if (response.ok && response.data) {
        // Ensure we have the correct number of business cards
        const expectedCardCount = actualBrandId === 2 ? 6 : 3;
        const currentCardCount = response.data.businessSolutions?.cards?.length || 0;

        if (currentCardCount < expectedCardCount) {
          // Add missing cards
          const missingCards = expectedCardCount - currentCardCount;
          const additionalCards = Array.from({ length: missingCards }, (_, i) => ({
            image: "",
            title: `Kart ${currentCardCount + i + 1}`,
            content: ""
          }));

          finalContent = {
            ...response.data,
            businessSolutions: {
              ...response.data.businessSolutions,
              cards: [...(response.data.businessSolutions?.cards || []), ...additionalCards]
            }
          };
        } else {
          finalContent = response.data;
        }
      }

      setContent(finalContent);
    } catch (err) {
      setContent(getInitialContent(actualBrandId));
      setError('İçerik yüklenirken bir hata oluştu');
      console.error('Content load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (section: keyof CorporateSolutionsPageContent, field: string, value: any) => {
    setContent(prev => {
      if (!prev) return getInitialContent(currentBrandId);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const updateBusinessCard = (index: number, field: string, value: string) => {
    const currentCards = content?.businessSolutions?.cards || getInitialContent(currentBrandId).businessSolutions.cards;
    const newCards = [...currentCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setContent(prev => ({
      ...prev,
      businessSolutions: {
        ...prev.businessSolutions,
        title: prev.businessSolutions?.title || getInitialContent(currentBrandId).businessSolutions.title,
        cards: newCards
      }
    }));
  };

  const updateManagementCard = (index: number, field: string, value: string) => {
    const currentCards = content?.managementCards || getInitialContent(currentBrandId).managementCards;
    const newCards = [...currentCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setContent(prev => ({
      ...prev,
      managementCards: newCards
    }));
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content?.meta?.title?.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content?.mainSolution?.title?.trim()) {
      errors.push('Ana çözümler başlığı boş olamaz');
    }

    if (!content?.mainSolution?.description?.trim()) {
      errors.push('Ana çözümler açıklaması boş olamaz');
    }

    if (!content?.businessSolutions?.title?.trim()) {
      errors.push('İşletmeler çözümleri başlığı boş olamaz');
    }

    content?.businessSolutions?.cards?.forEach((card, index) => {
      if (!card.title.trim()) {
        errors.push(`İşletme kartı ${index + 1} başlığı boş olamaz`);
      }
      if (!card.content.trim()) {
        errors.push(`İşletme kartı ${index + 1} içeriği boş olamaz`);
      }
    });

    content?.managementCards?.forEach((card, index) => {
      if (!card.title.trim()) {
        errors.push(`Yönetim kartı ${index + 1} başlığı boş olamaz`);
      }
      if (!card.content.trim()) {
        errors.push(`Yönetim kartı ${index + 1} içeriği boş olamaz`);
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

    setSaving(true);
    setError(null);

    try {
      const response = await contentService.saveCorporateSolutionsPageContent(currentBrandId, content);

      if (response.ok) {
        setLastSavedAt(new Date());
        alert('İçerik başarıyla kaydedildi!');
      } else {
        setError(response.error?.message || 'İçerik kaydedilemedi');
        alert('İçerik kaydedilirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('İçerik kaydedilirken bir hata oluştu');
      alert('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Lucide icon="Loader2" className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-500 dark:text-gray-400">İçerik yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
            }`}>
              Kurumsal Çözümler Sayfası İçerik Editörü
            </h1>
            <p className={`mt-1 text-sm transition-colors duration-300 ${
              isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
            }`}>
              Kurumsal çözümler sayfası içeriklerini düzenleyin
            </p>
          </div>
          {lastSavedAt && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Son kayıt: {lastSavedAt.toLocaleString('tr-TR')}
            </div>
          )}
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-md">
            <div className="flex items-center">
              <Lucide icon="AlertCircle" className="w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Hero Bölümü
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Ana Çözümler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İşletmelere Özel Çözümler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Yönetim Panelleri
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Genel Bilgiler</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Sayfa Başlığı</FormLabel>
                    <FormInput
                      value={content?.meta?.title || ''}
                      onChange={(e) => updateContent('meta', 'title', e.target.value)}
                      placeholder="Sayfa başlığını girin"
                    />
                  </div>
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.meta?.description || ''}
                      onChange={(e) => updateContent('meta', 'description', e.target.value)}
                      placeholder="Sayfa açıklamasını girin"
                      rows={3}
                    />
                  </div>
                  <div>
                    <FormLabel>Anahtar Kelimeler</FormLabel>
                    <FormTextarea
                      value={content?.meta?.keywords || ''}
                      onChange={(e) => updateContent('meta', 'keywords', e.target.value)}
                      placeholder="Anahtar kelimeleri virgülle ayırarak girin"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Hero Bölümü</h3>
                <div className="space-y-4">
                  <div>
                    <ImageInput
                      value={content?.hero?.image || ''}
                      onChange={(url) => updateContent('hero', 'image', url)}
                      label="Hero Görseli"
                      placeholder="Hero görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ana Çözümler Bölümü</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Ana Başlık</FormLabel>
                    <FormInput
                      value={content?.mainSolution?.title || ''}
                      onChange={(e) => updateContent('mainSolution', 'title', e.target.value)}
                      placeholder="Ana başlığı girin"
                    />
                  </div>
                  <div>
                    <FormLabel>Ana Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.mainSolution?.description || ''}
                      onChange={(e) => updateContent('mainSolution', 'description', e.target.value)}
                      placeholder="Ana açıklamayı girin"
                      rows={4}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content?.mainSolution?.image || ''}
                      onChange={(url) => updateContent('mainSolution', 'image', url)}
                      label="Ana Çözümler Görseli"
                      placeholder="Ana çözümler görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">İşletmelere Özel Çözümler</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Bölüm Başlığı</FormLabel>
                      <FormInput
                        value={content?.businessSolutions?.title || ''}
                        onChange={(e) => updateContent('businessSolutions', 'title', e.target.value)}
                        placeholder="İşletmelere Özel Çözümler"
                      />
                    </div>
                  </div>
                </div>

                {(content?.businessSolutions?.cards || getInitialContent(currentBrandId).businessSolutions.cards).map((card, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Kart {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <ImageInput
                          value={card?.image || ''}
                          onChange={(url) => updateBusinessCard(index, 'image', url)}
                          label={`Kart ${index + 1} Görseli`}
                          placeholder={`Kart ${index + 1} görseli seçin...`}
                        />
                      </div>
                      <div>
                        <FormLabel>Başlık</FormLabel>
                        <FormInput
                          value={card?.title || ''}
                          onChange={(e) => updateBusinessCard(index, 'title', e.target.value)}
                          placeholder={`Kart ${index + 1} başlığını girin`}
                        />
                      </div>
                      <div>
                        <FormLabel>İçerik</FormLabel>
                        <FormTextarea
                          value={card?.content || ''}
                          onChange={(e) => updateBusinessCard(index, 'content', e.target.value)}
                          placeholder={`Kart ${index + 1} içeriğini girin`}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                {(content?.managementCards || getInitialContent(currentBrandId).managementCards).map((card, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Kart {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Başlık</FormLabel>
                        <FormInput
                          value={card?.title || ''}
                          onChange={(e) => updateManagementCard(index, 'title', e.target.value)}
                          placeholder={`Kart ${index + 1} başlığını girin`}
                        />
                      </div>
                      <div>
                        <FormLabel>İçerik</FormLabel>
                        <FormTextarea
                          value={card?.content || ''}
                          onChange={(e) => updateManagementCard(index, 'content', e.target.value)}
                          placeholder={`Kart ${index + 1} içeriğini girin`}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CorporateSolutionsPageEditor;