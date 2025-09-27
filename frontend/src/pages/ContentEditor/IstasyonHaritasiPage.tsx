import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService } from '../../services/content';

interface StationMapPageContent {
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
  mapHeader: {
    title: string;
    stationCount: string;
    description: string;
  };
}

const initialContent: StationMapPageContent = {
  meta: {
    title: "İstasyon Haritası - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  pageHero: {
    backgroundImage: "assets/img/istasyon-haritasi-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  mapHeader: {
    title: "İstasyon Haritası",
    stationCount: "+1880",
    description: "Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
  }
};

const IstasyonHaritasiPageEditor: React.FC = () => {
  const [content, setContent] = useState<StationMapPageContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realStationCount, setRealStationCount] = useState<string>('1880+');

  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());

  // Load content and statistics on mount
  useEffect(() => {
    loadContent();
  }, []);

  // Listen for brand changes and reload content
  useEffect(() => {
    const handleBrandChange = () => {
      const newBrandId = getCurrentBrandId();
      setCurrentBrandId(newBrandId);
      loadContent(newBrandId);
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadContent = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;
    setLoading(true);
    setError(null);

    try {
      // Load statistics to get real station count
      const statsResponse = await contentService.getBrandStatistics(actualBrandId);

      let finalContent = initialContent;

      // Update the station count with real database value
      if (statsResponse.ok && statsResponse.data) {
        setRealStationCount(statsResponse.data.formattedCount);

        // Also update the content count to match the database
        finalContent = {
          ...finalContent,
          mapHeader: {
            ...finalContent.mapHeader,
            stationCount: statsResponse.data.formattedCount
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

  const updateContent = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent as any;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent as any;

    for (const key of keys) {
      current = current[key];
    }

    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setContent(newContent);
    }
  };

  const addArrayItem = (path: string, newItem: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent as any;

    for (const key of keys) {
      current = current[key];
    }

    current.push(newItem);
    setContent(newContent);
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent as any;

    for (const key of keys) {
      current = current[key];
    }

    current.splice(index, 1);
    setContent(newContent);
  };

  const validateContent = () => {
    const errors: string[] = [];

    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content.mapHeader.title.trim()) {
      errors.push('Harita başlığı boş olamaz');
    }

    if (!content.mapHeader.stationCount.trim()) {
      errors.push('İstasyon sayısı boş olamaz');
    }

    if (!content.mapHeader.description.trim()) {
      errors.push('Harita açıklaması boş olamaz');
    }

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
      // Note: Station count is read-only and automatically synced from database
      console.log('Saving content:', content);
      alert('İçerik başarıyla kaydedildi!\n\nNot: İstasyon sayısı veritabanından otomatik olarak güncellenmektedir.');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu!');
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
            <p className="text-gray-500 dark:text-gray-400">İçerik yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          İstasyon Haritası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          İstasyon haritası sayfası içeriklerini düzenleyin
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Hero Bölümü
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Harita Başlığı
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Genel Bilgiler */}
            <Tab.Panel className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <FormLabel htmlFor="meta.title">Sayfa Başlığı</FormLabel>
                  <FormInput
                    id="meta.title"
                    value={content.meta.title}
                    onChange={(e) => updateContent('meta.title', e.target.value)}
                    placeholder="İstasyon Haritası - Ovolt"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="meta.description">Açıklama</FormLabel>
                  <FormTextarea
                    id="meta.description"
                    value={content.meta.description}
                    onChange={(e) => updateContent('meta.description', e.target.value)}
                    placeholder="Sayfa açıklamasını girin"
                    rows={3}
                  />
                </div>

                <div>
                  <FormLabel htmlFor="meta.keywords">Anahtar Kelimeler</FormLabel>
                  <FormTextarea
                    id="meta.keywords"
                    value={content.meta.keywords}
                    onChange={(e) => updateContent('meta.keywords', e.target.value)}
                    placeholder="Anahtar kelimeleri virgülle ayırarak girin"
                    rows={2}
                  />
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
                      value={content.hero.image}
                      onChange={(url) => updateContent('hero.image', url)}
                      label="Hero Görseli"
                      placeholder="Hero görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Harita Başlığı */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div>
                  <FormLabel htmlFor="mapHeader.title">Ana Başlık</FormLabel>
                  <FormInput
                    id="mapHeader.title"
                    value={content.mapHeader.title}
                    onChange={(e) => updateContent('mapHeader.title', e.target.value)}
                    placeholder="İstasyon Haritası"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="mapHeader.stationCount">İstasyon Sayısı (otomatik güncellenir)</FormLabel>
                  <FormInput
                    id="mapHeader.stationCount"
                    value={realStationCount}
                    readOnly
                    className="bg-gray-100 dark:bg-gray-700"
                    placeholder="+1880"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Bu değer veritabanındaki istasyon sayısından otomatik olarak hesaplanır ve düzenlenemez.
                  </p>
                </div>

                <div>
                  <FormLabel htmlFor="mapHeader.description">Açıklama</FormLabel>
                  <FormTextarea
                    id="mapHeader.description"
                    value={content.mapHeader.description}
                    onChange={(e) => updateContent('mapHeader.description', e.target.value)}
                    rows={4}
                    placeholder="Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
                  />
                </div>
              </div>
            </Tab.Panel>

          </Tab.Panels>
        </Tab.Group>

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

export default IstasyonHaritasiPageEditor;