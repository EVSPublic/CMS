import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService } from '../../services/content';
import { useScrollEffect } from '../../hooks/useScrollEffect';

interface StationMapPageContent {
  Meta: {
    Title: string;
    Description: string;
    Keywords: string;
  };
  PageHero: {
    BackgroundImage: string;
    LogoImage: string;
    LogoAlt: string;
  };
  Header: {
    Title: string;
    Count: number;
    CountText: string;
    LogoImage: string;
    Description: string;
  };
  Map: {
    Provider: 'openstreetmap' | 'google';
    Height: number;
    Zoom: number;
    Latitude: number;
    Longitude: number;
    GoogleMapsApiKey?: string;
  };
}

const initialContent: StationMapPageContent = {
  Meta: {
    Title: "İstasyon Haritası - Ovolt",
    Description: "",
    Keywords: ""
  },
  PageHero: {
    BackgroundImage: "assets/img/istasyon-haritasi-bg.jpg",
    LogoImage: "assets/img/page-hero-logo.svg",
    LogoAlt: "Ovolt Logo"
  },
  Header: {
    Title: "İstasyon Haritası",
    Count: 1880,
    CountText: "Şarj İstasyonu",
    LogoImage: "assets/img/station-map.svg",
    Description: "Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
  },
  Map: {
    Provider: 'openstreetmap',
    Height: 600,
    Zoom: 6,
    Latitude: 39.9334,
    Longitude: 32.8597,
    GoogleMapsApiKey: ''
  }
};

