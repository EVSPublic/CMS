import React from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import { useContentManager } from '../../hooks/useContentManager';
import ContentToolbar from '../../components/ContentManagement/ContentToolbar';

interface TarifelerPageContent {
  meta: {
    title: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  pageHeader: {
    title: string;
    description: string;
  };
  campaignTariffs: {
    cards: Array<{
      badge: string;
      title: string;
      oldPrice: string;
      currentPrice: string;
      unit: string;
      validityText: string;
      buttonText: string;
    }>;
  };
  normalTariffs: {
    cards: Array<{
      title: string;
      currentPrice: string;
      unit: string;
      buttonText: string;
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

const initialContent: TarifelerPageContent = {
  meta: {
    title: "Tarifeler - Ovolt"
  },
  pageHero: {
    backgroundImage: "assets/img/tarifeler-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  pageHeader: {
    title: "Tarifeler",
    description: "Ovolt, elektrikli aracınız için yüksek kaliteli, güvenilir ve erişilebilir şarj çözümleri sunar."
  },
  campaignTariffs: {
    cards: [
      {
        badge: "Kampanyalı Tarife",
        title: "AC Soket Tarifesi",
        oldPrice: "₺10.99",
        currentPrice: "₺8.99",
        unit: "kwh",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir",
        buttonText: "İstasyonları Keşfet"
      },
      {
        badge: "Kampanyalı Tarife",
        title: "60 kW'a Kadar Tüm DC Soketler",
        oldPrice: "₺11.99",
        currentPrice: "₺9.99",
        unit: "kwh",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir",
        buttonText: "İstasyonları Keşfet"
      },
      {
        badge: "Kampanyalı Tarife",
        title: "Diğer Tüm DC Soketler",
        oldPrice: "₺13.99",
        currentPrice: "₺11.99",
        unit: "kwh",
        validityText: "30-31 ağustos tarihleri arasında geçerlidir",
        buttonText: "İstasyonları Keşfet"
      }
    ]
  },
  normalTariffs: {
    cards: [
      {
        title: "AC Soket Tarifesi",
        currentPrice: "₺8.99",
        unit: "kwh",
        buttonText: "İstasyonları Keşfet"
      },
      {
        title: "60 kW'a Kadar Tüm DC Soketler",
        currentPrice: "₺8.99",
        unit: "kwh",
        buttonText: "İstasyonları Keşfet"
      },
      {
        title: "Diğer Tüm DC Soketler",
        currentPrice: "₺8.99",
        unit: "kwh",
        buttonText: "İstasyonları Keşfet"
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

const TarifelerPageEditor: React.FC = () => {
  const contentManager = useContentManager({
    pageId: 'tarifeler',
    initialContent,
    autoSave: false
  });

  const { content, setContent, updateContent } = contentManager;

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


  return (
    <div>
      <ContentToolbar
        contentManager={contentManager}
        pageTitle="Tarifeler İçerik Editörü"
      />

      <div className="p-6">

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Kampanyalı Tarifeler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Normal Tarifeler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İletişim & Ortaklıklar
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
                    placeholder="Tarifeler - Ovolt"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="pageHeader.title">Ana Başlık</FormLabel>
                  <FormInput
                    id="pageHeader.title"
                    value={content.pageHeader.title}
                    onChange={(e) => updateContent('pageHeader.title', e.target.value)}
                    placeholder="Tarifeler"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="pageHeader.description">Sayfa Açıklaması</FormLabel>
                  <FormTextarea
                    id="pageHeader.description"
                    value={content.pageHeader.description}
                    onChange={(e) => updateContent('pageHeader.description', e.target.value)}
                    rows={3}
                    placeholder="Ovolt, elektrikli aracınız için yüksek kaliteli, güvenilir ve erişilebilir şarj çözümleri sunar."
                  />
                </div>
              </div>
            </Tab.Panel>

            {/* Kampanyalı Tarifeler */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kampanyalı Tarifeler</h3>
                  <Button
                    variant="primary"
                    onClick={() => addArrayItem('campaignTariffs.cards', {
                      badge: "Kampanyalı Tarife",
                      title: "",
                      oldPrice: "",
                      currentPrice: "",
                      unit: "kwh",
                      validityText: "",
                      buttonText: "İstasyonları Keşfet"
                    })}
                  >
                    Yeni Kampanyalı Tarife Ekle
                  </Button>
                </div>

                {content.campaignTariffs.cards.map((card: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Kampanyalı Tarife {index + 1}</h4>
                      <Button
                        variant="soft-secondary"
                        onClick={() => removeArrayItem('campaignTariffs.cards', index)}
                      >
                        Sil
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor={`campaign-badge-${index}`}>Rozet Metni</FormLabel>
                        <FormInput
                          id={`campaign-badge-${index}`}
                          value={card.badge}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'badge', e.target.value)}
                          placeholder="Kampanyalı Tarife"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`campaign-title-${index}`}>Başlık</FormLabel>
                        <FormInput
                          id={`campaign-title-${index}`}
                          value={card.title}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'title', e.target.value)}
                          placeholder="AC Soket Tarifesi"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`campaign-old-price-${index}`}>Eski Fiyat</FormLabel>
                        <FormInput
                          id={`campaign-old-price-${index}`}
                          value={card.oldPrice}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'oldPrice', e.target.value)}
                          placeholder="₺10.99"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`campaign-current-price-${index}`}>Güncel Fiyat</FormLabel>
                        <FormInput
                          id={`campaign-current-price-${index}`}
                          value={card.currentPrice}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'currentPrice', e.target.value)}
                          placeholder="₺8.99"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`campaign-unit-${index}`}>Birim</FormLabel>
                        <FormInput
                          id={`campaign-unit-${index}`}
                          value={card.unit}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'unit', e.target.value)}
                          placeholder="kwh"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`campaign-button-${index}`}>Buton Metni</FormLabel>
                        <FormInput
                          id={`campaign-button-${index}`}
                          value={card.buttonText}
                          onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'buttonText', e.target.value)}
                          placeholder="İstasyonları Keşfet"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <FormLabel htmlFor={`campaign-validity-${index}`}>Geçerlilik Metni</FormLabel>
                      <FormTextarea
                        id={`campaign-validity-${index}`}
                        value={card.validityText}
                        onChange={(e) => updateArrayItem('campaignTariffs.cards', index, 'validityText', e.target.value)}
                        rows={2}
                        placeholder="30-31 ağustos tarihleri arasında geçerlidir"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {/* Normal Tarifeler */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Normal Tarifeler</h3>
                  <Button
                    variant="primary"
                    onClick={() => addArrayItem('normalTariffs.cards', {
                      title: "",
                      currentPrice: "",
                      unit: "kwh",
                      buttonText: "İstasyonları Keşfet"
                    })}
                  >
                    Yeni Normal Tarife Ekle
                  </Button>
                </div>

                {content.normalTariffs.cards.map((card: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Normal Tarife {index + 1}</h4>
                      <Button
                        variant="soft-secondary"
                        onClick={() => removeArrayItem('normalTariffs.cards', index)}
                      >
                        Sil
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor={`normal-title-${index}`}>Başlık</FormLabel>
                        <FormInput
                          id={`normal-title-${index}`}
                          value={card.title}
                          onChange={(e) => updateArrayItem('normalTariffs.cards', index, 'title', e.target.value)}
                          placeholder="AC Soket Tarifesi"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`normal-current-price-${index}`}>Fiyat</FormLabel>
                        <FormInput
                          id={`normal-current-price-${index}`}
                          value={card.currentPrice}
                          onChange={(e) => updateArrayItem('normalTariffs.cards', index, 'currentPrice', e.target.value)}
                          placeholder="₺8.99"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`normal-unit-${index}`}>Birim</FormLabel>
                        <FormInput
                          id={`normal-unit-${index}`}
                          value={card.unit}
                          onChange={(e) => updateArrayItem('normalTariffs.cards', index, 'unit', e.target.value)}
                          placeholder="kwh"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`normal-button-${index}`}>Buton Metni</FormLabel>
                        <FormInput
                          id={`normal-button-${index}`}
                          value={card.buttonText}
                          onChange={(e) => updateArrayItem('normalTariffs.cards', index, 'buttonText', e.target.value)}
                          placeholder="İstasyonları Keşfet"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {/* İletişim & Ortaklıklar */}
            <Tab.Panel className="p-6">
              <div className="space-y-8">
                {/* İletişim */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim Bölümü</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel htmlFor="contact.heading">Başlık</FormLabel>
                      <FormInput
                        id="contact.heading"
                        value={content.contact.heading}
                        onChange={(e) => updateContent('contact.heading', e.target.value)}
                        placeholder="Bize Ulaşın"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="contact.description">Açıklama</FormLabel>
                      <FormTextarea
                        id="contact.description"
                        value={content.contact.description}
                        onChange={(e) => updateContent('contact.description', e.target.value)}
                        rows={3}
                        placeholder="Bireysel ve kurumsal çözümlerimizle ilgili bilgi almak için bizimle iletişime geçin"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="contact.buttonText">Buton Metni</FormLabel>
                      <FormInput
                        id="contact.buttonText"
                        value={content.contact.buttonText}
                        onChange={(e) => updateContent('contact.buttonText', e.target.value)}
                        placeholder="İletişim Formu"
                      />
                    </div>
                  </div>
                </div>

                {/* Ortaklıklar */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ortaklıklar Bölümü</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel htmlFor="partnerships.description">Açıklama</FormLabel>
                      <FormInput
                        id="partnerships.description"
                        value={content.partnerships.description}
                        onChange={(e) => updateContent('partnerships.description', e.target.value)}
                        placeholder="En iyilerle ortaklık kuruyoruz"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="partnerships.heading">Başlık</FormLabel>
                      <FormTextarea
                        id="partnerships.heading"
                        value={content.partnerships.heading}
                        onChange={(e) => updateContent('partnerships.heading', e.target.value)}
                        rows={2}
                        placeholder="Güçlü İş Ortaklarımızla Güçlü Adımlar"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Ortaklık Logoları</h4>
                      <Button
                        variant="primary"
                        onClick={() => addArrayItem('partnerships.logos', {
                          name: "",
                          image: "",
                          alt: ""
                        })}
                      >
                        Yeni Logo Ekle
                      </Button>
                    </div>

                    {content.partnerships.logos.map((logo: any, index: number) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-white">Logo {index + 1}</h5>
                          <Button
                            variant="soft-secondary"
                            onClick={() => removeArrayItem('partnerships.logos', index)}
                          >
                            Sil
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormLabel htmlFor={`logo-name-${index}`}>Şirket Adı</FormLabel>
                            <FormInput
                              id={`logo-name-${index}`}
                              value={logo.name}
                              onChange={(e) => updateArrayItem('partnerships.logos', index, 'name', e.target.value)}
                              placeholder="Opet"
                            />
                          </div>

                          <div>
                            <FormLabel htmlFor={`logo-alt-${index}`}>Alt Metin</FormLabel>
                            <FormInput
                              id={`logo-alt-${index}`}
                              value={logo.alt}
                              onChange={(e) => updateArrayItem('partnerships.logos', index, 'alt', e.target.value)}
                              placeholder="Opet Logo"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <FormLabel htmlFor="contact.buttonIcon">İletişim Buton İkonu</FormLabel>
                      <ImageInput
                        value={content.contact.buttonIcon}
                        onChange={(value) => updateContent('contact.buttonIcon', value)}
                        placeholder="Buton ikonunu seçin"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ortaklık Logoları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.partnerships.logos.map((logo: any, index: number) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <FormLabel htmlFor={`partnership-logo-${index}`}>{logo.name || `Logo ${index + 1}`}</FormLabel>
                        <ImageInput
                          value={logo.image}
                          onChange={(value) => updateArrayItem('partnerships.logos', index, 'image', value)}
                          placeholder="Logo görselini seçin"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

      </div>
      </div>
    </div>
  );
};

export default TarifelerPageEditor;