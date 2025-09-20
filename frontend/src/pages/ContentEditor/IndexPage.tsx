import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface IndexPageContent {
  meta: {
    title: string;
  };
  hero: {
    title: string;
    subtitle: string;
    carousel: Array<{
      title: string;
      subtitle: string;
      buttonText: string;
      image: string;
      imageAlt: string;
    }>;
    videoSrc: string;
    flashImage: string;
    backgroundImage: string;
  };
  servicePoints: {
    title: string;
    counter: string;
    description: string;
    buttonText: string;
    mapImage: string;
    iconImage: string;
  };
  tariffs: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      price: string;
      description: string;
      features: string[];
      icon: string;
    }>;
  };
  mobileApp: {
    title: string;
    description: string;
    downloadText: string;
    appImage: string;
    appStoreIcon: string;
    googlePlayIcon: string;
  };
  solutions: {
    individualDescription: string;
    fleetDescription: string;
    individualButtonText: string;
    fleetButtonText: string;
  };
  contact: {
    title: string;
    description: string;
    buttonText: string;
  };
  sustainability: {
    title: string;
    paragraphs: string[];
  };
  partnerships: {
    description: string;
    title: string;
    logos: Array<{
      name: string;
      image: string;
      alt: string;
    }>;
  };
  branding: {
    logo: string;
    logoAlt: string;
    favicon: string;
  };
}

const initialContent: IndexPageContent = {
  meta: {
    title: "Ovolt - Elektrikli Araç Şarj İstasyonu"
  },
  hero: {
    title: "Her Yolculukta\nYanınızda",
    subtitle: "1880+ Şarj İstasyonu ile\nKesintisiz Enerji",
    videoSrc: "assets/video/hero-video.mp4",
    flashImage: "assets/img/hero-flash.png",
    backgroundImage: "assets/img/hero-flash.svg",
    carousel: [
      {
        title: "1900+ Şarj İstasyonu ile Kesintisiz Enerji",
        subtitle: "1900+ Şarj İstasyonu ile Kesintisiz Enerji",
        buttonText: "Devamı",
        image: "assets/img/info-card-img.png",
        imageAlt: "Şarj İstasyonu"
      },
      {
        title: "Hızlı Şarj Teknolojisi",
        subtitle: "En son teknoloji ile hızlı şarj deneyimi",
        buttonText: "Devamı",
        image: "assets/img/info-card-img.png",
        imageAlt: "Hızlı Şarj"
      },
      {
        title: "Akıllı Şarj Çözümleri",
        subtitle: "Mobil uygulama ile kolay yönetim",
        buttonText: "Devamı",
        image: "assets/img/info-card-img.png",
        imageAlt: "Akıllı Çözümler"
      }
    ]
  },
  servicePoints: {
    title: "Hizmet Noktalarımız",
    counter: "1880+",
    description: "Türkiye genelinde 1880+ şarj istasyonu ile hizmetinizdeyiz",
    buttonText: "Haritayı Görüntüle",
    mapImage: "assets/img/station-map-icon.svg",
    iconImage: "assets/img/station-map-icon.svg"
  },
  tariffs: {
    title: "Tarifelerimiz",
    subtitle: "Size en uygun tarife seçeneğini keşfedin",
    items: [
      {
        title: "Temel Tarife",
        price: "₺2.50",
        description: "kWh başına",
        features: ["7/24 şarj imkanı", "Mobil uygulama", "Online ödeme"],
        icon: "assets/img/tariff-basic-icon.svg"
      },
      {
        title: "Premium Tarife",
        price: "₺2.25",
        description: "kWh başına",
        features: ["Öncelikli şarj", "Özel destek", "İndirimli fiyat", "Hızlı şarj"],
        icon: "assets/img/tariff-premium-icon.svg"
      },
      {
        title: "Kurumsal Tarife",
        price: "₺2.00",
        description: "kWh başına",
        features: ["Filo yönetimi", "Raporlama", "Özel fiyatlandırma", "Destek"],
        icon: "assets/img/tariff-business-icon.svg"
      }
    ]
  },
  mobileApp: {
    title: "Mobil Uygulamayı İndirin",
    description: "Şarj istasyonlarını bulun, rezervasyon yapın ve ödeme işlemlerinizi kolayca gerçekleştirin",
    downloadText: "Ücretsiz İndir",
    appImage: "assets/img/app-phone.png",
    appStoreIcon: "assets/img/app-store-icon.png",
    googlePlayIcon: "assets/img/google-play-icon.png"
  },
  solutions: {
    individualDescription: "Bireysel kullanıcılar için özel çözümler ve avantajlı tarifeler",
    fleetDescription: "Filo yöneticileri için kapsamlı çözümler ve raporlama imkanları",
    individualButtonText: "Bireysel Çözümler",
    fleetButtonText: "Filo Çözümleri"
  },
  contact: {
    title: "İletişim",
    description: "Sorularınız için bizimle iletişime geçin",
    buttonText: "İletişim"
  },
  sustainability: {
    title: "Sürdürülebilirlik",
    paragraphs: [
      "Çevre dostu enerji çözümleri ile geleceğe yatırım yapıyoruz.",
      "Yenilenebilir enerji kaynaklarını kullanarak karbon ayak izimizi azaltıyoruz.",
      "Sürdürülebilir bir gelecek için teknoloji ve doğayı bir araya getiriyoruz."
    ]
  },
  partnerships: {
    description: "Güvenilir ortaklarımızla birlikte",
    title: "Güçlü İş Birliklerimiz",
    logos: [
      { name: "Opet", image: "assets/img/opet-logo.png", alt: "Opet Logo" },
      { name: "Regnum", image: "assets/img/regnum-logo.png", alt: "Regnum Logo" },
      { name: "SolarEdge", image: "assets/img/solaredge-logo.png", alt: "SolarEdge Logo" },
      { name: "Osloux", image: "assets/img/osloux-logo.png", alt: "Osloux Logo" }
    ]
  },
  branding: {
    logo: "assets/img/ovolt-logo.svg",
    logoAlt: "Ovolt Logo",
    favicon: "assets/img/favicon.ico"
  }
};

