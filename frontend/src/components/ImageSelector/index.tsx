import React, { useState, useEffect } from 'react';
import FormInput from '../Base/Form/FormInput';
import FormLabel from '../Base/Form/FormLabel';
import Button from '../Base/Button';
import Lucide from '../Base/Lucide';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  thumbnail: string;
  size: number;
  type: string;
  alt: string;
  tags: string[];
  category: string;
}

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
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      filename: 'hero-image.jpg',
      url: '/assets/img/hero-image.jpg',
      thumbnail: '/assets/img/thumbnails/hero-image.jpg',
      size: 245760,
      type: 'image/jpeg',
      alt: 'Hero section background image',
      tags: ['hero', 'background'],
      category: 'backgrounds'
    },
    {
      id: '2',
      filename: 'logo.svg',
      url: '/assets/img/logo.svg',
      thumbnail: '/assets/img/thumbnails/logo.svg',
      size: 12340,
      type: 'image/svg+xml',
      alt: 'Company logo',
      tags: ['logo', 'branding'],
      category: 'logos'
    },
    {
      id: '3',
      filename: 'service-icon-1.svg',
      url: '/assets/img/service-icon-1.svg',
      thumbnail: '/assets/img/thumbnails/service-icon-1.svg',
      size: 8960,
      type: 'image/svg+xml',
      alt: 'Service icon 1',
      tags: ['icon', 'service'],
      category: 'icons'
    },
    {
      id: '4',
      filename: 'charging-station.jpg',
      url: '/assets/img/charging-station.jpg',
      thumbnail: '/assets/img/thumbnails/charging-station.jpg',
      size: 189340,
      type: 'image/jpeg',
      alt: 'Electric car charging station',
      tags: ['charging', 'station', 'electric'],
      category: 'content'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const categories = [
    { id: 'all', name: 'All Images', count: mediaItems.length },
    { id: 'logos', name: 'Logos', count: mediaItems.filter(item => item.category === 'logos').length },
    { id: 'backgrounds', name: 'Backgrounds', count: mediaItems.filter(item => item.category === 'backgrounds').length },
    { id: 'icons', name: 'Icons', count: mediaItems.filter(item => item.category === 'icons').length },
    { id: 'content', name: 'Content Images', count: mediaItems.filter(item => item.category === 'content').length }
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (selectedImageId) {
      const item = mediaItems.find(item => item.id === selectedImageId);
      setSelectedItem(item || null);
    }
  }, [selectedImageId, mediaItems]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              {filteredItems.length === 0 ? (
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