const IstasyonHaritasiPageEditor: React.FC = () => {
  const [content, setContent] = useState<StationMapPageContent>(initialContent);
  const isScrolled = useScrollEffect();
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
      // Load content from API
      const response = await contentService.getContentPage(actualBrandId, 'StationMap');

      if (response.ok && response.data) {
        const apiContent = response.data.content;

        // Load statistics to get real station count (for display only)
        const statsResponse = await contentService.getBrandStatistics(actualBrandId);

        if (statsResponse.ok && statsResponse.data) {
          setRealStationCount(statsResponse.data.formattedCount);
        }

        // Use the saved content from database without overwriting Count
        setContent(apiContent);
      } else {
        setContent(initialContent);
        setError('İçerik yüklenirken bir hata oluştu');
      }
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

    if (!content.Meta.Title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content.Header.Title.trim()) {
      errors.push('Harita başlığı boş olamaz');
    }

    if (!content.Header.Description.trim()) {
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
      const response = await contentService.updateContentPage(currentBrandId, 'StationMap', {
        content: content,
        metaTitle: content.Meta.Title,
        metaDescription: content.Meta.Description,
        metaKeywords: content.Meta.Keywords
      });

      if (response.ok) {
        loadContent(); // Reload to get updated data
      } else {
        alert('Kaydetme sırasında bir hata oluştu!');
      }
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
        <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
          isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
        }`}>
          İstasyon Haritası İçerik Editörü
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
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
                  <FormLabel htmlFor="Meta.Title">Sayfa Başlığı</FormLabel>
                  <FormInput
                    id="Meta.Title"
                    value={content.Meta.Title}
                    onChange={(e) => updateContent('Meta.Title', e.target.value)}
                    placeholder="İstasyon Haritası - Ovolt"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="Meta.Description">Açıklama</FormLabel>
                  <FormTextarea
                    id="Meta.Description"
                    value={content.Meta.Description}
                    onChange={(e) => updateContent('Meta.Description', e.target.value)}
                    placeholder="Sayfa açıklamasını girin"
                    rows={3}
                  />
                </div>

                <div>
                  <FormLabel htmlFor="Meta.Keywords">Anahtar Kelimeler</FormLabel>
                  <FormTextarea
                    id="Meta.Keywords"
                    value={content.Meta.Keywords}
                    onChange={(e) => updateContent('Meta.Keywords', e.target.value)}
                    placeholder="Anahtar kelimeleri virgülle ayırarak girin"
                    rows={2}
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İstasyon Sayısı</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel htmlFor="Header.Count">İstasyon Sayısı</FormLabel>
                      <FormInput
                        id="Header.Count"
                        type="number"
                        value={content.Header.Count}
                        onChange={(e) => updateContent('Header.Count', parseInt(e.target.value) || 0)}
                        placeholder="1880"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Gerçek istasyon sayısı: {realStationCount}
                      </p>
                    </div>

                    <div>
                      <FormLabel htmlFor="Header.CountText">İstasyon Sayısı Açıklama Metni</FormLabel>
                      <FormInput
                        id="Header.CountText"
                        value={content.Header.CountText}
                        onChange={(e) => updateContent('Header.CountText', e.target.value)}
                        placeholder="Şarj İstasyonu"
                      />
                    </div>
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
                      value={content.PageHero.BackgroundImage}
                      onChange={(url) => updateContent('PageHero.BackgroundImage', url)}
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
                  <FormLabel htmlFor="Header.Title">Ana Başlık</FormLabel>
                  <FormInput
                    id="Header.Title"
                    value={content.Header.Title}
                    onChange={(e) => updateContent('Header.Title', e.target.value)}
                    placeholder="İstasyon Haritası"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="Header.Description">Açıklama</FormLabel>
                  <FormTextarea
                    id="Header.Description"
                    value={content.Header.Description}
                    onChange={(e) => updateContent('Header.Description', e.target.value)}
                    rows={4}
                    placeholder="Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Harita Ayarları</h3>

                  <div className="space-y-4">
                    <div>
                      <FormLabel>Harita Sağlayıcısı</FormLabel>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="mapProvider"
                            value="openstreetmap"
                            checked={content.Map.Provider === 'openstreetmap'}
                            onChange={(e) => updateContent('Map.Provider', e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">OpenStreetMap (Ücretsiz)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="mapProvider"
                            value="google"
                            checked={content.Map.Provider === 'google'}
                            onChange={(e) => updateContent('Map.Provider', e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Google Maps</span>
                        </label>
                      </div>
                    </div>

                    {content.Map.Provider === 'google' && (
                      <div>
                        <FormLabel htmlFor="Map.GoogleMapsApiKey">Google Maps API Anahtarı</FormLabel>
                        <FormInput
                          id="Map.GoogleMapsApiKey"
                          value={content.Map.GoogleMapsApiKey || ''}
                          onChange={(e) => updateContent('Map.GoogleMapsApiKey', e.target.value)}
                          placeholder="Google Maps API anahtarını girin"
                          type="password"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Google Maps kullanmak için bir API anahtarı gereklidir. <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">API anahtarı alın</a>
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="Map.Latitude">Enlem (Latitude)</FormLabel>
                        <FormInput
                          id="Map.Latitude"
                          type="number"
                          step="0.000001"
                          value={content.Map.Latitude}
                          onChange={(e) => updateContent('Map.Latitude', parseFloat(e.target.value))}
                          placeholder="39.9334"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Haritanın merkez enlem koordinatı
                        </p>
                      </div>

                      <div>
                        <FormLabel htmlFor="Map.Longitude">Boylam (Longitude)</FormLabel>
                        <FormInput
                          id="Map.Longitude"
                          type="number"
                          step="0.000001"
                          value={content.Map.Longitude}
                          onChange={(e) => updateContent('Map.Longitude', parseFloat(e.target.value))}
                          placeholder="32.8597"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Haritanın merkez boylam koordinatı
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="Map.Zoom">Yakınlaştırma (Zoom)</FormLabel>
                        <FormInput
                          id="Map.Zoom"
                          type="number"
                          min="1"
                          max="20"
                          step="0.1"
                          value={content.Map.Zoom}
                          onChange={(e) => updateContent('Map.Zoom', parseFloat(e.target.value))}
                          placeholder="6"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          1 (en uzak) - 20 (en yakın)
                        </p>
                      </div>

                      <div>
                        <FormLabel htmlFor="Map.Height">Harita Yüksekliği (px)</FormLabel>
                        <FormInput
                          id="Map.Height"
                          type="number"
                          min="400"
                          max="1200"
                          step="50"
                          value={content.Map.Height}
                          onChange={(e) => updateContent('Map.Height', parseInt(e.target.value))}
                          placeholder="600"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Piksel cinsinden yükseklik
                        </p>
                      </div>
                    </div>
                  </div>
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