import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import { contentService, TarifelerPageContent } from '../../services/content';

interface TariffCard {
  isCampaign: boolean;
  badge: string;
  title: string;
  oldPrice: string;
  currentPrice: string;
  validityText: string;
}

const initialContent: TarifelerPageContent = {
  meta: {
    title: "Tarifeler - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  pageHeader: {
    title: "Tarifeler",
    description: "Ovolt, elektrikli aracınız için yüksek kaliteli, güvenilir ve erişilebilir şarj çözümleri sunar."
  },
  tariffs: {
    cards: [
      {
        isCampaign: true,
        badge: "Kampanyalı Tarife",
        title: "AC Soket Tarifesi",
        oldPrice: "₺10.99",
        currentPrice: "₺8.99",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir"
      },
      {
        isCampaign: true,
        badge: "Kampanyalı Tarife",
        title: "60 kW'a Kadar Tüm DC Soketler",
        oldPrice: "₺11.99",
        currentPrice: "₺9.99",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir"
      },
      {
        isCampaign: true,
        badge: "Kampanyalı Tarife",
        title: "Diğer Tüm DC Soketler",
        oldPrice: "₺13.99",
        currentPrice: "₺11.99",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir"
      }
    ]
  }
};

const TarifelerPageEditor: React.FC = () => {
  const [content, setContent] = useState<TarifelerPageContent | null>(initialContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());
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
      const response = await contentService.getTarifelerPageContent(actualBrandId);

      let finalContent = initialContent;

      if (response.ok && response.data) {
        finalContent = {
          ...initialContent,
          ...response.data,
          tariffs: {
            cards: response.data.tariffs && response.data.tariffs.cards && response.data.tariffs.cards.length > 0
              ? response.data.tariffs.cards
              : initialContent.tariffs.cards
          }
        };
      }

      setContent(finalContent);
    } catch (err) {
      setContent(initialContent);
      setError('İçerik yüklenirken bir hata oluştu');
      console.error('Content load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (section: keyof TarifelerPageContent, field: string, value: any) => {
    setContent(prev => {
      if (!prev) return initialContent;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const updateTariffCard = (index: number, field: keyof TariffCard, value: string | boolean) => {
    const currentCards = content?.tariffs?.cards || initialContent.tariffs.cards;
    const newCards = [...currentCards];
    if (field === 'isCampaign') {
      newCards[index] = {
        ...newCards[index],
        isCampaign: value as boolean,
        badge: value ? "Kampanyalı Tarife" : "Normal Tarife"
      };
    } else {
      newCards[index] = { ...newCards[index], [field]: value as string };
    }
    setContent(prev => {
      if (!prev) return initialContent;
      return {
        ...prev,
        tariffs: { ...prev.tariffs, cards: newCards }
      };
    });
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content?.meta?.title?.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content?.pageHeader?.title?.trim()) {
      errors.push('Sayfa ana başlığı boş olamaz');
    }

    content?.tariffs?.cards?.forEach((card, index) => {
      if (!card?.title?.trim()) {
        errors.push(`Tarife ${index + 1} başlığı boş olamaz`);
      }
      if (!card?.currentPrice?.trim()) {
        errors.push(`Tarife ${index + 1} güncel fiyatı boş olamaz`);
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
      if (!content) {
        throw new Error('İçerik bulunamadı');
      }

      const response = await contentService.saveTarifelerPageContent(currentBrandId, content);

      if (response.ok) {
        setLastSavedAt(new Date());
        alert('İçerik başarıyla kaydedildi!');
      } else {
        throw new Error(response.error?.message || 'Kaydetme başarısız');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      alert('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">İçerik yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tarifeler Sayfası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tarifeler sayfası içeriklerini düzenleyin
        </p>
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
              Tarifeler
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
                  <div>
                    <FormLabel>Ana Başlık</FormLabel>
                    <FormInput
                      value={content?.pageHeader?.title || ''}
                      onChange={(e) => updateContent('pageHeader', 'title', e.target.value)}
                      placeholder="Tarifeler"
                    />
                  </div>
                  <div>
                    <FormLabel>Sayfa Açıklaması</FormLabel>
                    <FormTextarea
                      value={content?.pageHeader?.description || ''}
                      onChange={(e) => updateContent('pageHeader', 'description', e.target.value)}
                      rows={3}
                      placeholder="Ovolt, elektrikli aracınız için yüksek kaliteli, güvenilir ve erişilebilir şarj çözümleri sunar."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Hero Bölümü */}
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
              <div className="space-y-6">
                {(content?.tariffs?.cards || []).map((card, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Tarife {index + 1}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`campaign-${index}`}
                          checked={card?.isCampaign || false}
                          onChange={(e) => updateTariffCard(index, 'isCampaign', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <FormLabel htmlFor={`campaign-${index}`} className="cursor-pointer">Kampanyalı Tarife</FormLabel>
                      </div>
                      <div>
                        <FormLabel>Rozet Metni</FormLabel>
                        <FormInput
                          value={card?.badge || ''}
                          onChange={(e) => updateTariffCard(index, 'badge', e.target.value)}
                          placeholder={card?.isCampaign ? "Kampanyalı Tarife" : "Normal Tarife"}
                          readOnly
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <FormLabel>Başlık</FormLabel>
                        <FormInput
                          value={card?.title || ''}
                          onChange={(e) => updateTariffCard(index, 'title', e.target.value)}
                          placeholder="AC Soket Tarifesi"
                        />
                      </div>
                      {card?.isCampaign && (
                        <div>
                          <FormLabel>Eski Fiyat</FormLabel>
                          <FormInput
                            value={card?.oldPrice || ''}
                            onChange={(e) => updateTariffCard(index, 'oldPrice', e.target.value)}
                            placeholder="₺10.99"
                          />
                        </div>
                      )}
                      <div>
                        <FormLabel>{card?.isCampaign ? 'Güncel Fiyat' : 'Fiyat'}</FormLabel>
                        <FormInput
                          value={card?.currentPrice || ''}
                          onChange={(e) => updateTariffCard(index, 'currentPrice', e.target.value)}
                          placeholder="₺8.99"
                        />
                      </div>
                      {card?.isCampaign && (
                        <div>
                          <FormLabel>Geçerlilik Metni</FormLabel>
                          <FormTextarea
                            value={card?.validityText || ''}
                            onChange={(e) => updateTariffCard(index, 'validityText', e.target.value)}
                            rows={2}
                            placeholder="30-31 ağustos tarihleri arasında geçerlidir"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {lastSavedAt && (
              <>Son kaydedilme: {lastSavedAt.toLocaleString('tr-TR')}</>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TarifelerPageEditor;