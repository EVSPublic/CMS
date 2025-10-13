import React, { useState, useEffect, useRef } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormTextarea from '../../components/Base/Form/FormTextarea';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Tab from '../../components/Base/Headless/Tab';
import ImageInput from '../../components/ImageInput';
import { contentService, ContactPageContent } from '../../services/content';
import { useScrollEffect } from '../../hooks/useScrollEffect';

// Brand icon components
const BrandIcons = {
  linkedin: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  instagram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  youtube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  github: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  whatsapp: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
    </svg>
  ),
  telegram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  tiktok: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  email: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  website: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  phone: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
};

// Available social media icons
const availableIcons = [
  { value: 'linkedin', label: 'LinkedIn', icon: BrandIcons.linkedin },
  { value: 'instagram', label: 'Instagram', icon: BrandIcons.instagram },
  { value: 'facebook', label: 'Facebook', icon: BrandIcons.facebook },
  { value: 'twitter', label: 'Twitter', icon: BrandIcons.twitter },
  { value: 'youtube', label: 'YouTube', icon: BrandIcons.youtube },
  { value: 'tiktok', label: 'TikTok', icon: BrandIcons.tiktok },
  { value: 'whatsapp', label: 'WhatsApp', icon: BrandIcons.whatsapp },
  { value: 'telegram', label: 'Telegram', icon: BrandIcons.telegram },
  { value: 'github', label: 'GitHub', icon: BrandIcons.github },
  { value: 'email', label: 'Email', icon: BrandIcons.email },
  { value: 'website', label: 'Website', icon: BrandIcons.website },
  { value: 'phone', label: 'Phone', icon: BrandIcons.phone }
];