const IndexPageEditor: React.FC = () => {
  const [content, setContent] = useState<IndexPageContent>(initialContent);

  const updateContent = (section: keyof IndexPageContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateCarouselItem = (index: number, field: string, value: string) => {
    const newCarousel = [...content.hero.carousel];
    newCarousel[index] = { ...newCarousel[index], [field]: value };
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, carousel: newCarousel }
    }));
  };

  const updateTariffItem = (index: number, field: string, value: any) => {
    const newItems = [...content.tariffs.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent(prev => ({
      ...prev,
      tariffs: { ...prev.tariffs, items: newItems }
    }));
  };

  const updateSustainabilityParagraph = (index: number, value: string) => {
    const newParagraphs = [...content.sustainability.paragraphs];
    newParagraphs[index] = value;
    setContent(prev => ({
      ...prev,
      sustainability: { ...prev.sustainability, paragraphs: newParagraphs }
    }));
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Meta validation
    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    // Hero validation
    if (!content.hero.title.trim()) {
      errors.push('Hero ana başlık boş olamaz');
    }
    if (!content.hero.subtitle.trim()) {
      errors.push('Hero alt başlık boş olamaz');
    }

    // Carousel validation
    content.hero.carousel.forEach((item, index) => {
      if (!item.title.trim()) {
        errors.push(`Carousel kart ${index + 1} başlığı boş olamaz`);
      }
      if (!item.subtitle.trim()) {
        errors.push(`Carousel kart ${index + 1} alt başlığı boş olamaz`);
      }
      if (!item.buttonText.trim()) {
        errors.push(`Carousel kart ${index + 1} buton metni boş olamaz`);
      }
      if (!item.image.trim()) {
        errors.push(`Carousel kart ${index + 1} görsel yolu boş olamaz`);
      }
      if (!item.imageAlt.trim()) {
        errors.push(`Carousel kart ${index + 1} görsel alt metni boş olamaz`);
      }
    });

    // Service points validation
    if (!content.servicePoints.title.trim()) {
      errors.push('Hizmet noktaları başlığı boş olamaz');
    }
    if (!content.servicePoints.counter.trim()) {
      errors.push('Hizmet noktaları sayacı boş olamaz');
    }

    // Tariffs validation
    if (!content.tariffs.title.trim()) {
      errors.push('Tarifeler başlığı boş olamaz');
    }

    content.tariffs.items.forEach((item, index) => {
      if (!item.title.trim()) {
        errors.push(`Tarife ${index + 1} adı boş olamaz`);
      }
      if (!item.price.trim()) {
        errors.push(`Tarife ${index + 1} fiyatı boş olamaz`);
      }
      if (item.features.length === 0) {
        errors.push(`Tarife ${index + 1} en az bir özellik içermelidir`);
      }
    });

    // Mobile app validation
    if (!content.mobileApp.title.trim()) {
      errors.push('Mobil uygulama başlığı boş olamaz');
    }

    // Contact validation
    if (!content.contact.title.trim()) {
      errors.push('İletişim başlığı boş olamaz');
    }

    // Sustainability validation
    if (!content.sustainability.title.trim()) {
      errors.push('Sürdürülebilirlik başlığı boş olamaz');
    }

    // Branding validation
    if (!content.branding.logo.trim()) {
      errors.push('Ana logo yolu boş olamaz');
    }
    if (!content.branding.logoAlt.trim()) {
      errors.push('Ana logo alt metni boş olamaz');
    }

    // Partnerships validation
    content.partnerships.logos.forEach((logo, index) => {
      if (!logo.name.trim()) {
        errors.push(`Ortaklık ${index + 1} adı boş olamaz`);
      }
      if (!logo.image.trim()) {
        errors.push(`Ortaklık ${index + 1} logo yolu boş olamaz`);
      }
      if (!logo.alt.trim()) {
        errors.push(`Ortaklık ${index + 1} logo alt metni boş olamaz`);
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

      // Here you would typically send the content to your backend API
      // Example:
      // const response = await fetch('/api/content/index', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(content),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Kaydetme işlemi başarısız');
      // }

      // Simulate a successful save
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
          Ana Sayfa İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Ana sayfa içeriklerini düzenleyin
        </p>
      </div>

      <div className="space-y-6">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Genel Bilgiler
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Hero Bölümü
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Hizmetler
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Tarifeler
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Görseller
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Diğer Bölümler
              </Tab.Button>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800  shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Sayfa Meta Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Sayfa Başlığı</FormLabel>
                    <FormInput
                      value={content.meta.title}
                      onChange={(e) => updateContent('meta', 'title', e.target.value)}
                      placeholder="Sayfa başlığını girin"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Hero Bölümü</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Ana Başlık</FormLabel>
                      <FormTextarea
                        value={content.hero.title}
                        onChange={(e) => updateContent('hero', 'title', e.target.value)}
                        placeholder="Ana başlığı girin"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Alt Başlık</FormLabel>
                      <FormTextarea
                        value={content.hero.subtitle}
                        onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                        placeholder="Alt başlığı girin"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Carousel Kartları</h3>
                  <div className="space-y-6">
                    {content.hero.carousel.map((item, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700  p-4">
                        <h4 className="font-medium mb-3">Kart {index + 1}</h4>
                        <div className="space-y-3">
                          <div>
                            <FormLabel>Başlık</FormLabel>
                            <FormInput
                              value={item.title}
                              onChange={(e) => updateCarouselItem(index, 'title', e.target.value)}
                              placeholder="Kart başlığını girin"
                            />
                          </div>
                          <div>
                            <FormLabel>Alt Başlık</FormLabel>
                            <FormInput
                              value={item.subtitle}
                              onChange={(e) => updateCarouselItem(index, 'subtitle', e.target.value)}
                              placeholder="Kart alt başlığını girin"
                            />
                          </div>
                          <div>
                            <FormLabel>Buton Metni</FormLabel>
                            <FormInput
                              value={item.buttonText}
                              onChange={(e) => updateCarouselItem(index, 'buttonText', e.target.value)}
                              placeholder="Buton metnini girin"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Hizmet Noktaları</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.servicePoints.title}
                        onChange={(e) => updateContent('servicePoints', 'title', e.target.value)}
                        placeholder="Başlığı girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Sayaç</FormLabel>
                      <FormInput
                        value={content.servicePoints.counter}
                        onChange={(e) => updateContent('servicePoints', 'counter', e.target.value)}
                        placeholder="Sayaç değerini girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormTextarea
                        value={content.servicePoints.description}
                        onChange={(e) => updateContent('servicePoints', 'description', e.target.value)}
                        placeholder="Açıklamayı girin"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Buton Metni</FormLabel>
                      <FormInput
                        value={content.servicePoints.buttonText}
                        onChange={(e) => updateContent('servicePoints', 'buttonText', e.target.value)}
                        placeholder="Buton metnini girin"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Mobil Uygulama</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.mobileApp.title}
                        onChange={(e) => updateContent('mobileApp', 'title', e.target.value)}
                        placeholder="Başlığı girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormTextarea
                        value={content.mobileApp.description}
                        onChange={(e) => updateContent('mobileApp', 'description', e.target.value)}
                        placeholder="Açıklamayı girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>İndirme Metni</FormLabel>
                      <FormInput
                        value={content.mobileApp.downloadText}
                        onChange={(e) => updateContent('mobileApp', 'downloadText', e.target.value)}
                        placeholder="İndirme metnini girin"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Çözümler</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Bireysel Açıklama</FormLabel>
                      <FormTextarea
                        value={content.solutions.individualDescription}
                        onChange={(e) => updateContent('solutions', 'individualDescription', e.target.value)}
                        placeholder="Bireysel çözümler açıklaması"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Bireysel Buton Metni</FormLabel>
                      <FormInput
                        value={content.solutions.individualButtonText}
                        onChange={(e) => updateContent('solutions', 'individualButtonText', e.target.value)}
                        placeholder="Bireysel buton metni"
                      />
                    </div>
                    <div>
                      <FormLabel>Filo Açıklama</FormLabel>
                      <FormTextarea
                        value={content.solutions.fleetDescription}
                        onChange={(e) => updateContent('solutions', 'fleetDescription', e.target.value)}
                        placeholder="Filo çözümleri açıklaması"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Filo Buton Metni</FormLabel>
                      <FormInput
                        value={content.solutions.fleetButtonText}
                        onChange={(e) => updateContent('solutions', 'fleetButtonText', e.target.value)}
                        placeholder="Filo buton metni"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800  shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Tarifeler</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <FormLabel>Başlık</FormLabel>
                    <FormInput
                      value={content.tariffs.title}
                      onChange={(e) => updateContent('tariffs', 'title', e.target.value)}
                      placeholder="Tarifeler başlığı"
                    />
                  </div>
                  <div>
                    <FormLabel>Alt Başlık</FormLabel>
                    <FormInput
                      value={content.tariffs.subtitle}
                      onChange={(e) => updateContent('tariffs', 'subtitle', e.target.value)}
                      placeholder="Tarifeler alt başlığı"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {content.tariffs.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700  p-4">
                      <h4 className="font-medium mb-3">Tarife {index + 1}</h4>
                      <div className="space-y-3">
                        <div>
                          <FormLabel>Tarife Adı</FormLabel>
                          <FormInput
                            value={item.title}
                            onChange={(e) => updateTariffItem(index, 'title', e.target.value)}
                            placeholder="Tarife adını girin"
                          />
                        </div>
                        <div>
                          <FormLabel>Fiyat</FormLabel>
                          <FormInput
                            value={item.price}
                            onChange={(e) => updateTariffItem(index, 'price', e.target.value)}
                            placeholder="Fiyatı girin"
                          />
                        </div>
                        <div>
                          <FormLabel>Açıklama</FormLabel>
                          <FormInput
                            value={item.description}
                            onChange={(e) => updateTariffItem(index, 'description', e.target.value)}
                            placeholder="Açıklamayı girin"
                          />
                        </div>
                        <div>
                          <FormLabel>Özellikler (virgülle ayırın)</FormLabel>
                          <FormTextarea
                            value={item.features.join(', ')}
                            onChange={(e) => {
                              const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                              updateTariffItem(index, 'features', features);
                            }}
                            placeholder="Özellik 1, Özellik 2, Özellik 3"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.contact.title}
                        onChange={(e) => updateContent('contact', 'title', e.target.value)}
                        placeholder="İletişim başlığı"
                      />
                    </div>
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormTextarea
                        value={content.contact.description}
                        onChange={(e) => updateContent('contact', 'description', e.target.value)}
                        placeholder="İletişim açıklaması"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Buton Metni</FormLabel>
                      <FormInput
                        value={content.contact.buttonText}
                        onChange={(e) => updateContent('contact', 'buttonText', e.target.value)}
                        placeholder="Buton metni"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Sürdürülebilirlik</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.sustainability.title}
                        onChange={(e) => updateContent('sustainability', 'title', e.target.value)}
                        placeholder="Sürdürülebilirlik başlığı"
                      />
                    </div>
                    {content.sustainability.paragraphs.map((paragraph, index) => (
                      <div key={index}>
                        <FormLabel>Paragraf {index + 1}</FormLabel>
                        <FormTextarea
                          value={paragraph}
                          onChange={(e) => updateSustainabilityParagraph(index, e.target.value)}
                          placeholder={`Paragraf ${index + 1} içeriği`}
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ortaklıklar</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormInput
                        value={content.partnerships.description}
                        onChange={(e) => updateContent('partnerships', 'description', e.target.value)}
                        placeholder="Ortaklıklar açıklaması"
                      />
                    </div>
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.partnerships.title}
                        onChange={(e) => updateContent('partnerships', 'title', e.target.value)}
                        placeholder="Ortaklıklar başlığı"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Logo ve Marka Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.branding.logo}
                        onChange={(url) => updateContent('branding', 'logo', url)}
                        label="Ana Logo"
                        placeholder="Logo seçin..."
                      />
                      <div className="mt-3">
                        <FormLabel>Logo Alt Metni</FormLabel>
                        <FormInput
                          value={content.branding.logoAlt}
                          onChange={(e) => updateContent('branding', 'logoAlt', e.target.value)}
                          placeholder="Logo alt metni"
                        />
                      </div>
                    </div>
                    <div>
                      <ImageInput
                        value={content.branding.favicon}
                        onChange={(url) => updateContent('branding', 'favicon', url)}
                        label="Favicon"
                        placeholder="Favicon seçin..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Hero Bölümü Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Hero Video</FormLabel>
                      <FormInput
                        value={content.hero.videoSrc}
                        onChange={(e) => updateContent('hero', 'videoSrc', e.target.value)}
                        placeholder="Video dosya yolu"
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.hero.flashImage}
                        onChange={(url) => updateContent('hero', 'flashImage', url)}
                        label="Flash Efekt Görseli"
                        placeholder="Flash efekt görseli seçin..."
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.hero.backgroundImage}
                        onChange={(url) => updateContent('hero', 'backgroundImage', url)}
                        label="Arka Plan Görseli"
                        placeholder="Arka plan görseli seçin..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Carousel Kart Görselleri</h3>
                  <div className="space-y-6">
                    {content.hero.carousel.map((item, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700  p-4">
                        <h4 className="font-medium mb-3">Kart {index + 1} Görseli</h4>
                        <div className="space-y-3">
                          <div>
                            <ImageInput
                              value={item.image}
                              onChange={(url) => updateCarouselItem(index, 'image', url)}
                              label="Kart Görseli"
                              placeholder="Görsel seçin..."
                            />
                          </div>
                          <div>
                            <FormLabel>Alt Metni</FormLabel>
                            <FormInput
                              value={item.imageAlt}
                              onChange={(e) => updateCarouselItem(index, 'imageAlt', e.target.value)}
                              placeholder="Görsel alt metni"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Hizmet Noktaları Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.servicePoints.mapImage}
                        onChange={(url) => updateContent('servicePoints', 'mapImage', url)}
                        label="Harita İkonu"
                        placeholder="Harita ikonu seçin..."
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.servicePoints.iconImage}
                        onChange={(url) => updateContent('servicePoints', 'iconImage', url)}
                        label="İstasyon İkonu"
                        placeholder="İstasyon ikonu seçin..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Tarife İkonları</h3>
                  <div className="space-y-6">
                    {content.tariffs.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700  p-4">
                        <h4 className="font-medium mb-3">{item.title} İkonu</h4>
                        <div>
                          <ImageInput
                            value={item.icon}
                            onChange={(url) => updateTariffItem(index, 'icon', url)}
                            label="Tarife İkonu"
                            placeholder="İkon seçin..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Mobil Uygulama Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.mobileApp.appImage}
                        onChange={(url) => updateContent('mobileApp', 'appImage', url)}
                        label="Uygulama Görseli"
                        placeholder="Uygulama görseli seçin..."
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.mobileApp.appStoreIcon}
                        onChange={(url) => updateContent('mobileApp', 'appStoreIcon', url)}
                        label="App Store İkonu"
                        placeholder="App Store ikonu seçin..."
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.mobileApp.googlePlayIcon}
                        onChange={(url) => updateContent('mobileApp', 'googlePlayIcon', url)}
                        label="Google Play İkonu"
                        placeholder="Google Play ikonu seçin..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ortaklık Logoları</h3>
                  <div className="space-y-6">
                    {content.partnerships.logos.map((logo, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700  p-4">
                        <h4 className="font-medium mb-3">{logo.name} Logosu</h4>
                        <div className="space-y-3">
                          <div>
                            <ImageInput
                              value={logo.image}
                              onChange={(url) => {
                                const newLogos = [...content.partnerships.logos];
                                newLogos[index] = { ...newLogos[index], image: url };
                                setContent(prev => ({
                                  ...prev,
                                  partnerships: { ...prev.partnerships, logos: newLogos }
                                }));
                              }}
                              label="Ortaklık Logosu"
                              placeholder="Logo seçin..."
                            />
                          </div>
                          <div>
                            <FormLabel>Alt Metni</FormLabel>
                            <FormInput
                              value={logo.alt}
                              onChange={(e) => {
                                const newLogos = [...content.partnerships.logos];
                                newLogos[index] = { ...newLogos[index], alt: e.target.value };
                                setContent(prev => ({
                                  ...prev,
                                  partnerships: { ...prev.partnerships, logos: newLogos }
                                }));
                              }}
                              placeholder="Logo alt metni"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.contact.title}
                        onChange={(e) => updateContent('contact', 'title', e.target.value)}
                        placeholder="İletişim başlığı"
                      />
                    </div>
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormTextarea
                        value={content.contact.description}
                        onChange={(e) => updateContent('contact', 'description', e.target.value)}
                        placeholder="İletişim açıklaması"
                        rows={2}
                      />
                    </div>
                    <div>
                      <FormLabel>Buton Metni</FormLabel>
                      <FormInput
                        value={content.contact.buttonText}
                        onChange={(e) => updateContent('contact', 'buttonText', e.target.value)}
                        placeholder="Buton metni"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Sürdürülebilirlik</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.sustainability.title}
                        onChange={(e) => updateContent('sustainability', 'title', e.target.value)}
                        placeholder="Sürdürülebilirlik başlığı"
                      />
                    </div>
                    {content.sustainability.paragraphs.map((paragraph, index) => (
                      <div key={index}>
                        <FormLabel>Paragraf {index + 1}</FormLabel>
                        <FormTextarea
                          value={paragraph}
                          onChange={(e) => updateSustainabilityParagraph(index, e.target.value)}
                          placeholder={`Paragraf ${index + 1} içeriği`}
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800  shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ortaklıklar</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Açıklama</FormLabel>
                      <FormInput
                        value={content.partnerships.description}
                        onChange={(e) => updateContent('partnerships', 'description', e.target.value)}
                        placeholder="Ortaklıklar açıklaması"
                      />
                    </div>
                    <div>
                      <FormLabel>Başlık</FormLabel>
                      <FormInput
                        value={content.partnerships.title}
                        onChange={(e) => updateContent('partnerships', 'title', e.target.value)}
                        placeholder="Ortaklıklar başlığı"
                      />
                    </div>
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

export default IndexPageEditor;