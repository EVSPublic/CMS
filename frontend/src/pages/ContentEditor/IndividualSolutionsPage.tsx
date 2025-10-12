import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { contentService, IndividualSolutionsPageContent } from '../../services/content';
import { useScrollEffect } from '../../hooks/useScrollEffect';


const initialContent: IndividualSolutionsPageContent = {
  meta: {
    title: "Bireysel Çözümler - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  mainSolution: {
    title: "Bireysel Çözümler",
    description: "Ovolt, elektrikli aracınız için yüksek kaliteli, güvenilir ve erişilebilir şarj çözümleri sunar.",
    additionalDescription: "", // For Sharz.net only
    image: ""
  },
  bottomItems: [
    {
      image: "",
      paragraph: "Türkiye genelinde hızla büyüyen halka açık şarj istasyonlarımız, özellikle Opet istasyonları başta olmak üzere stratejik noktalarda konumlanarak size her zaman en yakın enerji kaynağını sağlar."
    },
    {
      image: "",
      paragraph: "Kullanıcı dostu mobil uygulamamız sayesinde en yakın istasyonu kolayca bulabilir, şarj işleminizi yönetebilir ve ödemelerinizi zahmetsizce gerçekleştirebilirsiniz. Ayrıca 7/24 kesintisiz çağrı merkezi desteğimiz ile her an yanınızdayız."
    }
  ],
  products: [], // For Sharz.net only
  footerSection: {
    altText: "Ovolt, geleceğin enerjisini bugünden sunarak sürüş deneyiminizi kolaylaştırır ve güvence altına alır."
  }
};

const IndividualSolutionsPageEditor: React.FC = () => {
  const [content, setContent] = useState<IndividualSolutionsPageContent>(initialContent);
  const isScrolled = useScrollEffect();
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
      const response = await contentService.getIndividualSolutionsPageContent(actualBrandId);

      let finalContent = initialContent;

      if (response.ok && response.data) {
        finalContent = {
          ...initialContent,
          ...response.data,
          bottomItems: response.data.bottomItems && response.data.bottomItems.length > 0
            ? response.data.bottomItems
            : initialContent.bottomItems,
          products: response.data.products || []
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

  const updateContent = (section: keyof IndividualSolutionsPageContent, field: string, value: any) => {
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

  const updateBottomItem = (index: number, field: string, value: string) => {
    const currentBottomItems = content?.bottomItems || initialContent.bottomItems;
    const newBottomItems = [...currentBottomItems];
    newBottomItems[index] = { ...newBottomItems[index], [field]: value };
    setContent(prev => ({
      ...prev,
      bottomItems: newBottomItems
    }));
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const currentProducts = content?.products || [];
    const newProducts = [...currentProducts];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setContent(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const addProduct = () => {
    const currentProducts = content?.products || [];
    const newProducts = [...currentProducts, { title: '', subtitle: '', image: '' }];
    setContent(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const removeProduct = (index: number) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      const currentProducts = content?.products || [];
      const newProducts = currentProducts.filter((_, i) => i !== index);
      setContent(prev => ({
        ...prev,
        products: newProducts
      }));
    }
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

    if (!content?.footerSection?.altText?.trim()) {
      errors.push('Alt metin boş olamaz');
    }

    content?.bottomItems?.forEach((item, index) => {
      if (!item.paragraph.trim()) {
        errors.push(`Alt bölüm ${index + 1} paragrafı boş olamaz`);
      }
    });

    // Validate products only for Sharz.net
    if (currentBrandId === 2) {
      content?.products?.forEach((product, index) => {
        if (!product.title.trim()) {
          errors.push(`Ürün ${index + 1} başlığı boş olamaz`);
        }
        if (!product.subtitle.trim()) {
          errors.push(`Ürün ${index + 1} alt başlığı boş olamaz`);
        }
      });
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
      const response = await contentService.saveIndividualSolutionsPageContent(currentBrandId, content);

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
              Bireysel Çözümler Sayfası İçerik Editörü
            </h1>
            <p className={`mt-1 text-sm transition-colors duration-300 ${
              isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
            }`}>
              Bireysel çözümler sayfası içeriklerini düzenleyin
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
              Alt Bölümler
            </Tab>
            {currentBrandId === 2 && (
              <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
                Ürünler
              </Tab>
            )}
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Alt Metin
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
                      rows={3}
                    />
                  </div>
                  {currentBrandId === 2 && (
                    <div>
                      <FormLabel>Ek Açıklama (Sadece Sharz.net için)</FormLabel>
                      <FormTextarea
                        value={content?.mainSolution?.additionalDescription || ''}
                        onChange={(e) => updateContent('mainSolution', 'additionalDescription', e.target.value)}
                        placeholder="Ek açıklamayı girin"
                        rows={3}
                      />
                    </div>
                  )}
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
                {(content?.bottomItems || initialContent.bottomItems).map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Alt Bölüm {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <ImageInput
                          value={item?.image || ''}
                          onChange={(url) => updateBottomItem(index, 'image', url)}
                          label={`Alt Bölüm ${index + 1} Görseli`}
                          placeholder={`Alt bölüm ${index + 1} görseli seçin...`}
                        />
                      </div>
                      <div>
                        <FormLabel>Paragraf İçeriği</FormLabel>
                        <FormTextarea
                          value={item?.paragraph || ''}
                          onChange={(e) => updateBottomItem(index, 'paragraph', e.target.value)}
                          placeholder={`Alt bölüm ${index + 1} paragraf içeriği`}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {currentBrandId === 2 && (
              <Tab.Panel>
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Ürünler</h3>
                    <Button variant="primary" onClick={addProduct}>
                      <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                      Yeni Ürün Ekle
                    </Button>
                  </div>

                  {(!content?.products || content.products.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">
                        Henüz ürün eklenmemiş. Yeni ürün eklemek için yukarıdaki butonu kullanın.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {content.products.map((product, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              Ürün {index + 1}
                            </h4>
                            <Button
                              variant="soft-secondary"
                              onClick={() => removeProduct(index)}
                              className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                            >
                              <Lucide icon="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <FormLabel htmlFor={`product-title-${index}`} className="text-xs">Başlık</FormLabel>
                              <FormInput
                                id={`product-title-${index}`}
                                value={product.title}
                                onChange={(e) => updateProduct(index, 'title', e.target.value)}
                                placeholder="Ürün başlığını girin"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <FormLabel htmlFor={`product-subtitle-${index}`} className="text-xs">Alt Başlık</FormLabel>
                              <FormInput
                                id={`product-subtitle-${index}`}
                                value={product.subtitle}
                                onChange={(e) => updateProduct(index, 'subtitle', e.target.value)}
                                placeholder="Ürün alt başlığını girin"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <ImageInput
                                value={product.image}
                                onChange={(url) => updateProduct(index, 'image', url)}
                                label="Ürün Görseli"
                                placeholder="Ürün görseli seçin..."
                              />
                            </div>

                            {/* Product Image Preview */}
                            {product.image && (
                              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                <img
                                  src={product.image}
                                  alt={product.title || 'Ürün görseli'}
                                  className="max-h-24 mx-auto object-contain rounded"
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
              </Tab.Panel>
            )}

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Alt Metin</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Alt Metin</FormLabel>
                    <FormTextarea
                      value={content?.footerSection?.altText || ''}
                      onChange={(e) => updateContent('footerSection', 'altText', e.target.value)}
                      placeholder="Alt metni girin"
                      rows={2}
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

export default IndividualSolutionsPageEditor;