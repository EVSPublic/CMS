import React, { useState, useEffect } from 'react';
import Lucide from '@/components/Base/Lucide';
import Button from '@/components/Base/Button';
import FormSelect from '@/components/Base/Form/FormSelect';
import FormInput from '@/components/Base/Form/FormInput';
import { logService } from '@/services/logService';
import { LogEntry, LogsResponse } from '@/types/log';
import { useScrollEffect } from '@/hooks/useScrollEffect';

const LogsPage: React.FC = () => {
  const [logsData, setLogsData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    action: '',
    level: '',
    brandId: '',
    dateRange: ''
  });
  const isScrolled = useScrollEffect();

  const logsPerPage = 20;

  useEffect(() => {
    loadLogs();
  }, [currentPage, filters]);

  const loadLogs = () => {
    setLoading(true);

    const filterObj: any = {};
    if (filters.action) filterObj.action = filters.action;
    if (filters.level) filterObj.level = filters.level;
    if (filters.brandId) filterObj.brandId = parseInt(filters.brandId);

    // Date range filtering
    if (filters.dateRange) {
      const now = new Date();
      switch (filters.dateRange) {
        case 'today':
          filterObj.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          filterObj.startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          filterObj.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
    }

    const result = logService.getLogs(currentPage, logsPerPage, filterObj);
    setLogsData(result);
    setLoading(false);
  };

  const clearAllLogs = () => {
    if (confirm('Tüm logları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      logService.clearLogs();
      loadLogs();
    }
  };

  const getLogIcon = (level: string, action: string) => {
    if (action.includes('upload') || action.includes('image')) return 'Upload';
    if (action.includes('save') || action.includes('update')) return 'Save';
    if (action.includes('delete')) return 'Trash2';
    if (action.includes('login')) return 'LogIn';
    if (action.includes('logout')) return 'LogOut';
    if (action.includes('publish')) return 'Globe';

    switch (level) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'bg-green-50 dark:bg-green-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getActionLabel = (action: string) => {
    const actionLabels: Record<string, string> = {
      'user_login': 'Kullanıcı Girişi',
      'user_logout': 'Kullanıcı Çıkışı',
      'content_save': 'İçerik Kaydı',
      'content_publish': 'İçerik Yayını',
      'content_unpublish': 'İçerik Yayından Kaldırma',
      'image_upload': 'Resim Yükleme',
      'image_delete': 'Resim Silme',
      'brand_switch': 'Marka Değişimi',
      'user_create': 'Kullanıcı Oluşturma',
      'user_update': 'Kullanıcı Güncelleme',
      'user_delete': 'Kullanıcı Silme',
      'page_view': 'Sayfa Görüntüleme',
      'export_data': 'Veri Dışa Aktarma',
      'settings_change': 'Ayar Değişikliği'
    };
    return actionLabels[action] || action;
  };

  const formatDateTime = (timestamp: Date) => {
    return timestamp.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderPagination = () => {
    if (!logsData || logsData.totalPages <= 1) return null;

    const { page, totalPages } = logsData;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Gösterilen: {((page - 1) * logsPerPage) + 1}-{Math.min(page * logsPerPage, logsData.total)} / {logsData.total} log
        </div>

        <div className="flex space-x-1">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
          >
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </Button>

          {pages.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "primary" : "outline-secondary"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className="min-w-[2.5rem]"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline-secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(page + 1)}
          >
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
          isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
        }`}>
          Sistem Logları
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
          Sistem aktivitelerini görüntüleyin ve filtreleyin
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Aksiyon Türü
            </label>
            <FormSelect
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            >
              <option value="">Tümü</option>
              <option value="user_login">Kullanıcı Girişi</option>
              <option value="user_logout">Kullanıcı Çıkışı</option>
              <option value="content_save">İçerik Kaydı</option>
              <option value="content_publish">İçerik Yayını</option>
              <option value="image_upload">Resim Yükleme</option>
              <option value="brand_switch">Marka Değişimi</option>
              <option value="user_create">Kullanıcı Oluşturma</option>
              <option value="user_update">Kullanıcı Güncelleme</option>
            </FormSelect>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seviye
            </label>
            <FormSelect
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            >
              <option value="">Tümü</option>
              <option value="info">Bilgi</option>
              <option value="success">Başarılı</option>
              <option value="warning">Uyarı</option>
              <option value="error">Hata</option>
            </FormSelect>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Marka
            </label>
            <FormSelect
              value={filters.brandId}
              onChange={(e) => setFilters(prev => ({ ...prev, brandId: e.target.value }))}
            >
              <option value="">Tümü</option>
              <option value="1">Ovolt</option>
              <option value="2">Sharz.net</option>
            </FormSelect>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tarih Aralığı
            </label>
            <FormSelect
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="">Tümü</option>
              <option value="today">Bugün</option>
              <option value="week">Son 1 Hafta</option>
              <option value="month">Bu Ay</option>
            </FormSelect>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              setFilters({ action: '', level: '', brandId: '', dateRange: '' });
              setCurrentPage(1);
            }}
          >
            <Lucide icon="X" className="w-4 h-4 mr-2" />
            Filtreleri Temizle
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearAllLogs}
          >
            <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
            Tüm Logları Sil
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Aktivite Logları
            </h3>
            {logsData && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Toplam {logsData.total} log
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Lucide icon="Loader2" className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loglar yükleniyor...</span>
            </div>
          ) : !logsData || logsData.logs.length === 0 ? (
            <div className="text-center py-12">
              <Lucide icon="FileText" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Log bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Seçilen kriterlere uygun log kaydı bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tarih & Saat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aksiyon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Detaylar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Marka
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Seviye
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {logsData.logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatDateTime(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`mr-3 ${getLevelColor(log.level)}`}>
                                <Lucide icon={getLogIcon(log.level, log.action)} className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {getActionLabel(log.action)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {log.details}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {log.userName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                              {log.brandName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getLevelBg(log.level)} ${getLevelColor(log.level)}`}>
                              {log.level.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;