import React from 'react';
import { useScrollEffect } from '../../hooks/useScrollEffect';

const KurumsalPageEditor: React.FC = () => {
  const isScrolled = useScrollEffect();
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold transition-colors duration-300 ${
          isScrolled ? 'text-gray-900 dark:text-white' : 'text-white dark:text-white'
        }`}>
          Kurumsal Çözümler İçerik Editörü
        </h1>
        <p className={`mt-1 text-sm transition-colors duration-300 ${
          isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200 dark:text-gray-300'
        }`}>
          Kurumsal çözümler sayfası içeriklerini düzenleyin
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">
          İçerik editörü yakında burada olacak...
        </p>
      </div>
    </div>
  );
};

export default KurumsalPageEditor;