import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface CorporateSolutionsPageContent {
  meta: {
    title: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  solution: {
    title: string;
    description: string;
    mainImage: string;
    mainImageAlt: string;
  };
  corporateCards: {
    mainTitle: string;
    cards: Array<{
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }>;
  };
  panelsSection: {
    panels: Array<{
      title: string;
      description: string;
      colorClass: string;
    }>;
  };
  contact: {
    heading: string;
    description: string;
    buttonText: string;
    buttonIcon: string;
  };
  partnerships: {
    description: string;
    heading: string;
    logos: Array<{
      name: string;
      image: string;
      alt: string;
    }>;
  };
}

const initialContent: CorporateSolutionsPageContent = {
  meta: {
    title: "Kurumsal Çözümler - Ovolt"
  },
  pageHero: {
    backgroundImage: "assets/img/kurumsal-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  solution: {
    title: "Kurumsal Çözümler",
    description: "Ovolt, Opet iş birliği ile Türkiye genelinde hibrit enerji yaklaşımı sunarak, elektrik ve akaryakıt satışını bir arada buluşturuyor. Bu güçlü altyapı sayesinde, işletmeler hem elektrikli araç şarj hizmeti hem de akaryakıt çözümlerini tek noktadan yönetebiliyor.",
    mainImage: "assets/img/kurumsal-main-image.jpg",
    mainImageAlt: "Kurumsal Çözümler Ana Görsel"
  },
  corporateCards: {
    mainTitle: "İşletmelere Özel Çözümler",
    cards: [
      {
        title: "Ağ Entegrasyonu",
        description: "Şarj ünitelerinizi Ovolt ağına dahil ederek, işletmenizin gelir modeline katkı sağlıyoruz.",
        image: "assets/img/corporate-card-1.jpg",
        imageAlt: "Ağ Entegrasyonu"
      },
      {
        title: "Filo Dönüşüm Desteği",
        description: "Akaryakıttan elektriğe geçiş sürecinizde Ovolt çözümleriyle yanınızdayız.",
        image: "assets/img/corporate-card-2.jpg",
        imageAlt: "Filo Dönüşüm Desteği"
      },
      {
        title: "Merkezi Yönetim",
        description: "Şarj ünitelerinizi kolayca yönetebileceğiniz, kullanım raporlarına erişebileceğiniz gelişmiş bir yazılım paneli sunuyoruz.",
        image: "assets/img/corporate-card-3.jpg",
        imageAlt: "Merkezi Yönetim"
      }
    ]
  },
  panelsSection: {
    panels: [
      {
        title: "Yönetim Paneli",
        description: "Şarj ünitelerinizin uzaktan yönetimi, kullanıcı tanımlamaları ve yetkilendirme işlemleri tek bir panel üzerinden yapılabilir.",
        colorClass: "blue"
      },
      {
        title: "Raporlama Paneli",
        description: "Tüm şarj işlemlerine ait detaylı veriler, grafiklerle desteklenmiş raporlarla kolayca görüntülenebilir.",
        colorClass: "yellow"
      },
      {
        title: "Filo Paneli",
        description: "Filo müşterileri, araçlarını yönetebilir, şarj limitleri tanımlayabilir ve kullanım verilerini kontrol altında tutabilir.",
        colorClass: "teal"
      },
      {
        title: "Mobil Uygulama",
        description: "Kullanıcılar, şarj noktalarını harita üzerinden görüntüleyebilir, ünitelerde şarja başlayabilir ve ödemelerini kolayca yapabilir.",
        colorClass: "light-green"
      }
    ]
  },
  contact: {
    heading: "Bize Ulaşın",
    description: "Bireysel ve kurumsal\nçözümlerimizle ilgili bilgi almak\niçin bizimle iletişime geçin",
    buttonText: "İletişim Formu",
    buttonIcon: "assets/img/arrow-line-right-black.svg"
  },
  partnerships: {
    description: "En iyilerle ortaklık kuruyoruz",
    heading: "Güçlü İş Ortaklarımızla\nGüçlü Adımlar",
    logos: [
      { name: "Opet", image: "assets/img/opet-logo.png", alt: "Opet Logo" },
      { name: "Regnum", image: "assets/img/regnum-logo.png", alt: "Regnum Logo" },
      { name: "SolarEdge", image: "assets/img/solareg-logo.png", alt: "SolarEdge Logo" }
    ]
  }
};

const CorporateSolutionsPageEditor: React.FC = () => {
  const [content, setContent] = useState<CorporateSolutionsPageContent>(initialContent);

  const updateContent = (section: keyof CorporateSolutionsPageContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateCorporateCard = (index: number, field: string, value: string) => {
    const newCards = [...content.corporateCards.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setContent(prev => ({
      ...prev,
      corporateCards: { ...prev.corporateCards, cards: newCards }
    }));
  };

  const updatePanel = (index: number, field: string, value: string) => {
    const newPanels = [...content.panelsSection.panels];
    newPanels[index] = { ...newPanels[index], [field]: value };
    setContent(prev => ({
      ...prev,
      panelsSection: { ...prev.panelsSection, panels: newPanels }
    }));
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Meta validation
    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    // Solution section validation
    if (!content.solution.title.trim()) {
      errors.push('Çözümler ana başlık boş olamaz');
    }
    if (!content.solution.description.trim()) {
      errors.push('Çözümler açıklama boş olamaz');
    }

    // Corporate cards validation
    if (!content.corporateCards.mainTitle.trim()) {
      errors.push('Kurumsal kartlar ana başlığı boş olamaz');
    }

    content.corporateCards.cards.forEach((card, index) => {
      if (!card.title.trim()) {
        errors.push(`Kurumsal kart ${index + 1} başlığı boş olamaz`);
      }
      if (!card.description.trim()) {
        errors.push(`Kurumsal kart ${index + 1} açıklaması boş olamaz`);
      }
      if (!card.image.trim()) {
        errors.push(`Kurumsal kart ${index + 1} görsel yolu boş olamaz`);
      }
      if (!card.imageAlt.trim()) {
        errors.push(`Kurumsal kart ${index + 1} görsel alt metni boş olamaz`);
      }
    });

    // Panels validation
    content.panelsSection.panels.forEach((panel, index) => {
      if (!panel.title.trim()) {
        errors.push(`Panel ${index + 1} başlığı boş olamaz`);
      }
      if (!panel.description.trim()) {
        errors.push(`Panel ${index + 1} açıklaması boş olamaz`);
      }
    });

    // Contact validation
    if (!content.contact.heading.trim()) {
      errors.push('İletişim başlığı boş olamaz');
    }
    if (!content.contact.buttonText.trim()) {
      errors.push('İletişim buton metni boş olamaz');
    }

    // Partnerships validation
    if (!content.partnerships.description.trim()) {
      errors.push('Ortaklıklar açıklaması boş olamaz');
    }
    if (!content.partnerships.heading.trim()) {
      errors.push('Ortaklıklar başlığı boş olamaz');
    }

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
      // const response = await fetch('/api/content/corporate-solutions', {
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
          Kurumsal Çözümler Sayfası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Kurumsal çözümler sayfası içeriklerini düzenleyin
        </p>
      </div>

      <div className="space-y-6">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Ana Çözümler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Kurumsal Kartlar
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Paneller
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İletişim & Ortaklıklar
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Görseller
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 shadow p-6">
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
              <div className="bg-white dark:bg-gray-800 shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ana Çözümler Bölümü</h3>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Ana Başlık</FormLabel>
                    <FormInput
                      value={content.solution.title}
                      onChange={(e) => updateContent('solution', 'title', e.target.value)}
                      placeholder="Ana başlığı girin"
                    />
                  </div>
                  <div>
                    <FormLabel>Ana Açıklama</FormLabel>
                    <FormTextarea
                      value={content.solution.description}
                      onChange={(e) => updateContent('solution', 'description', e.target.value)}
                      placeholder="Ana açıklamayı girin"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Kurumsal Kartlar Bölümü</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Ana Başlık</FormLabel>
                      <FormInput
                        value={content.corporateCards.mainTitle}
                        onChange={(e) => updateContent('corporateCards', 'mainTitle', e.target.value)}
                        placeholder="Kurumsal kartlar ana başlığını girin"
                      />
                    </div>
                  </div>
                </div>

                {content.corporateCards.cards.map((card, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Kurumsal Kart {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Kart Başlığı</FormLabel>
                        <FormInput
                          value={card.title}
                          onChange={(e) => updateCorporateCard(index, 'title', e.target.value)}
                          placeholder={`Kart ${index + 1} başlığını girin`}
                        />
                      </div>
                      <div>
                        <FormLabel>Kart Açıklaması</FormLabel>
                        <FormTextarea
                          value={card.description}
                          onChange={(e) => updateCorporateCard(index, 'description', e.target.value)}
                          placeholder={`Kart ${index + 1} açıklamasını girin`}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                {content.panelsSection.panels.map((panel, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Panel {index + 1} - {panel.title}</h3>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Panel Başlığı</FormLabel>
                        <FormInput
                          value={panel.title}
                          onChange={(e) => updatePanel(index, 'title', e.target.value)}
                          placeholder={`Panel ${index + 1} başlığını girin`}
                        />
                      </div>
                      <div>
                        <FormLabel>Panel Açıklaması</FormLabel>
                        <FormTextarea
                          value={panel.description}
                          onChange={(e) => updatePanel(index, 'description', e.target.value)}
                          placeholder={`Panel ${index + 1} açıklamasını girin`}
                          rows={3}
                        />
                      </div>
                      <div>
                        <FormLabel>Renk Sınıfı</FormLabel>
                        <FormInput
                          value={panel.colorClass}
                          onChange={(e) => updatePanel(index, 'colorClass', e.target.value)}
                          placeholder="Renk sınıfını girin (blue, yellow, teal, light-green)"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">İletişim Bölümü</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>İletişim Başlığı</FormLabel>
                      <FormInput
                        value={content.contact.heading}
                        onChange={(e) => updateContent('contact', 'heading', e.target.value)}
                        placeholder="İletişim başlığını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>İletişim Açıklaması</FormLabel>
                      <FormTextarea
                        value={content.contact.description}
                        onChange={(e) => updateContent('contact', 'description', e.target.value)}
                        placeholder="İletişim açıklamasını girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Buton Metni</FormLabel>
                      <FormInput
                        value={content.contact.buttonText}
                        onChange={(e) => updateContent('contact', 'buttonText', e.target.value)}
                        placeholder="Buton metnini girin"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ortaklıklar Bölümü</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Ortaklıklar Açıklaması</FormLabel>
                      <FormInput
                        value={content.partnerships.description}
                        onChange={(e) => updateContent('partnerships', 'description', e.target.value)}
                        placeholder="Ortaklıklar açıklamasını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Ortaklıklar Başlığı</FormLabel>
                      <FormTextarea
                        value={content.partnerships.heading}
                        onChange={(e) => updateContent('partnerships', 'heading', e.target.value)}
                        placeholder="Ortaklıklar başlığını girin"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Sayfa Hero Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.pageHero.backgroundImage}
                        onChange={(url) => updateContent('pageHero', 'backgroundImage', url)}
                        label="Arka Plan Görseli"
                        placeholder="Arka plan görseli seçin..."
                      />
                    </div>
                    <div>
                      <ImageInput
                        value={content.pageHero.logoImage}
                        onChange={(url) => updateContent('pageHero', 'logoImage', url)}
                        label="Hero Logo"
                        placeholder="Hero logo seçin..."
                      />
                      <div className="mt-3">
                        <FormLabel>Logo Alt Metni</FormLabel>
                        <FormInput
                          value={content.pageHero.logoAlt}
                          onChange={(e) => updateContent('pageHero', 'logoAlt', e.target.value)}
                          placeholder="Logo alt metni"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ana Çözümler Görseli</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.solution.mainImage}
                        onChange={(url) => updateContent('solution', 'mainImage', url)}
                        label="Ana Görsel"
                        placeholder="Ana görsel seçin..."
                      />
                      <div className="mt-3">
                        <FormLabel>Ana Görsel Alt Metni</FormLabel>
                        <FormInput
                          value={content.solution.mainImageAlt}
                          onChange={(e) => updateContent('solution', 'mainImageAlt', e.target.value)}
                          placeholder="Ana görsel alt metni"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Kurumsal Kart Görselleri</h3>
                  <div className="space-y-6">
                    {content.corporateCards.cards.map((card, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-medium mb-3">Kart {index + 1} - {card.title}</h4>
                        <div className="space-y-3">
                          <div>
                            <ImageInput
                              value={card.image}
                              onChange={(url) => updateCorporateCard(index, 'image', url)}
                              label="Kart Görseli"
                              placeholder="Görsel seçin..."
                            />
                          </div>
                          <div>
                            <FormLabel>Görsel Alt Metni</FormLabel>
                            <FormInput
                              value={card.imageAlt}
                              onChange={(e) => updateCorporateCard(index, 'imageAlt', e.target.value)}
                              placeholder="Görsel alt metni"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">İletişim Buton İkonu</h3>
                  <div>
                    <ImageInput
                      value={content.contact.buttonIcon}
                      onChange={(url) => updateContent('contact', 'buttonIcon', url)}
                      label="Buton İkonu"
                      placeholder="Buton ikonu seçin..."
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ortaklık Logoları</h3>
                  <div className="space-y-6">
                    {content.partnerships.logos.map((logo, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 p-4">
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

export default CorporateSolutionsPageEditor;