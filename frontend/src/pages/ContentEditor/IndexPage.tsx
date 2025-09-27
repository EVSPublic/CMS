import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService, IndexPageContent } from '../../services/content';

const initialContent: IndexPageContent = {
  meta: {
    title: "Ovolt - Elektrikli Araç Şarj İstasyonu",
    description: "",
    keywords: ""
  },
  hero: {
    title: "Her Yolculukta\nYanınızda",
    mediaType: 'video',
    mediaUrl: "assets/video/hero-video.mp4",
    count: "1880+",
    countText: "Şarj İstasyonu ile Kesintisiz Enerji"
  },
  services: {
    title: "Hizmet Noktaları",
    content: "Opet istasyonları başta olmak üzere stratejik noktalarda konumlanan halka açık Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye her an ulaşabilirsiniz.",
    subtitle: "Hizmet Noktaları"
  },
  tariffs: {
    title: "Tarifeler",
    description: "Ovolt, geniş halka açık şarj istasyonu ağı ile elektrikli aracınız için rekabetçi ve şeffaf tarife seçenekleri sunar; böylece seyahatlerinizde maliyetlerinizi optimize ederken çevre dostu bir şekilde aracınızı güvenle şarj edebilirsiniz.",
    listTitle: "Tarife Seçenekleri"
  },
  opet: {
    backgroundImage: ""
  },
  solutions: {
    individualDescription: "Ovolt, elektrikli araç sahiplerine hızlı, güvenilir ve kolay erişilebilir şarj çözümleri sunar. Opet istasyonları başta olmak üzere stratejik noktalarda konumlanan halka açık Ovolt şarj istasyonlarıyla, elektrikli aracınız için her an, her yerde enerjiye kolayca ulaşabilirsiniz.",
    corporateDescription: "Ovolt, Opet iş birliği ile işletmeler ve filolar için hibrit enerji çözümleri sunar. Şarj ünitelerinizi Ovolt ağına entegre ederek gelir edebilir, gelişmiş yönetim ve raporlama panelleri sayesinde operasyonlarınızı kolayca kontrol edebilirsiniz. Filo dönüşüm süreçlerinizde akaryakıttan elektriğe geçişi Ovolt çözümleri ile güvenle yönetebilirsiniz.",
    solutionsImage: ""
  },
  sustainability: {
    title: "Sürdürülebilirlik",
    description: "Çevre dostu enerji çözümleri ile geleceğe yatırım yapıyoruz.",
    backgroundImage: ""
  }
};

