import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface AboutPageContent {
  meta: {
    title: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  about: {
    title: string;
    description: string;
    mainImage: string;
    mainImageAlt: string;
    detailsImage: string;
    detailsImageAlt: string;
    detailsParagraphs: string[];
  };
  missionVision: {
    vision: {
      title: string;
      quote: string;
      description: string;
    };
    mission: {
      title: string;
      quote: string;
      description: string;
    };
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

const initialContent: AboutPageContent = {
  meta: {
    title: "Ovolt - Elektrikli Araç Şarj İstasyonu"
  },
  pageHero: {
    backgroundImage: "assets/img/hakkimizda-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  about: {
    title: "Geleceğin enerjisini\nbugünden hayata\ngeçiriyoruz!",
    description: "Ovolt, elektrikli araç sahiplerine hızlı, güvenilir ve kolay erişilebilir şarj çözümleri sunmak amacıyla kurulmuş, Türkiye'nin hızla büyüyen elektrikli araç şarj ağı markasıdır.",
    mainImage: "assets/img/about-main-image.jpg",
    mainImageAlt: "Ovolt Hakkında Ana Görsel",
    detailsImage: "assets/img/about-details-image.jpg",
    detailsImageAlt: "Ovolt Detay Görseli",
    detailsParagraphs: [
      "UNIVOLT venture capital çatısı altında faaliyet gösteren Ovolt, genişleyen altyapısı ile Türkiye genelinde sürdürülebilir ulaşımın öncüsü olmayı hedeflemektedir. UNIVOLT'un benzersiz roaming altyapısı sayesinde kullanıcılar, tek bir platform üzerinden farklı şarj istasyonlarında kesintisiz ve zahmetsiz bir deneyim yaşayabilir.",
      "Ovolt, Türkiye'nin enerji devlerinden biri olan Opet ile güçlü iş birliği içerisindedir. Bu ortaklık sayesinde elektrikli araç kullanıcılarının hayatını kolaylaştırmak amacıyla ülke genelinde yaygın bir şarj ağı kurmayı hedeflemektedir. Ovolt istasyonları, stratejik konumlarda (özellikle Opet istasyonlarında) konumlanarak elektrikli araç kullanıcılarına her an, her yerde güvenli ve hızlı enerji erişimi sağlamak üzere tasarlanmıştır."
    ]
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

const AboutPageEditor: React.FC = () => {
  const [content, setContent] = useState<AboutPageContent>(initialContent);

  const updateContent = (section: keyof AboutPageContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedContent = (section: keyof AboutPageContent, subsection: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const updateDetailsParagraph = (index: number, value: string) => {
    const newParagraphs = [...content.about.detailsParagraphs];
    newParagraphs[index] = value;
    setContent(prev => ({
      ...prev,
      about: { ...prev.about, detailsParagraphs: newParagraphs }
    }));
  };

  const validateContent = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Meta validation
    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    // About section validation
    if (!content.about.title.trim()) {
      errors.push('Hakkımızda ana başlık boş olamaz');
    }
    if (!content.about.description.trim()) {
      errors.push('Hakkımızda açıklama boş olamaz');
    }

    // Details paragraphs validation
    content.about.detailsParagraphs.forEach((paragraph, index) => {
      if (!paragraph.trim()) {
        errors.push(`Detay paragraf ${index + 1} boş olamaz`);
      }
    });

    // Mission & Vision validation
    if (!content.missionVision.vision.title.trim()) {
      errors.push('Vizyon başlığı boş olamaz');
    }
    if (!content.missionVision.vision.quote.trim()) {
      errors.push('Vizyon alıntısı boş olamaz');
    }
    if (!content.missionVision.mission.title.trim()) {
      errors.push('Misyon başlığı boş olamaz');
    }
    if (!content.missionVision.mission.quote.trim()) {
      errors.push('Misyon alıntısı boş olamaz');
    }

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
      // const response = await fetch('/api/content/about', {
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
          Hakkımızda Sayfası İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Hakkımızda sayfası içeriklerini düzenleyin
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
                Ana Bölüm
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Misyon & Vizyon
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                İletişim & Ortaklıklar
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button className="px-4 py-2 mr-4 border-b-2 font-medium text-sm">
                Görseller
              </Tab.Button>
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
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Ana Hakkımızda Bölümü</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Ana Başlık</FormLabel>
                      <FormTextarea
                        value={content.about.title}
                        onChange={(e) => updateContent('about', 'title', e.target.value)}
                        placeholder="Ana başlığı girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Ana Açıklama</FormLabel>
                      <FormTextarea
                        value={content.about.description}
                        onChange={(e) => updateContent('about', 'description', e.target.value)}
                        placeholder="Ana açıklamayı girin"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Detay Bölümü</h3>
                  <div className="space-y-4">
                    {content.about.detailsParagraphs.map((paragraph, index) => (
                      <div key={index}>
                        <FormLabel>Detay Paragraf {index + 1}</FormLabel>
                        <FormTextarea
                          value={paragraph}
                          onChange={(e) => updateDetailsParagraph(index, e.target.value)}
                          placeholder={`Detay paragraf ${index + 1} içeriği`}
                          rows={4}
                        />
                      </div>
                    ))}
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
                        value={content.missionVision.vision.title}
                        onChange={(e) => updateNestedContent('missionVision', 'vision', 'title', e.target.value)}
                        placeholder="Vizyon başlığını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Vizyon Alıntısı</FormLabel>
                      <FormTextarea
                        value={content.missionVision.vision.quote}
                        onChange={(e) => updateNestedContent('missionVision', 'vision', 'quote', e.target.value)}
                        placeholder="Vizyon alıntısını girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Vizyon Açıklaması</FormLabel>
                      <FormTextarea
                        value={content.missionVision.vision.description}
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
                        value={content.missionVision.mission.title}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'title', e.target.value)}
                        placeholder="Misyon başlığını girin"
                      />
                    </div>
                    <div>
                      <FormLabel>Misyon Alıntısı</FormLabel>
                      <FormTextarea
                        value={content.missionVision.mission.quote}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'quote', e.target.value)}
                        placeholder="Misyon alıntısını girin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <FormLabel>Misyon Açıklaması</FormLabel>
                      <FormTextarea
                        value={content.missionVision.mission.description}
                        onChange={(e) => updateNestedContent('missionVision', 'mission', 'description', e.target.value)}
                        placeholder="Misyon açıklamasını girin"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
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
                  <h3 className="text-lg font-semibold mb-4">Hakkımızda Bölümü Görselleri</h3>
                  <div className="space-y-4">
                    <div>
                      <ImageInput
                        value={content.about.mainImage}
                        onChange={(url) => updateContent('about', 'mainImage', url)}
                        label="Ana Görsel"
                        placeholder="Ana görsel seçin..."
                      />
                      <div className="mt-3">
                        <FormLabel>Ana Görsel Alt Metni</FormLabel>
                        <FormInput
                          value={content.about.mainImageAlt}
                          onChange={(e) => updateContent('about', 'mainImageAlt', e.target.value)}
                          placeholder="Ana görsel alt metni"
                        />
                      </div>
                    </div>
                    <div>
                      <ImageInput
                        value={content.about.detailsImage}
                        onChange={(url) => updateContent('about', 'detailsImage', url)}
                        label="Detay Görseli"
                        placeholder="Detay görseli seçin..."
                      />
                      <div className="mt-3">
                        <FormLabel>Detay Görsel Alt Metni</FormLabel>
                        <FormInput
                          value={content.about.detailsImageAlt}
                          onChange={(e) => updateContent('about', 'detailsImageAlt', e.target.value)}
                          placeholder="Detay görsel alt metni"
                        />
                      </div>
                    </div>
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

export default AboutPageEditor;