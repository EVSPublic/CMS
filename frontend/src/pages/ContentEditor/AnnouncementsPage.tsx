import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image: string;
}

interface AnnouncementsPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    image: string;
  };
  announcements: Announcement[];
}

const initialContent: AnnouncementsPageContent = {
  meta: {
    title: "Duyurular - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
  },
  announcements: []
};

const AnnouncementsPageEditor: React.FC = () => {
  const [content, setContent] = useState<AnnouncementsPageContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

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

  const updateAnnouncement = (index: number, field: keyof Announcement, value: string) => {
    const newAnnouncements = [...content.announcements];
    newAnnouncements[index] = {
      ...newAnnouncements[index],
      [field]: value
    };
    setContent(prev => ({
      ...prev,
      announcements: newAnnouncements
    }));
  };

  const addAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: "",
      content: "",
      image: ""
    };
    setContent(prev => ({
      ...prev,
      announcements: [...prev.announcements, newAnnouncement]
    }));
  };

  const removeAnnouncement = (index: number) => {
    setContent(prev => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== index)
    }));
  };

  const moveAnnouncement = (index: number, direction: 'up' | 'down') => {
    const newAnnouncements = [...content.announcements];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newAnnouncements.length) {
      [newAnnouncements[index], newAnnouncements[newIndex]] = [newAnnouncements[newIndex], newAnnouncements[index]];
      setContent(prev => ({
        ...prev,
        announcements: newAnnouncements
      }));
    }
  };

  const validateContent = () => {
    const errors: string[] = [];

    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    content.announcements.forEach((announcement, index) => {
      if (!announcement.title.trim()) {
        errors.push(`Duyuru ${index + 1} başlığı boş olamaz`);
      }
      if (!announcement.content.trim()) {
        errors.push(`Duyuru ${index + 1} içeriği boş olamaz`);
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
      // await api.savePageContent('announcements', content);
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
          Duyurular İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Duyurular sayfası içeriklerini düzenleyin
        </p>
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
              Duyurular
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
                    placeholder="Duyurular - Ovolt"
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

            {/* Duyurular */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Duyuru Yönetimi</h3>
                  <Button
                    variant="primary"
                    onClick={addAnnouncement}
                  >
                    Yeni Duyuru Ekle
                  </Button>
                </div>

                {content.announcements.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      Henüz duyuru eklenmemiş. Yeni duyuru eklemek için yukarıdaki butonu kullanın.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {content.announcements.map((announcement, index) => (
                      <div key={announcement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            Duyuru {index + 1}
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              variant="soft-secondary"
                              onClick={() => moveAnnouncement(index, 'up')}
                              disabled={index === 0}
                              className="text-xs"
                            >
                              ↑ Yukarı
                            </Button>
                            <Button
                              variant="soft-secondary"
                              onClick={() => moveAnnouncement(index, 'down')}
                              disabled={index === content.announcements.length - 1}
                              className="text-xs"
                            >
                              ↓ Aşağı
                            </Button>
                            <Button
                              variant="soft-secondary"
                              onClick={() => removeAnnouncement(index)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Sil
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <FormLabel htmlFor={`announcement-title-${index}`}>Duyuru Başlığı</FormLabel>
                            <FormInput
                              id={`announcement-title-${index}`}
                              value={announcement.title}
                              onChange={(e) => updateAnnouncement(index, 'title', e.target.value)}
                              placeholder="Duyuru başlığını girin"
                            />
                          </div>

                          <div>
                            <FormLabel htmlFor={`announcement-content-${index}`}>Duyuru İçeriği</FormLabel>
                            <FormTextarea
                              id={`announcement-content-${index}`}
                              value={announcement.content}
                              onChange={(e) => updateAnnouncement(index, 'content', e.target.value)}
                              rows={4}
                              placeholder="Duyuru içeriğini girin"
                            />
                          </div>

                          <div>
                            <FormLabel htmlFor={`announcement-image-${index}`}>Duyuru Görseli</FormLabel>
                            <ImageInput
                              value={announcement.image}
                              onChange={(url) => updateAnnouncement(index, 'image', url)}
                              placeholder="Duyuru görseli seçin..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

export default AnnouncementsPageEditor;