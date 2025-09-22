import React, { useState } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';

interface ContactPageContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  pageHero: {
    backgroundImage: string;
    logoImage: string;
    logoAlt: string;
  };
  contactInfo: {
    title: string;
    office: {
      title: string;
      address: string[];
    };
    email: {
      title: string;
      address: string;
    };
    phone: {
      title: string;
      number: string;
    };
  };
  contactForm: {
    title: string;
    tabs: {
      individual: string;
      corporate: string;
    };
    fields: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      company: string;
      title: string;
      subject: string;
      message: string;
    };
    subjectOptions: Array<{
      value: string;
      label: string;
    }>;
    emailConfig: {
      smtpHost: string;
      smtpPort: string;
      smtpUsername: string;
      smtpPassword: string;
      extraDetails: string;
    };
    submitButton: string;
    kvkkText: string;
    kvkkLinkText: string;
  };
  socialMedia: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

const initialContent: ContactPageContent = {
  meta: {
    title: "İletişim - Ovolt",
    description: "",
    keywords: ""
  },
  pageHero: {
    backgroundImage: "assets/img/iletisim-bg.jpg",
    logoImage: "assets/img/page-hero-logo.svg",
    logoAlt: "Ovolt Logo"
  },
  contactInfo: {
    title: "İletişim",
    office: {
      title: "Merkez Ofis",
      address: [
        "Kısıklı Alemdağ Caddesi No:60",
        "34000 Üsküdar / İstanbul"
      ]
    },
    email: {
      title: "E-Mail",
      address: "info@ovolt.com"
    },
    phone: {
      title: "Telefon",
      number: "+90 850 474 60 11"
    }
  },
  contactForm: {
    title: "İletişim Formu",
    tabs: {
      individual: "Bireysel",
      corporate: "Kurumsal"
    },
    fields: {
      firstName: "Ad",
      lastName: "Soyad",
      email: "E-Mail",
      phone: "Telefon",
      company: "Şirket",
      title: "Ünvan",
      subject: "Konu",
      message: "Mesajınız"
    },
    subjectOptions: [
      { value: "tarifeler", label: "Tarifeler Hakkında Bilgilendirme" },
      { value: "teknik", label: "Teknik Destek" },
      { value: "genel", label: "Genel Bilgi" },
      { value: "sikayet", label: "Şikayet" },
      { value: "oneriler", label: "Öneriler" }
    ],
    emailConfig: {
      smtpHost: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      extraDetails: ""
    },
    submitButton: "Gönder",
    kvkkText: "Formu doldurarak, kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmesine örtülü şekilde onay vermiş oluyorsunuz.",
    kvkkLinkText: "KVKK Aydınlatma Metni için lütfen tıklayın."
  },
  socialMedia: [
    { name: "LinkedIn", url: "#", icon: "linkedin" },
    { name: "Instagram", url: "#", icon: "instagram" }
  ]
};

