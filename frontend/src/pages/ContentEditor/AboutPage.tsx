import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService, AboutPageContent } from '../../services/content';


const initialContent: AboutPageContent = {
  meta: {
    title: "Ovolt - Hakkımızda",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  mainSection: {
    title: "Geleceğin enerjisini bugünden hayata geçiriyoruz!",
    description: "Ovolt, elektrikli araç sahiplerine hızlı, güvenilir ve kolay erişilebilir şarj çözümleri sunmak amacıyla kurulmuş, Türkiye'nin hızla büyüyen elektrikli araç şarj ağı markasıdır.",
    image: ""
  },
  additionalSection: {
    description: "UNIVOLT venture capital çatısı altında faaliyet gösteren Ovolt, genişleyen altyapısı ile Türkiye genelinde sürdürülebilir ulaşımın öncüsü olmayı hedeflemektedir. UNIVOLT'un benzersiz roaming altyapısı sayesinde kullanıcılar, tek bir platform üzerinden farklı şarj istasyonlarında kesintisiz ve zahmetsiz bir deneyim yaşayabilir.\n\nOvolt, Türkiye'nin enerji devlerinden biri olan Opet ile güçlü iş birliği içerisindedir. Bu ortaklık sayesinde elektrikli araç kullanıcılarının hayatını kolaylaştırmak amacıyla ülke genelinde yaygın bir şarj ağı kurmayı hedeflemektedir. Ovolt istasyonları, stratejik konumlarda (özellikle Opet istasyonlarında) konumlanarak elektrikli araç kullanıcılarına her an, her yerde güvenli ve hızlı enerji erişimi sağlamak üzere tasarlanmıştır.",
    image: ""
  },
  missionVision: {
    vision: {
      title: "Vizyonumuz",
      quote: "Elektrikli araçların yaygınlaşmasına katkı sağlayarak, sürdürülebilir enerji çözümleri ile dünyayı daha yeşil bir geleceğe taşımak.",
      description: "Ovolt, elektrikli mobilite alanında yenilikçi teknolojiler geliştirerek, kullanıcılarına hızlı, güvenilir ve erişilebilir şarj çözümleri sunmayı hedefler. Amacımız; Türkiye'den başlayarak uluslararası pazarlara uzanan güçlü altyapımızla sürdürülebilir bir ulaşım ekosisteminin öncüsü olmaktır."
    },
    mission: {
      title: "Misyonumuz",
      quote: "Türkiye ve uluslararası pazarlarda, güvenilir, yenilikçi ve verimli elektrikli araç şarj altyapılarını sağlayarak, müşterilerine kesintisiz, erişilebilir ve ileri teknolojili şarj hizmetleri sunmak.",
      description: "UNIVOLT çatısı altında ve Opet iş birliği ile;\nTürkiye genelinde hızla büyüyen bir şarj ağı oluşturuyoruz,\nRoaming altyapımız sayesinde farklı markalardaki şarj istasyonlarını tek platformdan erişilebilir kılıyoruz,\nÇevre dostu çözümlerle sürdürülebilir enerjiye geçişi hızlandırıyor ve geleceğin mobilitesine yön veriyoruz."
    }
  }
};

const AboutPageEditor: React.FC = () => {
  const [content, setContent] = useState<AboutPageContent>(initialContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBrandId] = useState<number>(1); // Default to brand 1 (Ovolt)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load content on component mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await contentService.getAboutPageContent(currentBrandId);

      if (response.ok && response.data) {
        setContent(response.data);
      } else {
        // If no content found, use default content
        setContent(initialContent);
        setError(null);
      }
    } catch (err) {
      setContent(initialContent);
      setError('İçerik yüklenirken bir hata oluştu');
      console.error('Content load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (section: keyof AboutPageContent, field: string, value: any) => {
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

  const updateNestedContent = (section: keyof AboutPageContent, subsection: string, field: string, value: any) => {
    setContent(prev => {
      if (!prev) return initialContent;
      const currentSection = prev[section] || {};
      const currentSubsection = (currentSection as any)[subsection] || {};

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subsection]: {
            ...currentSubsection,
            [field]: value
          }
        }
      };
    });
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content?.meta?.title?.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content?.mainSection?.title?.trim()) {
      errors.push('Ana bölüm başlığı boş olamaz');
    }

    if (!content?.missionVision?.vision?.title?.trim()) {
      errors.push('Vizyon başlığı boş olamaz');
    }

    if (!content?.missionVision?.mission?.title?.trim()) {
      errors.push('Misyon başlığı boş olamaz');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSave = async () => {
    if (!content) return;

    const validation = validateContent();

    if (!validation.isValid) {
      alert('Lütfen şu hataları düzeltin:\n\n' + validation.errors.join('\n'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await contentService.saveAboutPageContent(currentBrandId, content);

      if (response.ok) {
        setLastSavedAt(new Date());
        alert('İçerik başarıyla kaydedildi!');
      } else {
        setError('İçerik kaydedilirken bir hata oluştu');
        alert('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hakkımızda Sayfası İçerik Editörü
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Hakkımızda sayfası içeriklerini düzenleyin
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
              Ana Bölüm
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Ek Bölüm
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Vizyon&Misyon
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
                <h3 className="text-lg font-semibold mb-4">Ana Bölüm</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Başlık</FormLabel>
                    <FormTextarea
                      value={content?.mainSection?.title || ''}
                      onChange={(e) => updateContent('mainSection', 'title', e.target.value)}
                      placeholder="Ana bölüm başlığını girin"
                      rows={2}
                    />
                  </div>
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.mainSection?.description || ''}
                      onChange={(e) => updateContent('mainSection', 'description', e.target.value)}
                      placeholder="Ana bölüm açıklamasını girin"
                      rows={4}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content?.mainSection?.image || ''}
                      onChange={(url) => updateContent('mainSection', 'image', url)}
                      label="Ana Bölüm Görseli"
                      placeholder="Ana bölüm görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ek Bölüm</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content?.additionalSection?.description || ''}
                      onChange={(e) => updateContent('additionalSection', 'description', e.target.value)}
                      placeholder="Ek bölüm açıklamasını girin"
                      rows={4}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content?.additionalSection?.image || ''}
                      onChange={(url) => updateContent('additionalSection', 'image', url)}
                      label="Ek Bölüm Görseli"
                      placeholder="Ek bölüm görseli seçin..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Vizyon</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Vizyon Başlığı</FormLabel>
                      <FormInput
                        value={content?.missionVision?.vision?.title || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'vision', 'title', e.target.value)}
                        placeholder="Vizyon başlığını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Vizyon Alıntısı</FormLabel>
                      <FormTextarea
                        value={content?.missionVision?.vision?.quote || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'vision', 'quote', e.target.value)}
                        placeholder="Vizyon alıntısını girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Vizyon Açıklaması</FormLabel>
                      <FormTextarea
                        value={content?.missionVision?.vision?.description || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'vision', 'description', e.target.value)}
                        placeholder="Vizyon açıklamasını girin"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Misyon</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Misyon Başlığı</FormLabel>
                      <FormInput
                        value={content?.missionVision?.mission?.title || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'title', e.target.value)}
                        placeholder="Misyon başlığını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Misyon Alıntısı</FormLabel>
                      <FormTextarea
                        value={content?.missionVision?.mission?.quote || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'quote', e.target.value)}
                        placeholder="Misyon alıntısını girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Misyon Açıklaması</FormLabel>
                      <FormTextarea
                        value={content?.missionVision?.mission?.description || ''}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'description', e.target.value)}
                        placeholder="Misyon açıklamasını girin"
                        rows={4}
                      />
                    </div>
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

export default AboutPageEditor;