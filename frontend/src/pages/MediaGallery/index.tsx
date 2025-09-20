import React, { useState, useRef } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Lucide from '../../components/Base/Lucide';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  thumbnail: string;
  size: number;
  type: string;
  uploadDate: Date;
  alt: string;
  tags: string[];
  category: string;
}

interface MediaFolder {
  id: string;
  name: string;
  itemCount: number;
}

const MediaGallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      filename: 'hero-image.jpg',
      url: '/assets/img/hero-image.jpg',
      thumbnail: '/assets/img/thumbnails/hero-image.jpg',
      size: 245760,
      type: 'image/jpeg',
      uploadDate: new Date('2024-01-15'),
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
      uploadDate: new Date('2024-01-10'),
      alt: 'Company logo',
      tags: ['logo', 'branding'],
      category: 'logos'
    }
  ]);

  const [folders] = useState<MediaFolder[]>([
    { id: 'all', name: 'All Images', itemCount: mediaItems.length },
    { id: 'logos', name: 'Logos', itemCount: 1 },
    { id: 'backgrounds', name: 'Backgrounds', itemCount: 1 },
    { id: 'icons', name: 'Icons', itemCount: 0 },
    { id: 'content', name: 'Content Images', itemCount: 0 }
  ]);

  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || item.category === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const newItem: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          filename: file.name,
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          alt: '',
          tags: [],
          category: 'content'
        };
        setMediaItems(prev => [newItem, ...prev]);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const updateItemMetadata = (itemId: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Media Gallery
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your website images and media files
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="bg-white dark:bg-gray-800 shadow p-4 mb-4">
            <h3 className="font-semibold mb-3">Folders</h3>
            <div className="space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{folder.name}</span>
                    <span className="text-xs opacity-75">({folder.itemCount})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`bg-white dark:bg-gray-800 shadow p-4 border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Lucide icon="Upload" className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Drag & drop images here or click to upload
              </p>
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 shadow p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-md">
                  <FormInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images by name or tags..."
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('grid')}
                    size="sm"
                  >
                    <Lucide icon="Grid3X3" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('list')}
                    size="sm"
                  >
                    <Lucide icon="List" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedItems.length} selected
                  </span>
                  <Button variant="danger" onClick={deleteSelectedItems} size="sm">
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Media Grid */}
          <div className="bg-white dark:bg-gray-800 shadow p-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Lucide icon="ImageIcon" className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No images match your search' : 'No images uploaded yet'}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
                : 'space-y-2'
              }>
                {filteredItems.map(item => (
                  <div key={item.id} className={viewMode === 'grid' ? '' : 'flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700'}>
                    {viewMode === 'grid' ? (
                      <div
                        className={`relative group cursor-pointer border-2 transition-colors ${
                          selectedItems.includes(item.id)
                            ? 'border-primary'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={item.thumbnail}
                            alt={item.alt || item.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setPreviewItem(item);
                            }}
                          >
                            <Lucide icon="Eye" className="w-4 h-4" />
                          </Button>
                        </div>

                        {selectedItems.includes(item.id) && (
                          <div className="absolute top-2 right-2 bg-primary text-white w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}

                        <div className="p-2">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {item.filename}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded"
                        />
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <img
                            src={item.thumbnail}
                            alt={item.alt || item.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.filename}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(item.size)} • {item.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPreviewItem(item)}
                        >
                          <Lucide icon="Eye" className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 max-w-4xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image Details</h3>
                <Button
                  variant="secondary"
                  onClick={() => setPreviewItem(null)}
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={previewItem.url}
                    alt={previewItem.alt || previewItem.filename}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <FormLabel>Filename</FormLabel>
                    <FormInput value={previewItem.filename} readOnly />
                  </div>

                  <div>
                    <FormLabel>Alt Text</FormLabel>
                    <FormInput
                      value={previewItem.alt}
                      onChange={(e) => updateItemMetadata(previewItem.id, { alt: e.target.value })}
                      placeholder="Describe this image..."
                    />
                  </div>

                  <div>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormInput
                      value={previewItem.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        updateItemMetadata(previewItem.id, { tags });
                      }}
                      placeholder="Enter tags..."
                    />
                  </div>

                  <div>
                    <FormLabel>File Info</FormLabel>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Size: {formatFileSize(previewItem.size)}</p>
                      <p>Type: {previewItem.type}</p>
                      <p>Uploaded: {previewItem.uploadDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="primary"
                      onClick={() => setPreviewItem(null)}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this image?')) {
                          setMediaItems(prev => prev.filter(item => item.id !== previewItem.id));
                          setPreviewItem(null);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;