const IletisimPageEditor: React.FC = () => {
  const [content, setContent] = useState<ContactPageContent>(initialContent);
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

  const updateOfficeAddress = (index: number, value: string) => {
    const newContent = { ...content };
    newContent.contactInfo.office.address[index] = value;
    setContent(newContent);
  };

  const addOfficeAddress = () => {
    const newContent = { ...content };
    newContent.contactInfo.office.address.push("");
    setContent(newContent);
  };

  const removeOfficeAddress = (index: number) => {
    const newContent = { ...content };
    newContent.contactInfo.office.address.splice(index, 1);
    setContent(newContent);
  };

  const validateContent = () => {
    const errors: string[] = [];

    if (!content.meta.title.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content.contactInfo.title.trim()) {
      errors.push('İletişim başlığı boş olamaz');
    }

    if (!content.contactInfo.office.title.trim()) {
      errors.push('Merkez ofis başlığı boş olamaz');
    }

    if (!content.contactInfo.email.address.trim()) {
      errors.push('E-mail adresi boş olamaz');
    }

    if (!content.contactInfo.phone.number.trim()) {
      errors.push('Telefon numarası boş olamaz');
    }

    if (!content.contactForm.title.trim()) {
      errors.push('İletişim formu başlığı boş olamaz');
    }

    content.contactForm.subjectOptions.forEach((option, index) => {
      if (!option.label.trim()) {
        errors.push(`Konu seçeneği ${index + 1} etiketi boş olamaz`);
      }
      if (!option.value.trim()) {
        errors.push(`Konu seçeneği ${index + 1} değeri boş olamaz`);
      }
    });

    content.socialMedia.forEach((social, index) => {
      if (!social.name.trim()) {
        errors.push(`Sosyal medya ${index + 1} adı boş olamaz`);
      }
      if (!social.url.trim()) {
        errors.push(`Sosyal medya ${index + 1} URL'i boş olamaz`);
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
      // await api.savePageContent('iletisim', content);
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
          İletişim İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          İletişim sayfası içeriklerini düzenleyin
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 dark:border-gray-700">
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Genel Bilgiler
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İletişim Bilgileri
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              İletişim Formu
            </Tab>
            <Tab className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:border-blue-600 dark:data-[selected]:border-blue-400">
              Sosyal Medya
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
                    placeholder="İletişim - Ovolt"
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

                <div>
                  <FormLabel htmlFor="contactInfo.title">Ana Başlık</FormLabel>
                  <FormInput
                    id="contactInfo.title"
                    value={content.contactInfo.title}
                    onChange={(e) => updateContent('contactInfo.title', e.target.value)}
                    placeholder="İletişim"
                  />
                </div>
              </div>
            </Tab.Panel>

            {/* İletişim Bilgileri */}
            <Tab.Panel className="p-6">
              <div className="space-y-8">
                {/* Merkez Ofis */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Merkez Ofis</h3>
                  <div className="space-y-4">
                    <div>
                      <FormLabel htmlFor="office.title">Ofis Başlığı</FormLabel>
                      <FormInput
                        id="office.title"
                        value={content.contactInfo.office.title}
                        onChange={(e) => updateContent('contactInfo.office.title', e.target.value)}
                        placeholder="Merkez Ofis"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <FormLabel>Adres Satırları</FormLabel>
                        <Button
                          variant="primary"
                          onClick={addOfficeAddress}
                        >
                          Yeni Satır Ekle
                        </Button>
                      </div>

                      {content.contactInfo.office.address.map((line, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <FormInput
                            value={line}
                            onChange={(e) => updateOfficeAddress(index, e.target.value)}
                            placeholder={`Adres satırı ${index + 1}`}
                          />
                          <Button
                            variant="soft-secondary"
                            onClick={() => removeOfficeAddress(index)}
                          >
                            Sil
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">E-Mail</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel htmlFor="email.title">E-mail Başlığı</FormLabel>
                      <FormInput
                        id="email.title"
                        value={content.contactInfo.email.title}
                        onChange={(e) => updateContent('contactInfo.email.title', e.target.value)}
                        placeholder="E-Mail"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="email.address">E-mail Adresi</FormLabel>
                      <FormInput
                        id="email.address"
                        value={content.contactInfo.email.address}
                        onChange={(e) => updateContent('contactInfo.email.address', e.target.value)}
                        placeholder="info@ovolt.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Telefon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel htmlFor="phone.title">Telefon Başlığı</FormLabel>
                      <FormInput
                        id="phone.title"
                        value={content.contactInfo.phone.title}
                        onChange={(e) => updateContent('contactInfo.phone.title', e.target.value)}
                        placeholder="Telefon"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="phone.number">Telefon Numarası</FormLabel>
                      <FormInput
                        id="phone.number"
                        value={content.contactInfo.phone.number}
                        onChange={(e) => updateContent('contactInfo.phone.number', e.target.value)}
                        placeholder="+90 850 474 60 11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* İletişim Formu */}
            <Tab.Panel className="p-6">
              <div className="space-y-8">
                {/* Form Başlığı ve Sekmeler */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Form Ayarları</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel htmlFor="contactForm.title">Form Başlığı</FormLabel>
                      <FormInput
                        id="contactForm.title"
                        value={content.contactForm.title}
                        onChange={(e) => updateContent('contactForm.title', e.target.value)}
                        placeholder="İletişim Formu"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="tabs.individual">Bireysel Sekme</FormLabel>
                        <FormInput
                          id="tabs.individual"
                          value={content.contactForm.tabs.individual}
                          onChange={(e) => updateContent('contactForm.tabs.individual', e.target.value)}
                          placeholder="Bireysel"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor="tabs.corporate">Kurumsal Sekme</FormLabel>
                        <FormInput
                          id="tabs.corporate"
                          value={content.contactForm.tabs.corporate}
                          onChange={(e) => updateContent('contactForm.tabs.corporate', e.target.value)}
                          placeholder="Kurumsal"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                {/* E-mail Konfigürasyonu */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">E-mail Konfigürasyonu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel htmlFor="emailConfig.smtpHost">SMTP Host</FormLabel>
                      <FormInput
                        id="emailConfig.smtpHost"
                        value={content.contactForm.emailConfig.smtpHost}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpPort">SMTP Port</FormLabel>
                      <FormInput
                        id="emailConfig.smtpPort"
                        value={content.contactForm.emailConfig.smtpPort}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpPort', e.target.value)}
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpUsername">SMTP Username</FormLabel>
                      <FormInput
                        id="emailConfig.smtpUsername"
                        value={content.contactForm.emailConfig.smtpUsername}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpUsername', e.target.value)}
                        placeholder="your-email@example.com"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpPassword">SMTP Password</FormLabel>
                      <FormInput
                        id="emailConfig.smtpPassword"
                        type="password"
                        value={content.contactForm.emailConfig.smtpPassword}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpPassword', e.target.value)}
                        placeholder="your-password"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormLabel htmlFor="emailConfig.extraDetails">Extra Details</FormLabel>
                      <FormTextarea
                        id="emailConfig.extraDetails"
                        value={content.contactForm.emailConfig.extraDetails}
                        onChange={(e) => updateContent('contactForm.emailConfig.extraDetails', e.target.value)}
                        rows={3}
                        placeholder="Additional email configuration details or notes"
                      />
                    </div>
                  </div>
                </div>

                {/* Konu Seçenekleri */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Konu Seçenekleri</h3>
                    <Button
                      variant="primary"
                      onClick={() => addArrayItem('contactForm.subjectOptions', {
                        value: "",
                        label: ""
                      })}
                    >
                      Yeni Seçenek Ekle
                    </Button>
                  </div>

                  {content.contactForm.subjectOptions.map((option, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Seçenek {index + 1}</h4>
                        <Button
                          variant="soft-secondary"
                          onClick={() => removeArrayItem('contactForm.subjectOptions', index)}
                        >
                          Sil
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel htmlFor={`option-value-${index}`}>Değer</FormLabel>
                          <FormInput
                            id={`option-value-${index}`}
                            value={option.value}
                            onChange={(e) => updateArrayItem('contactForm.subjectOptions', index, 'value', e.target.value)}
                            placeholder="tarifeler"
                          />
                        </div>

                        <div>
                          <FormLabel htmlFor={`option-label-${index}`}>Etiket</FormLabel>
                          <FormInput
                            id={`option-label-${index}`}
                            value={option.label}
                            onChange={(e) => updateArrayItem('contactForm.subjectOptions', index, 'label', e.target.value)}
                            placeholder="Tarifeler Hakkında Bilgilendirme"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Tab.Panel>

            {/* Sosyal Medya */}
            <Tab.Panel className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sosyal Medya Hesapları</h3>
                  <Button
                    variant="primary"
                    onClick={() => addArrayItem('socialMedia', {
                      name: "",
                      url: "",
                      icon: ""
                    })}
                  >
                    Yeni Hesap Ekle
                  </Button>
                </div>

                {content.socialMedia.map((social, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Sosyal Medya {index + 1}</h4>
                      <Button
                        variant="soft-secondary"
                        onClick={() => removeArrayItem('socialMedia', index)}
                      >
                        Sil
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FormLabel htmlFor={`social-name-${index}`}>Platform Adı</FormLabel>
                        <FormInput
                          id={`social-name-${index}`}
                          value={social.name}
                          onChange={(e) => updateArrayItem('socialMedia', index, 'name', e.target.value)}
                          placeholder="LinkedIn"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`social-url-${index}`}>URL</FormLabel>
                        <FormInput
                          id={`social-url-${index}`}
                          value={social.url}
                          onChange={(e) => updateArrayItem('socialMedia', index, 'url', e.target.value)}
                          placeholder="https://linkedin.com/company/ovolt"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`social-icon-${index}`}>İkon Tipi</FormLabel>
                        <FormInput
                          id={`social-icon-${index}`}
                          value={social.icon}
                          onChange={(e) => updateArrayItem('socialMedia', index, 'icon', e.target.value)}
                          placeholder="linkedin"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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

export default IletisimPageEditor;