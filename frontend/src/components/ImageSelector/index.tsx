import React, { useState, useEffect } from 'react';
import FormInput from '../Base/Form/FormInput';
import FormLabel from '../Base/Form/FormLabel';
import Button from '../Base/Button';
import Lucide from '../Base/Lucide';
import { mediaService, MediaItem, MediaFolder } from '@/services/media';

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  selectedImageId?: string;
  title?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedImageId,
  title = "Select Image"
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [currentBrandId] = useState<number>(1); // Default to brand 1

  const categories = [
    { id: 'all', name: 'All Images', count: mediaItems.length },
    ...folders.map(folder => ({
      id: folder.id.toString(),
      name: folder.name,
      count: mediaItems.filter(item =>
        item.folders.some(f => f.id === folder.id)
      ).length
    }))
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           item.folders.some(f => f.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Load media items and folders when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMediaData();
    }
  }, [isOpen]);

  // Update selected item when selectedImageId changes
  useEffect(() => {
    if (selectedImageId) {
      const item = mediaItems.find(item => item.id === selectedImageId);
      setSelectedItem(item || null);
    }
  }, [selectedImageId, mediaItems]);

  const loadMediaData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load media items
      const mediaResponse = await mediaService.getMediaItems(currentBrandId, {
        pageSize: 100 // Get all images
      });

      if (mediaResponse.ok && mediaResponse.data) {
        setMediaItems(mediaResponse.data.mediaItems);
      } else {
        setError('Failed to load media items');
      }

      // Load folders
      const foldersResponse = await mediaService.getMediaFolders(currentBrandId);
      if (foldersResponse.ok && foldersResponse.data) {
        setFolders(foldersResponse.data);
      }
    } catch (err) {
      setError('Failed to load media data');
      console.error('Media loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 w-full max-w-6xl h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <Button variant="secondary" onClick={onClose}>
            <Lucide icon="X" className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="mb-4">
              <FormLabel>Search Images</FormLabel>
              <FormInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, tags, or alt text..."
              />
            </div>

            <div>
              <FormLabel>Categories</FormLabel>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-xs opacity-75">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Image Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Lucide icon="Loader2" className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Loading images...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Lucide icon="AlertCircle" className="mx-auto h-12 w-12 text-red-400 mb-3" />
                    <p className="text-red-500 mb-3">{error}</p>
                    <Button variant="primary" onClick={loadMediaData}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Lucide icon="ImageIcon" className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'No images match your search' : 'No images found'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                        selectedItem?.id === item.id
                          ? 'border-primary ring-2 ring-primary ring-opacity-20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={item.thumbnail}
                          alt={item.alt || item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.filename}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(item.size)}
                        </p>
                        {item.alt && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                            {item.alt}
                          </p>
                        )}
                      </div>
                      {selectedItem?.id === item.id && (
                        <div className="absolute top-2 right-2 bg-primary text-white w-6 h-6 flex items-center justify-center text-sm">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Image Preview */}
            {selectedItem && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={selectedItem.thumbnail}
                      alt={selectedItem.alt || selectedItem.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedItem.filename}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(selectedItem.size)} • {selectedItem.type}
                    </p>
                    {selectedItem.alt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Alt: {selectedItem.alt}
                      </p>
                    )}
                    {selectedItem.tags.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Tags: {selectedItem.tags.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline-primary"
              onClick={() => {
                // Open Media Gallery in new tab/window for management
                window.open('/media-gallery', '_blank');
              }}
            >
              <Lucide icon="ExternalLink" className="w-4 h-4 mr-1" />
              Manage Gallery
            </Button>
            <Button
              variant="primary"
              onClick={handleSelect}
              disabled={!selectedItem}
            >
              <Lucide icon="Check" className="w-4 h-4 mr-1" />
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;