const IndexPageEditor: React.FC = () => {
  const [content, setContent] = useState<IndexPageContent>(initialContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [realChargingStationCount, setRealChargingStationCount] = useState<string>('1880+');

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
      // Load both content and statistics in parallel
      const [contentResponse, statsResponse] = await Promise.all([
        contentService.getIndexPageContent(actualBrandId),
        contentService.getBrandStatistics(actualBrandId)
      ]);

      let finalContent = initialContent;

      if (contentResponse.ok && contentResponse.data) {
        finalContent = contentResponse.data;
      }

      // Update the charging station count with real database value
      if (statsResponse.ok && statsResponse.data) {
        setRealChargingStationCount(statsResponse.data.formattedCount);

        // Also update the content count to match the database
        finalContent = {
          ...finalContent,
          hero: {
            ...finalContent.hero,
            count: statsResponse.data.formattedCount
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

  const updateContent = (section: keyof IndexPageContent, field: string, value: any) => {
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

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content?.meta?.title?.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }
    if (!content?.hero?.title?.trim()) {
      errors.push('Hero ana başlık boş olamaz');
    }
    if (!content?.services?.title?.trim()) {
      errors.push('Hizmetler başlığı boş olamaz');
    }
    if (!content?.tariffs?.title?.trim()) {
      errors.push('Tarifeler başlığı boş olamaz');
    }
    if (!content?.sustainability?.title?.trim()) {
      errors.push('Sürdürülebilirlik başlığı boş olamaz');
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

    setSaving(true);
    setError(null);

    try {
      const response = await contentService.saveIndexPageContent(currentBrandId, content);

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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ana Sayfa İçerik Editörü
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Ana sayfa içeriklerini düzenleyin
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
              Hizmetler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Tarifeler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Opet
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Bireysel+Kurumsal
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Sürdürülebilirlik
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
                    <FormLabel>Ana Başlık</FormLabel>
                    <FormTextarea
                      value={content?.hero?.title || ''}
                      onChange={(e) => updateContent('hero', 'title', e.target.value)}
                      placeholder="Ana başlığı girin"
                      rows={2}
                    />
                  </div>
                  <div>
                    <FormLabel>Medya Tipi</FormLabel>
                    <select
                      value={content?.hero?.mediaType || 'video'}
                      onChange={(e) => updateContent('hero', 'mediaType', e.target.value as 'video' | 'image')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="image">Görsel</option>
                    </select>
                  </div>
                  <div>
                    <ImageInput
                      value={content?.hero?.mediaUrl || ''}
                      onChange={(url) => updateContent('hero', 'mediaUrl', url)}
                      label={content?.hero?.mediaType === 'video' ? "Hero Video" : "Hero Görseli"}
                      placeholder={content?.hero?.mediaType === 'video' ? "Video seçin..." : "Hero görseli seçin..."}
                    />
                  </div>
                  <div>
                    <FormLabel>Sayı (sadece görüntüleme)</FormLabel>
                    <FormInput
                      value={realChargingStationCount}
                      readOnly
                      placeholder="1880+"
                      className="bg-gray-100 dark:bg-gray-700"
                    />
                    <p className="text-sm text-gray-500 mt-1">Bu değer veri tabanından otomatik olarak gelir</p>
                  </div>
                  <div>
                    <FormLabel>Sayı Açıklama Metni</FormLabel>
                    <FormInput
                      value={content?.hero?.countText || ''}
                      onChange={(e) => updateContent('hero', 'countText', e.target.value)}
                      placeholder="Şarj İstasyonu ile Kesintisiz Enerji"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Hizmetler</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Başlık</FormLabel>
                    <FormInput
                      value={content?.services?.title || ''}
                      onChange={(e) => updateContent('services', 'title', e.target.value)}
                      placeholder="Hizmet Noktaları"
                    />
                  </div>
                  <div>
                    <FormLabel>İçerik</FormLabel>
                    <FormTextarea
                      value={content?.services?.content || ''}
                      onChange={(e) => updateContent('services', 'content', e.target.value)}
                      placeholder="Hizmetler açıklaması"
                      rows={4}
                    />
                  </div>
                  <div>
                    <FormLabel>Alt Başlık</FormLabel>
                    <FormInput
                      value={content?.services?.subtitle || ''}
                      onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                      placeholder="Hizmet Noktaları"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Tarifeler</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Başlık</FormLabel>
                    <FormInput
                      value={content?.tariffs?.title || ''}
                      onChange={(e) => updateContent('tariffs', 'title', e.target.value)}
                      placeholder="Tarifeler"
                    />
                  </div>
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.tariffs?.description || ''}
                      onChange={(e) => updateContent('tariffs', 'description', e.target.value)}
                      placeholder="Tarifeler açıklaması"
                      rows={4}
                    />
                  </div>
                  <div>
                    <FormLabel>Tarifeler Listesi Başlığı</FormLabel>
                    <FormInput
                      value={content?.tariffs?.listTitle || ''}
                      onChange={(e) => updateContent('tariffs', 'listTitle', e.target.value)}
                      placeholder="Tarife Seçenekleri"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Opet</h3>
                <div className="space-y-4">
                  <div>
                    <ImageInput
                      value={content?.opet?.backgroundImage || ''}
                      onChange={(url) => updateContent('opet', 'backgroundImage', url)}
                      label="Arka Plan Görseli"
                      placeholder="Arka plan görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Bireysel + Kurumsal</h3>
                <div className="space-y-6">
                  <div>
                    <FormLabel>Bireysel Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.solutions?.individualDescription || ''}
                      onChange={(e) => updateContent('solutions', 'individualDescription', e.target.value)}
                      placeholder="Bireysel çözümler açıklaması"
                      rows={4}
                    />
                  </div>
                  <div>
                    <FormLabel>Kurumsal Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.solutions?.corporateDescription || ''}
                      onChange={(e) => updateContent('solutions', 'corporateDescription', e.target.value)}
                      placeholder="Kurumsal çözümler açıklaması"
                      rows={4}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content?.solutions?.solutionsImage || ''}
                      onChange={(url) => updateContent('solutions', 'solutionsImage', url)}
                      label="Sağ Taraf Görseli"
                      placeholder="Çözümler görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Sürdürülebilirlik</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Başlık</FormLabel>
                    <FormInput
                      value={content?.sustainability?.title || ''}
                      onChange={(e) => updateContent('sustainability', 'title', e.target.value)}
                      placeholder="Sürdürülebilirlik başlığı"
                    />
                  </div>
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.sustainability?.description || ''}
                      onChange={(e) => updateContent('sustainability', 'description', e.target.value)}
                      placeholder="Sürdürülebilirlik açıklaması"
                      rows={3}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content?.sustainability?.backgroundImage || ''}
                      onChange={(url) => updateContent('sustainability', 'backgroundImage', url)}
                      label="Arka Plan Görseli"
                      placeholder="Arka plan görseli seçin..."
                    />
                  </div>
                </div>
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

export default IndexPageEditor;