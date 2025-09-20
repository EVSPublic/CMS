import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface StationMapPageContent {
  meta: {
    title: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  mapHeader: {
    title: string;
    stationCount: string;
    stationIconImage: string;
    description: string;
  };
  mapConfig: {
    embedUrl: string;
    width: string;
    height: string;
  };
  stationPopup: {
    sampleStation: {
      title: string;
      id: string;
      coordinates: string;
      stationIcon: string;
      powerLevels: Array<{
        value: string;
        icon: string;
      }>;
    };
    labels: {
      idLabel: string;
      locationLabel: string;
      powerLevelsTitle: string;
    };
  };
}

const initialContent: StationMapPageContent = {
  meta: {
    title: "İstasyon Haritası - Ovolt"
  },
  pageHero: {
    backgroundImage: "assets/img/istasyon-haritasi-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  mapHeader: {
    title: "İstasyon Haritası",
    stationCount: "+1880",
    stationIconImage: "assets/img/station-map.svg",
    description: "Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan Ovolt şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
  },
  mapConfig: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.5!2d32.7968!3d39.8954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUzJzQzLjQiTiAzMsKwNDcnNDguNCJF!5e0!3m2!1str!2str!4v1640000000000!5m2!1str!2str",
    width: "100%",
    height: "600"
  },
  stationPopup: {
    sampleStation: {
      title: "YÜZÜNCÜYIL PETROL",
      id: "1883",
      coordinates: "39.8954, 32.7968",
      stationIcon: "assets/img/station-map-icon.svg",
      powerLevels: [
        { value: "80 kW", icon: "assets/img/station-map-icon.svg" },
        { value: "22 kW", icon: "assets/img/station-map-icon.svg" },
        { value: "50 kW", icon: "assets/img/station-map-icon.svg" },
        { value: "22 kW", icon: "assets/img/station-map-icon.svg" },
        { value: "120 kW", icon: "assets/img/station-map-icon.svg" },
        { value: "120 kW", icon: "assets/img/station-map-icon.svg" }
      ]
    },
    labels: {
      idLabel: "ID:",
      locationLabel: "Konum:",
      powerLevelsTitle: "Güç Seviyeleri"
    }
  }
};

