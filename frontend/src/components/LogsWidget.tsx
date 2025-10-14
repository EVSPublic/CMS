import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lucide from './Base/Lucide';
import { logService } from '../services/logService';
import { LogEntry } from '../types/log';

const LogsWidget: React.FC = () => {
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const loadRecentLogs = async () => {
      const logs = await logService.getRecentLogs(2);
      setRecentLogs(logs);
    };

    loadRecentLogs();

    // Refresh logs every 5 seconds
    const interval = setInterval(loadRecentLogs, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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

  if (recentLogs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Son Aktiviteler
          </h3>
          <Link
            to="/logs"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Detayları Gör
          </Link>
        </div>
        <div className="text-center py-8">
          <Lucide icon="Activity" className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Henüz aktivite bulunmuyor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Son Aktiviteler
        </h3>
        <Link
          to="/logs"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Detayları Gör
        </Link>
      </div>

      <div className="space-y-3">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${getLevelColor(log.level)}`}>
              <Lucide icon={getLogIcon(log.level, log.action)} className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getActionLabel(log.action)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {log.details}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-400">
                  {formatTime(log.timestamp)}
                </span>
                {log.brandName && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                    {log.brandName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsWidget;