import React from 'react';

const IndexPageEditor: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Ana Sayfa İçerik Editörü
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Ana sayfa içeriklerini düzenleyin
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

export default IndexPageEditor;