const IstasyonHaritasiPageEditor: React.FC = () => {
  const [content, setContent] = useState<StationMapPageContent>(initialContent);
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

    if (!content.mapConfig.embedUrl.trim()) {
      errors.push('Harita embed URL\'i boş olamaz');
    }

    if (!content.stationPopup.sampleStation.title.trim()) {
      errors.push('Örnek istasyon adı boş olamaz');
    }

    content.stationPopup.sampleStation.powerLevels.forEach((power, index) => {
      if (!power.value.trim()) {
        errors.push(`Güç seviyesi ${index + 1} değeri boş olamaz`);
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
      // await api.savePageContent('istasyon-haritasi', content);
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
          İstasyon Haritası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          İstasyon haritası sayfası içeriklerini düzenleyin
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Harita Başlığı
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Harita Ayarları
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İstasyon Popup
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Görseller
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
                  <FormLabel htmlFor="mapHeader.stationCount">İstasyon Sayısı</FormLabel>
                  <FormInput
                    id="mapHeader.stationCount"
                    value={content.mapHeader.stationCount}
                    onChange={(e) => updateContent('mapHeader.stationCount', e.target.value)}
                    placeholder="+1880"
                  />
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

            {/* Harita Ayarları */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div>
                  <FormLabel htmlFor="mapConfig.embedUrl">Google Maps Embed URL</FormLabel>
                  <FormTextarea
                    id="mapConfig.embedUrl"
                    value={content.mapConfig.embedUrl}
                    onChange={(e) => updateContent('mapConfig.embedUrl', e.target.value)}
                    rows={3}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Google Maps'ten "Embed a map" seçeneğini kullanarak URL alabilirsiniz.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel htmlFor="mapConfig.width">Harita Genişlik</FormLabel>
                    <FormInput
                      id="mapConfig.width"
                      value={content.mapConfig.width}
                      onChange={(e) => updateContent('mapConfig.width', e.target.value)}
                      placeholder="100%"
                    />
                  </div>

                  <div>
                    <FormLabel htmlFor="mapConfig.height">Harita Yükseklik</FormLabel>
                    <FormInput
                      id="mapConfig.height"
                      value={content.mapConfig.height}
                      onChange={(e) => updateContent('mapConfig.height', e.target.value)}
                      placeholder="600"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* İstasyon Popup */}
            <Tab.Panel className="p-6">
              <div className="space-y-8">
                {/* Popup Etiketleri */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popup Etiketleri</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel htmlFor="labels.idLabel">ID Etiketi</FormLabel>
                      <FormInput
                        id="labels.idLabel"
                        value={content.stationPopup.labels.idLabel}
                        onChange={(e) => updateContent('stationPopup.labels.idLabel', e.target.value)}
                        placeholder="ID:"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="labels.locationLabel">Konum Etiketi</FormLabel>
                      <FormInput
                        id="labels.locationLabel"
                        value={content.stationPopup.labels.locationLabel}
                        onChange={(e) => updateContent('stationPopup.labels.locationLabel', e.target.value)}
                        placeholder="Konum:"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="labels.powerLevelsTitle">Güç Seviyeleri Başlığı</FormLabel>
                      <FormInput
                        id="labels.powerLevelsTitle"
                        value={content.stationPopup.labels.powerLevelsTitle}
                        onChange={(e) => updateContent('stationPopup.labels.powerLevelsTitle', e.target.value)}
                        placeholder="Güç Seviyeleri"
                      />
                    </div>
                  </div>
                </div>

                {/* Örnek İstasyon */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Örnek İstasyon Bilgileri</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel htmlFor="sampleStation.title">İstasyon Adı</FormLabel>
                      <FormInput
                        id="sampleStation.title"
                        value={content.stationPopup.sampleStation.title}
                        onChange={(e) => updateContent('stationPopup.sampleStation.title', e.target.value)}
                        placeholder="YÜZÜNCÜYIL PETROL"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="sampleStation.id">İstasyon ID</FormLabel>
                        <FormInput
                          id="sampleStation.id"
                          value={content.stationPopup.sampleStation.id}
                          onChange={(e) => updateContent('stationPopup.sampleStation.id', e.target.value)}
                          placeholder="1883"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor="sampleStation.coordinates">Koordinatlar</FormLabel>
                        <FormInput
                          id="sampleStation.coordinates"
                          value={content.stationPopup.sampleStation.coordinates}
                          onChange={(e) => updateContent('stationPopup.sampleStation.coordinates', e.target.value)}
                          placeholder="39.8954, 32.7968"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Güç Seviyeleri */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Güç Seviyeleri</h3>
                    <Button
                      variant="primary"
                      onClick={() => addArrayItem('stationPopup.sampleStation.powerLevels', {
                        value: "",
                        icon: "assets/img/station-map-icon.svg"
                      })}
                    >
                      Yeni Güç Seviyesi Ekle
                    </Button>
                  </div>

                  {content.stationPopup.sampleStation.powerLevels.map((power, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Güç Seviyesi {index + 1}</h4>
                        <Button
                          variant="soft-secondary"
                          onClick={() => removeArrayItem('stationPopup.sampleStation.powerLevels', index)}
                        >
                          Sil
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel htmlFor={`power-value-${index}`}>Güç Değeri</FormLabel>
                          <FormInput
                            id={`power-value-${index}`}
                            value={power.value}
                            onChange={(e) => updateArrayItem('stationPopup.sampleStation.powerLevels', index, 'value', e.target.value)}
                            placeholder="80 kW"
                          />
                        </div>

                        <div>
                          <FormLabel htmlFor={`power-icon-${index}`}>İkon Yolu</FormLabel>
                          <FormInput
                            id={`power-icon-${index}`}
                            value={power.icon}
                            onChange={(e) => updateArrayItem('stationPopup.sampleStation.powerLevels', index, 'icon', e.target.value)}
                            placeholder="assets/img/station-map-icon.svg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Görseller */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sayfa Görselleri</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel htmlFor="pageHero.backgroundImage">Sayfa Arka Plan Görseli</FormLabel>
                      <ImageInput
                        value={content.pageHero.backgroundImage}
                        onChange={(value) => updateContent('pageHero.backgroundImage', value)}
                        placeholder="Arka plan görselini seçin"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="pageHero.logoImage">Sayfa Logo Görseli</FormLabel>
                      <ImageInput
                        value={content.pageHero.logoImage}
                        onChange={(value) => updateContent('pageHero.logoImage', value)}
                        placeholder="Logo görselini seçin"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="mapHeader.stationIconImage">İstasyon Sayısı İkonu</FormLabel>
                      <ImageInput
                        value={content.mapHeader.stationIconImage}
                        onChange={(value) => updateContent('mapHeader.stationIconImage', value)}
                        placeholder="İstasyon ikonunu seçin"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="stationPopup.sampleStation.stationIcon">Popup İstasyon İkonu</FormLabel>
                      <ImageInput
                        value={content.stationPopup.sampleStation.stationIcon}
                        onChange={(value) => updateContent('stationPopup.sampleStation.stationIcon', value)}
                        placeholder="Popup istasyon ikonunu seçin"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Güç Seviyesi İkonları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.stationPopup.sampleStation.powerLevels.map((power, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <FormLabel htmlFor={`power-icon-image-${index}`}>{power.value || `Güç Seviyesi ${index + 1}`}</FormLabel>
                        <ImageInput
                          value={power.icon}
                          onChange={(value) => updateArrayItem('stationPopup.sampleStation.powerLevels', index, 'icon', value)}
                          placeholder="Güç seviyesi ikonunu seçin"
                        />
                      </div>
                    ))}
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