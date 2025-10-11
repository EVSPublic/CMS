import React, { useState, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Lucide from '../../components/Base/Lucide';
import { appLinksService, AppLinks } from '../../services/appLinks';
import { useScrollEffect } from '../../hooks/useScrollEffect';

const ApplicationsPage: React.FC = () => {
  const isScrolled = useScrollEffect();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [appLinks, setAppLinks] = useState<AppLinks>({
    iosAppLink: '',
    androidAppLink: ''
  });

  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand') || 'Ovolt';
    return selectedBrand === 'Ovolt' ? 1 : 2;
  };

  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());

  useEffect(() => {
    loadAppLinks(currentBrandId);
  }, []);

  useEffect(() => {
    const handleBrandChange = () => {
      const newBrandId = getCurrentBrandId();
      setCurrentBrandId(newBrandId);
      loadAppLinks(newBrandId);
    };

    window.addEventListener('brandChanged', handleBrandChange);
    return () => window.removeEventListener('brandChanged', handleBrandChange);
  }, []);

  const loadAppLinks = async (brandId?: number) => {
    const actualBrandId = brandId || currentBrandId;
    setLoading(true);
    setError(null);

    try {
      const response = await appLinksService.getAppLinks(actualBrandId);

      if (response.ok && response.data) {
        setAppLinks({
          iosAppLink: response.data.iosAppLink || '',
          androidAppLink: response.data.androidAppLink || ''
        });
      } else {
        setError(response.error?.message || 'Uygulama linkleri yüklenemedi');
      }
    } catch (err) {
      setError('Uygulama linkleri yüklenemedi');
      console.error('App links error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await appLinksService.updateAppLinks(appLinks, currentBrandId);

      if (response.ok) {
        setSuccessMessage('Uygulama linkleri başarıyla kaydedildi');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error?.message || 'Kaydetme işlemi başarısız oldu');
      }
    } catch (err) {
      setError('Kaydetme işlemi başarısız oldu');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AppLinks, value: string) => {
    setAppLinks(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Lucide icon="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
          isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
        }`}>
          Mobil Uygulamalar
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
          iOS ve Android uygulama linklerini yönetin
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <Lucide icon="AlertCircle" className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <Lucide icon="CheckCircle" className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="box p-5">
        <div className="space-y-6">
          {/* iOS App Link */}
          <div>
            <div className="flex items-center mb-3">
              <Lucide icon="Apple" className="w-6 h-6 mr-2 text-slate-600" />
              <FormLabel className="text-lg font-semibold mb-0">iOS Uygulama Linki</FormLabel>
            </div>
            <FormInput
              type="url"
              placeholder="https://apps.apple.com/..."
              value={appLinks.iosAppLink}
              onChange={(e) => handleInputChange('iosAppLink', e.target.value)}
              className="w-full"
            />
            <p className="mt-2 text-sm text-slate-500">
              App Store'daki uygulamanızın linkini girin
            </p>
          </div>

          {/* Android App Link */}
          <div>
            <div className="flex items-center mb-3">
              <Lucide icon="Smartphone" className="w-6 h-6 mr-2 text-slate-600" />
              <FormLabel className="text-lg font-semibold mb-0">Android Uygulama Linki</FormLabel>
            </div>
            <FormInput
              type="url"
              placeholder="https://play.google.com/store/apps/..."
              value={appLinks.androidAppLink}
              onChange={(e) => handleInputChange('androidAppLink', e.target.value)}
              className="w-full"
            />
            <p className="mt-2 text-sm text-slate-500">
              Google Play Store'daki uygulamanızın linkini girin
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-darkmode-400">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Lucide icon="Save" className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