// Icon Selector Component
interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedIcon = availableIcons.find(icon => icon.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedIcon ? (
              <>
                <div className="text-white bg-gray-600 dark:bg-gray-400 rounded p-1">
                  <selectedIcon.icon />
                </div>
                <span className="text-gray-900 dark:text-gray-100">{selectedIcon.label}</span>
                <span className="text-gray-500 dark:text-gray-400">({selectedIcon.value})</span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{placeholder || 'İkon seçin...'}</span>
            )}
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {availableIcons.map((icon) => (
            <button
              key={icon.value}
              type="button"
              onClick={() => {
                onChange(icon.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 ${
                value === icon.value ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-white bg-gray-600 dark:bg-gray-400 rounded p-1">
                  <icon.icon />
                </div>
                <span>{icon.label}</span>
                <span className="text-gray-500 dark:text-gray-400">({icon.value})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const initialContent: ContactPageContent = {
  meta: {
    title: "İletişim - Ovolt",
    description: "",
    keywords: ""
  },
  hero: {
    image: ""
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
      smtpSecurityType: "StartTls",
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
  const isScrolled = useScrollEffect();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get project selection from localStorage
  const getSelectedBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2; // Ovolt = 1, Sharz.net = 2
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Listen for brand changes and reload content
  useEffect(() => {
    const handleBrandChange = () => {
      loadContent();
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const brandId = getSelectedBrandId();
      const response = await contentService.getContactPageContent(brandId);
      if (response.ok && response.data) {
        setContent(response.data);
      } else {
        setError(response.error?.message || 'Failed to load content');
      }
    } catch (err) {
      setError('An error occurred while loading content');
      console.error('Load content error:', err);
    } finally {
      setIsLoading(false);
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

    // Navigate to the target array, creating structure if needed
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!current[key]) {
        // If this is the last key, create an array; otherwise create an object
        current[key] = i === keys.length - 1 ? [] : {};
      }
      current = current[key];
    }

    // Ensure current is an array before pushing
    if (Array.isArray(current)) {
      current.push(newItem);
    } else {
      console.error('Cannot add item to non-array:', path);
      return;
    }

    setContent(newContent);
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current = newContent as any;

    // Navigate to the target array safely
    for (const key of keys) {
      if (!current || !current[key]) {
        console.error('Cannot remove item from non-existent path:', path);
        return;
      }
      current = current[key];
    }

    // Ensure current is an array before splicing
    if (Array.isArray(current) && index >= 0 && index < current.length) {
      current.splice(index, 1);
      setContent(newContent);
    } else {
      console.error('Cannot remove item from non-array or invalid index:', path, index);
    }
  };

  const updateOfficeAddress = (index: number, value: string) => {
    const newContent = { ...content };
    if (!newContent.contactInfo) newContent.contactInfo = { title: '', office: { title: '', address: [] }, email: { title: '', address: '' }, phone: { title: '', number: '' } };
    if (!newContent.contactInfo.office) newContent.contactInfo.office = { title: '', address: [] };
    if (!newContent.contactInfo.office.address) newContent.contactInfo.office.address = [];
    newContent.contactInfo.office.address[index] = value;
    setContent(newContent);
  };

  const addOfficeAddress = () => {
    const newContent = { ...content };
    if (!newContent.contactInfo) newContent.contactInfo = { title: '', office: { title: '', address: [] }, email: { title: '', address: '' }, phone: { title: '', number: '' } };
    if (!newContent.contactInfo.office) newContent.contactInfo.office = { title: '', address: [] };
    if (!newContent.contactInfo.office.address) newContent.contactInfo.office.address = [];
    newContent.contactInfo.office.address.push("");
    setContent(newContent);
  };

  const removeOfficeAddress = (index: number) => {
    const newContent = { ...content };
    if (newContent.contactInfo?.office?.address) {
      newContent.contactInfo.office.address.splice(index, 1);
      setContent(newContent);
    }
  };

  const validateContent = () => {
    const errors: string[] = [];

    if (!content.meta?.title?.trim()) {
      errors.push('Sayfa başlığı boş olamaz');
    }

    if (!content.contactInfo?.title?.trim()) {
      errors.push('İletişim başlığı boş olamaz');
    }

    if (!content.contactInfo?.office?.title?.trim()) {
      errors.push('Merkez ofis başlığı boş olamaz');
    }

    if (!content.contactInfo?.email?.address?.trim()) {
      errors.push('E-mail adresi boş olamaz');
    }

    if (!content.contactInfo?.phone?.number?.trim()) {
      errors.push('Telefon numarası boş olamaz');
    }

    if (!content.contactForm?.title?.trim()) {
      errors.push('İletişim formu başlığı boş olamaz');
    }

    (content.contactForm?.subjectOptions || []).forEach((option, index) => {
      if (!option?.label?.trim()) {
        errors.push(`Konu seçeneği ${index + 1} etiketi boş olamaz`);
      }
      if (!option?.value?.trim()) {
        errors.push(`Konu seçeneği ${index + 1} değeri boş olamaz`);
      }
    });

    (content.socialMedia || []).forEach((social, index) => {
      if (!social?.name?.trim()) {
        errors.push(`Sosyal medya ${index + 1} adı boş olamaz`);
      }
      if (!social?.url?.trim()) {
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
      const brandId = getSelectedBrandId();
      const response = await contentService.saveContactPageContent(brandId, content);

      if (response.ok) {
        alert('İçerik başarıyla kaydedildi!');
        await loadContent();
      } else {
        alert('Kaydetme sırasında bir hata oluştu: ' + (response.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme sırasında bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">İçerik yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Hata</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
              <div className="mt-3">
                <button
                  onClick={loadContent}
                  className="bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
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
          İletişim İçerik Editörü
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
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
              Hero Bölümü
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
                    value={content.meta?.title || ''}
                    onChange={(e) => updateContent('meta.title', e.target.value)}
                    placeholder="İletişim - Ovolt"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="meta.description">Açıklama</FormLabel>
                  <FormTextarea
                    id="meta.description"
                    value={content.meta?.description || ''}
                    onChange={(e) => updateContent('meta.description', e.target.value)}
                    placeholder="Sayfa açıklamasını girin"
                    rows={3}
                  />
                </div>

                <div>
                  <FormLabel htmlFor="meta.keywords">Anahtar Kelimeler</FormLabel>
                  <FormTextarea
                    id="meta.keywords"
                    value={content.meta?.keywords || ''}
                    onChange={(e) => updateContent('meta.keywords', e.target.value)}
                    placeholder="Anahtar kelimeleri virgülle ayırarak girin"
                    rows={2}
                  />
                </div>

                <div>
                  <FormLabel htmlFor="contactInfo.title">Ana Başlık</FormLabel>
                  <FormInput
                    id="contactInfo.title"
                    value={content.contactInfo?.title || ''}
                    onChange={(e) => updateContent('contactInfo.title', e.target.value)}
                    placeholder="İletişim"
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
                      value={content.hero?.image || ''}
                      onChange={(url) => updateContent('hero.image', url)}
                      label="Hero Görseli"
                      placeholder="Hero görseli seçin..."
                    />
                  </div>
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
                      <FormLabel htmlFor="office.title">Ofis Adresi</FormLabel>
                      <FormTextarea
                        id="office.title"
                        value={content.contactInfo?.office?.title || ''}
                        onChange={(e) => updateContent('contactInfo.office.title', e.target.value)}
                        placeholder="Merkez Ofis"
                        rows={3}
                      />
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
                        value={content.contactInfo?.email?.title || ''}
                        onChange={(e) => updateContent('contactInfo.email.title', e.target.value)}
                        placeholder="E-Mail"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="email.address">E-mail Adresi</FormLabel>
                      <FormInput
                        id="email.address"
                        value={content.contactInfo?.email?.address || ''}
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
                        value={content.contactInfo?.phone?.title || ''}
                        onChange={(e) => updateContent('contactInfo.phone.title', e.target.value)}
                        placeholder="Telefon"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="phone.number">Telefon Numarası</FormLabel>
                      <FormInput
                        id="phone.number"
                        value={content.contactInfo?.phone?.number || ''}
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
                        value={content.contactForm?.title || ''}
                        onChange={(e) => updateContent('contactForm.title', e.target.value)}
                        placeholder="İletişim Formu"
                      />
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
                        value={content.contactForm?.emailConfig?.smtpHost || ''}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpPort">SMTP Port</FormLabel>
                      <FormInput
                        id="emailConfig.smtpPort"
                        value={content.contactForm?.emailConfig?.smtpPort || ''}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpPort', e.target.value)}
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpUsername">SMTP Username</FormLabel>
                      <FormInput
                        id="emailConfig.smtpUsername"
                        value={content.contactForm?.emailConfig?.smtpUsername || ''}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpUsername', e.target.value)}
                        placeholder="your-email@example.com"
                      />
                    </div>

                    <div>
                      <FormLabel htmlFor="emailConfig.smtpPassword">SMTP Password</FormLabel>
                      <FormInput
                        id="emailConfig.smtpPassword"
                        type="password"
                        value={content.contactForm?.emailConfig?.smtpPassword || ''}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpPassword', e.target.value)}
                        placeholder="your-password"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormLabel htmlFor="emailConfig.smtpSecurityType">Güvenlik Türü (SSL/TLS)</FormLabel>
                      <select
                        id="emailConfig.smtpSecurityType"
                        value={content.contactForm?.emailConfig?.smtpSecurityType || 'StartTls'}
                        onChange={(e) => updateContent('contactForm.emailConfig.smtpSecurityType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="None">None (Güvensiz - Port 25)</option>
                        <option value="Auto">Auto (Otomatik)</option>
                        <option value="SslOnConnect">SSL/TLS (Port 465)</option>
                        <option value="StartTls">STARTTLS (Port 587 - Önerilen)</option>
                        <option value="StartTlsWhenAvailable">STARTTLS (Opsiyonel)</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        STARTTLS (Port 587): Gmail, Outlook için önerilir<br/>
                        SSL/TLS (Port 465): Eski sunucular için<br/>
                        None (Port 25): Sadece yerel/test sunucular için
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <FormLabel htmlFor="emailConfig.extraDetails">Extra Details</FormLabel>
                      <FormTextarea
                        id="emailConfig.extraDetails"
                        value={content.contactForm?.emailConfig?.extraDetails || ''}
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

                  {(content.contactForm?.subjectOptions || []).map((option, index) => (
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
                            value={option?.value || ''}
                            onChange={(e) => updateArrayItem('contactForm.subjectOptions', index, 'value', e.target.value)}
                            placeholder="tarifeler"
                          />
                        </div>

                        <div>
                          <FormLabel htmlFor={`option-label-${index}`}>Etiket</FormLabel>
                          <FormInput
                            id={`option-label-${index}`}
                            value={option?.label || ''}
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

                {(content.socialMedia || []).map((social, index) => (
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
                          value={social?.name || ''}
                          onChange={(e) => updateArrayItem('socialMedia', index, 'name', e.target.value)}
                          placeholder="LinkedIn"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`social-url-${index}`}>URL</FormLabel>
                        <FormInput
                          id={`social-url-${index}`}
                          value={social?.url || ''}
                          onChange={(e) => updateArrayItem('socialMedia', index, 'url', e.target.value)}
                          placeholder="https://linkedin.com/company/ovolt"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor={`social-icon-${index}`}>İkon Tipi</FormLabel>
                        <IconSelector
                          value={social?.icon || ''}
                          onChange={(value) => updateArrayItem('socialMedia', index, 'icon', value)}
                          placeholder="İkon seçin..."
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