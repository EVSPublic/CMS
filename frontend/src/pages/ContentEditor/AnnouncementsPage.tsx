import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import Lucide from '../../components/Base/Lucide';
import { announcementsService, Announcement as ApiAnnouncement } from '../../services/announcements';
import { useScrollEffect } from '../../hooks/useScrollEffect';

interface Announcement {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  status?: string;
  startDate?: string;
  endDate?: string;
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
  const isScrolled = useScrollEffect();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current brand ID from localStorage
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());

  // Load announcements and page content on component mount
  useEffect(() => {
    loadPageContent();
    loadAnnouncements();
  }, []);

  // Listen for brand changes and reload announcements
  useEffect(() => {
    const handleBrandChange = () => {
      const newBrandId = getCurrentBrandId();
      setCurrentBrandId(newBrandId);
      loadPageContent(newBrandId);
      loadAnnouncements(newBrandId);
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadPageContent = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;

    try {
      const response = await announcementsService.getPageContent(actualBrandId);

      if (response.ok && response.data?.content) {
        const pageData = response.data.content;
        setContent(prev => ({
          ...prev,
          meta: {
            title: pageData.meta?.title || prev.meta.title,
            description: pageData.meta?.description || prev.meta.description,
            keywords: pageData.meta?.keywords || prev.meta.keywords
          },
          hero: {
            image: pageData.hero?.image || prev.hero.image
          }
        }));
      }
    } catch (err) {
      console.error('Page content load error:', err);
    }
  };

  const loadAnnouncements = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;
    setLoading(true);
    setError(null);

    try {
      const response = await announcementsService.getAnnouncements(actualBrandId);

      if (response.ok && response.data) {
        const apiAnnouncements = response.data.announcements;
        const convertedAnnouncements: Announcement[] = apiAnnouncements.map(a => ({
          id: a.id,
          title: a.title,
          content: a.content,
          imageUrl: a.imageUrl || '',
          status: a.status,
          startDate: a.startDate,
          endDate: a.endDate
        }));

        setContent(prev => ({
          ...prev,
          announcements: convertedAnnouncements
        }));
      }
    } catch (err) {
      setError('Duyurular yüklenirken bir hata oluştu');
      console.error('Announcements load error:', err);
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

  const addAnnouncement = async () => {
    try {
      const response = await announcementsService.createAnnouncement({
        title: "Yeni Duyuru",
        content: "Duyuru içeriği buraya gelecek...",
        imageUrl: ""
      });

      if (response.ok) {
        await loadAnnouncements(); // Reload to get updated list
      } else {
        alert('Duyuru eklenirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Add announcement error:', error);
      alert('Duyuru eklenirken bir hata oluştu!');
    }
  };

  const removeAnnouncement = async (index: number) => {
    const announcement = content.announcements[index];
    if (announcement && typeof announcement.id === 'number') {
      if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
        try {
          const response = await announcementsService.deleteAnnouncement(announcement.id);

          if (response.ok) {
            await loadAnnouncements(); // Reload to get updated list
          } else {
            alert('Duyuru silinirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
          }
        } catch (error) {
          console.error('Delete announcement error:', error);
          alert('Duyuru silinirken bir hata oluştu!');
        }
      }
    }
  };

  const toggleAnnouncementStatus = async (index: number) => {
    const announcement = content.announcements[index];
    if (announcement && typeof announcement.id === 'number') {
      try {
        const isPublished = announcement.status === 'Published';
        const response = await announcementsService.publishAnnouncement(announcement.id, {
          publish: !isPublished
        });

        if (response.ok) {
          await loadAnnouncements(); // Reload to get updated status
        } else {
          alert('Duyuru durumu değiştirilirken bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
        }
      } catch (error) {
        console.error('Toggle announcement status error:', error);
        alert('Duyuru durumu değiştirilirken bir hata oluştu!');
      }
    }
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

  const saveAnnouncement = async (announcement: Announcement) => {
    if (typeof announcement.id === 'number') {
      try {
        const response = await announcementsService.updateAnnouncement(announcement.id, {
          title: announcement.title,
          content: announcement.content,
          imageUrl: announcement.imageUrl,
          startDate: announcement.startDate,
          endDate: announcement.endDate
        });

        if (!response.ok) {
          throw new Error(response.error?.message || 'Güncelleme başarısız');
        }
      } catch (error) {
        console.error('Update announcement error:', error);
        throw error;
      }
    }
  };

  const handleSave = async () => {
    const validation = validateContent();

    if (!validation.isValid) {
      alert('Lütfen şu hataları düzeltin:\n\n' + validation.errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      // Save page content (meta + hero)
      const pageContentData = {
        meta: {
          title: content.meta.title,
          description: content.meta.description,
          keywords: content.meta.keywords
        },
        hero: {
          image: content.hero.image
        }
      };

      const pageContentResponse = await announcementsService.updatePageContent(pageContentData, currentBrandId);

      if (!pageContentResponse.ok) {
        throw new Error('Sayfa içeriği kaydedilemedi');
      }

      // Save all announcements
      const savePromises = content.announcements.map(announcement => saveAnnouncement(announcement));
      await Promise.all(savePromises);

      await loadAnnouncements(); // Reload to get updated data
      alert('Tüm değişiklikler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
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
            <p className="text-gray-500 dark:text-gray-400">Duyurular yükleniyor...</p>
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
          Duyurular İçerik Editörü
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
          Duyurular sayfası içeriklerini düzenleyin
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
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              Duyuru {index + 1}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              announcement.status === 'Published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {announcement.status === 'Published' ? 'Yayında' : 'Taslak'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="soft-secondary"
                              onClick={() => toggleAnnouncementStatus(index)}
                              className={`text-xs ${
                                announcement.status === 'Published'
                                  ? 'text-orange-600 hover:text-orange-800'
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {announcement.status === 'Published' ? 'Yayından Kaldır' : 'Yayınla'}
                            </Button>
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
                              value={announcement.imageUrl}
                              onChange={(url) => updateAnnouncement(index, 'imageUrl', url)}
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