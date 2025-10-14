import Lucide from "@/components/Base/Lucide";
import { useState, useEffect, useRef } from "react";
import { dashboardService, DashboardStats } from "@/services/dashboard";
import LogsWidget from "@/components/LogsWidget";

function Home() {
  // Get current brand ID from selected brand
  const getCurrentBrandId = (): number => {
    const selectedBrand = localStorage.getItem('selectedBrand');

    // Map brand name to brand ID
    if (selectedBrand === 'Sharz.net') {
      return 2;
    }
    return 1; // Default to Ovolt (brandId = 1)
  };

  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBrandId, setCurrentBrandId] = useState<number>(getCurrentBrandId());
  const isInitialLoad = useRef(true);

  // Get project name from localStorage
  const getProjectName = () => {
    const selectedBrand = localStorage.getItem('selectedBrand');

    if (selectedBrand) {
      // Capitalize first letter and add Admin Panel
      const brandName = selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1);
      return `${brandName} Admin Panel`;
    }

    // Fallback to default
    return 'Admin Panel';
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      if (isInitialLoad.current) {
        setLoading(true);
      }
      setError(null);
      const response = await dashboardService.getDashboardStats();

      if (response.ok && response.data) {
        setDashboardData(response.data);
        // Update current brand ID from response
        if (response.data.contentCounts?.brandId) {
          setCurrentBrandId(response.data.contentCounts.brandId);
        }
      } else {
        setError(response.error?.message || 'Dashboard verileri yüklenemedi');
      }
    } catch (err) {
      setError('Dashboard verileri yüklenemedi');
      console.error('Dashboard error:', err);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-pending/10 dark:bg-pending/20 text-pending rounded-full mr-4">
                <Lucide icon="Activity" className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base text-slate-500 dark:text-slate-400">Hoş geldiniz</div>
                <div className="text-lg font-semibold text-slate-600 dark:text-slate-300">{getProjectName()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-success/10 dark:bg-success/20 text-success rounded-full mr-3">
                <Lucide icon="Database" className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">Sistem Durumu</div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Lucide icon="Loader2" className="w-5 h-5 animate-spin text-slate-500" />
                <span className="ml-2 text-slate-500">Yükleniyor...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-4 text-red-500">
                <Lucide icon="AlertCircle" className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">API Durumu</span>
                  <span className={`font-medium ${dashboardData?.systemHealth?.status === 'Healthy' ? 'text-success' : 'text-danger'}`}>
                    {dashboardData?.systemHealth?.status === 'Healthy' ? 'Sağlıklı' : dashboardData?.systemHealth?.status || 'Bilinmiyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Versiyon</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {dashboardData?.systemHealth?.version || 'Bilinmiyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Ortam</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {dashboardData?.systemHealth?.environment || 'Bilinmiyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Son Kontrol</span>
                  <span className="text-slate-500 text-sm">
                    {dashboardData?.systemHealth?.timestamp ?
                      new Date(dashboardData.systemHealth.timestamp).toLocaleTimeString() :
                      'Bilinmiyor'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary rounded-full mr-3">
                    <Lucide icon="Server" className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold">Sunucu Kaynak Kullanımı</div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Lucide icon="Loader2" className="w-5 h-5 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">CPU Kullanımı</span>
                                        <span className="font-medium text-slate-600 dark:text-slate-300">{(dashboardData?.serverResourceUsage?.cpu || 0).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Bellek Kullanımı</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{dashboardData?.serverResourceUsage?.memory || 0} MB</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Aktif Oturumlar</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{dashboardData?.activeUserSessions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Medya Yüklemeleri</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{dashboardData?.mediaUploadsCount || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <LogsWidget />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-warning/10 dark:bg-warning/20 text-warning rounded-full mr-3">
                <Lucide icon="FileText" className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">İçerik İstatistikleri</div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Lucide icon="Loader2" className="w-5 h-5 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Show Announcements only for Ovolt (brandId = 1) */}
                {currentBrandId === 1 && (
                  <div className="bg-slate-50 dark:bg-darkmode-400 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600 dark:text-slate-300 text-sm">Duyurular</span>
                      <Lucide icon="Megaphone" className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                      {dashboardData?.contentCounts?.announcements || 0}
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-darkmode-400 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-300 text-sm">Ortaklar</span>
                    <Lucide icon="Users" className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {dashboardData?.contentCounts?.partners || 0}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-darkmode-400 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-300 text-sm">Statik Sayfalar</span>
                    <Lucide icon="File" className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {dashboardData?.contentCounts?.staticPages || 0}
                  </div>
                </div>

                {/* Show Products only for Sharz.net (brandId = 2) */}
                {currentBrandId === 2 && (
                  <div className="bg-slate-50 dark:bg-darkmode-400 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600 dark:text-slate-300 text-sm">Ürünler</span>
                      <Lucide icon="Package" className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                      {dashboardData?.contentCounts?.products || 0}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;