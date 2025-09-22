import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface IndividualSolutionsPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  mainSolution: {
    title: string;
    description: string;
    image: string;
  };
  bottomItems: Array<{
    image: string;
    paragraph: string;
  }>;
  footerSection: {
    altText: string;
  };
}

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
  footerSection: {
    altText: "Ovolt, geleceğin enerjisini bugünden sunarak sürüş deneyiminizi kolaylaştırır ve güvence altına alır."
  }
};

const IndividualSolutionsPageEditor: React.FC = () => {
  const [content, setContent] = useState<IndividualSolutionsPageContent>(initialContent);

  const updateContent = (section: keyof IndividualSolutionsPageContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateBottomItem = (index: number, field: string, value: string) => {
    const newBottomItems = [...content.bottomItems];
    newBottomItems[index] = { ...newBottomItems[index], [field]: value };
    setContent(prev => ({
      ...prev,
      bottomItems: newBottomItems
    }));
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content.mainSolution.title.trim()) {
      errors.push('Ana çözümler başlığı boş olamaz');
    }

    if (!content.mainSolution.description.trim()) {
      errors.push('Ana çözümler açıklaması boş olamaz');
    }

    if (!content.footerSection.altText.trim()) {
      errors.push('Alt metin boş olamaz');
    }

    content.bottomItems.forEach((item, index) => {
      if (!item.paragraph.trim()) {
        errors.push(`Alt bölüm ${index + 1} paragrafı boş olamaz`);
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

    try {
      console.log('Saving content:', content);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('İçerik başarıyla kaydedildi!');
    } catch (error) {
      console.error('Save error:', error);
      alert('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Bireysel Çözümler Sayfası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Bireysel çözümler sayfası içeriklerini düzenleyin
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
              Ana Çözümler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Alt Bölümler
            </Tab>
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
                      value={content.meta.title}
                      onChange={(e) => updateContent('meta', 'title', e.target.value)}
                      placeholder="Sayfa başlığını girin"
                    />
                  </div>
                  <div>
                    <FormLabel>Açıklama</FormLabel>
                    <FormTextarea
                      value={content.meta.description}
                      onChange={(e) => updateContent('meta', 'description', e.target.value)}
                      placeholder="Sayfa açıklamasını girin"
                      rows={3}
                    />
                  </div>
                  <div>
                    <FormLabel>Anahtar Kelimeler</FormLabel>
                    <FormTextarea
                      value={content.meta.keywords}
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
                      value={content.hero.image}
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
                      value={content.mainSolution.title}
                      onChange={(e) => updateContent('mainSolution', 'title', e.target.value)}
                      placeholder="Ana başlığı girin"
                    />
                  </div>
                  <div>
                    <FormLabel>Ana Açıklama</FormLabel>
                    <FormTextarea
                      value={content.mainSolution.description}
                      onChange={(e) => updateContent('mainSolution', 'description', e.target.value)}
                      placeholder="Ana açıklamayı girin"
                      rows={3}
                    />
                  </div>
                  <div>
                    <ImageInput
                      value={content.mainSolution.image}
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
                {content.bottomItems.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Alt Bölüm {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <ImageInput
                          value={item.image}
                          onChange={(url) => updateBottomItem(index, 'image', url)}
                          label={`Alt Bölüm ${index + 1} Görseli`}
                          placeholder={`Alt bölüm ${index + 1} görseli seçin...`}
                        />
                      </div>
                      <div>
                        <FormLabel>Paragraf İçeriği</FormLabel>
                        <FormTextarea
                          value={item.paragraph}
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

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Alt Metin</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Alt Metin</FormLabel>
                    <FormTextarea
                      value={content.footerSection.altText}
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
          <Button variant="primary" onClick={handleSave}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndividualSolutionsPageEditor;