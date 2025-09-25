import React, { useState, useRef, useEffect } from 'react';
import FormInput from '../../components/Base/Form/FormInput';
import FormLabel from '../../components/Base/Form/FormLabel';
import Button from '../../components/Base/Button';
import Lucide from '../../components/Base/Lucide';
import { mediaService, MediaItem, MediaResponse, MediaFolder } from '../../services/media';
import { authService } from '../../services/auth';


const MediaGallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState<number>(1); // Default to brand 1
  const [totalCount, setTotalCount] = useState(0);

  const [folders, setFolders] = useState<MediaFolder[]>([]);

  const [selectedFolder, setSelectedFolder] = useState<string | number>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [editingMetadata, setEditingMetadata] = useState<{alt: string; selectedFolders: number[]} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMediaItems();
    loadFolders();
  }, [currentBrandId]);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaService.getMediaItems(currentBrandId, {
        search: searchQuery,
        pageSize: 100 // Load more items initially
      });

      if (response.ok && response.data) {
        setMediaItems(response.data.mediaItems);
        setTotalCount(response.data.totalCount);
      } else {
        setError(response.error?.message || 'Failed to load media items');
      }
    } catch (err) {
      setError('Failed to load media items');
      console.error('Media error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await mediaService.getMediaFolders(currentBrandId);
      if (response.ok && response.data) {
        setFolders(response.data);
      } else {
        console.error('Failed to load folders:', response.error);
      }
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' ||
                         (typeof selectedFolder === 'number' && item.folders.some(f => f.id === selectedFolder));
    return matchesSearch && matchesFolder;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || uploading) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      if (file.type.startsWith('image/')) {
        try {
          const response = await mediaService.uploadFile(currentBrandId, file);
          if (response.ok && response.data) {
            return response.data;
          } else {
            console.error('Upload failed:', response.error);
            alert(`Failed to upload ${file.name}: ${response.error?.message}`);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Failed to upload ${file.name}`);
        }
      }
      return null;
    });

    try {
      const uploadedItems = await Promise.all(uploadPromises);
      const validItems = uploadedItems.filter(item => item !== null) as MediaItem[];

      if (validItems.length > 0) {
        setMediaItems(prev => [...validItems, ...prev]);
        setTotalCount(prev => prev + validItems.length);
        alert(`Successfully uploaded ${validItems.length} file(s)`);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
    } finally {
      setUploading(false);
    }
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

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      try {
        const deletePromises = selectedItems.map(async (itemId) => {
          const response = await mediaService.deleteMediaItem(currentBrandId, itemId);
          if (!response.ok) {
            console.error(`Failed to delete ${itemId}:`, response.error);
          }
          return response.ok;
        });

        const results = await Promise.all(deletePromises);
        const successCount = results.filter(Boolean).length;

        setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        setTotalCount(prev => prev - successCount);

        if (successCount === selectedItems.length) {
          alert(`Successfully deleted ${successCount} item(s)`);
        } else {
          alert(`Deleted ${successCount} of ${selectedItems.length} item(s). Some deletions failed.`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete items');
      }
    }
  };

  const openPreviewModal = (item: MediaItem) => {
    setPreviewItem(item);
    setEditingMetadata({
      alt: item.alt || '',
      selectedFolders: item.folders.map(f => f.id)
    });
  };

  const closePreviewModal = () => {
    setPreviewItem(null);
    setEditingMetadata(null);
  };

  const saveMetadataChanges = async () => {
    if (!previewItem || !editingMetadata) return;

    try {
      // Update alt text first
      const updateData = {
        fileName: previewItem.filename,
        altText: editingMetadata.alt.trim(),
        caption: editingMetadata.alt.trim()
      };

      const response = await mediaService.updateMediaItem(currentBrandId, previewItem.id, updateData);

      if (response.ok && response.data) {
        // Update folders separately
        const foldersResponse = await mediaService.updateMediaItemFolders(
          currentBrandId,
          previewItem.id,
          { folderIds: editingMetadata.selectedFolders }
        );

        if (foldersResponse.ok) {
          // Reload media items to get updated folder information
          await loadMediaItems();

          // Find the updated item to update preview
          const updatedItems = await mediaService.getMediaItems(currentBrandId, { pageSize: 100 });
          if (updatedItems.ok && updatedItems.data) {
            const updatedItem = updatedItems.data.mediaItems.find(item => item.id === previewItem.id);
            if (updatedItem) {
              setPreviewItem(updatedItem);
              setEditingMetadata({
                alt: updatedItem.alt || '',
                selectedFolders: updatedItem.folders.map(f => f.id)
              });
            }
          }

          alert('Metadata updated successfully');
        } else {
          alert('Failed to update folders: ' + (foldersResponse.error?.message || 'Unknown error'));
        }
      } else {
        console.error('Update failed:', response.error);
        alert('Failed to update metadata: ' + response.error?.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update metadata');
    }
  };

  const updateItemMetadata = async (itemId: string, updates: Partial<MediaItem>) => {
    try {
      const updateData = {
        fileName: updates.filename,
        altText: updates.alt,
        caption: updates.alt // Using alt as caption for simplicity
      };

      const response = await mediaService.updateMediaItem(currentBrandId, itemId, updateData);

      if (response.ok && response.data) {
        setMediaItems(prev => prev.map(item =>
          item.id === itemId ? response.data! : item
        ));
      } else {
        console.error('Update failed:', response.error);
        alert('Failed to update item metadata');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update item metadata');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Medya Galerisi
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
              {/* All Images folder */}
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>All Images</span>
                  <span className="text-xs opacity-75">({mediaItems.length})</span>
                </div>
              </button>

              {/* Dynamic folders from API */}
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
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Select Files'}
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
            {loading ? (
              <div className="text-center py-12">
                <Lucide icon="Loader2" className="mx-auto h-12 w-12 text-gray-400 animate-spin mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Loading media items...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Lucide icon="AlertCircle" className="mx-auto h-12 w-12 text-red-400 mb-3" />
                <p className="text-red-500">{error}</p>
                <Button variant="primary" onClick={loadMediaItems} className="mt-3">
                  Retry
                </Button>
              </div>
            ) : filteredItems.length === 0 ? (
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
                              openPreviewModal(item);
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
                            {formatFileSize(item.size)} • {new Date(item.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openPreviewModal(item)}
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
                  onClick={closePreviewModal}
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
                      value={editingMetadata?.alt || ''}
                      onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, alt: e.target.value } : { alt: e.target.value, tags: '' })}
                      placeholder="Describe this image..."
                    />
                  </div>

                  <div>
                    <FormLabel>Folders</FormLabel>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-3">
                      {folders.map(folder => (
                        <label key={folder.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingMetadata?.selectedFolders.includes(folder.id) || false}
                            onChange={(e) => {
                              if (!editingMetadata) return;
                              const selectedFolders = e.target.checked
                                ? [...editingMetadata.selectedFolders, folder.id]
                                : editingMetadata.selectedFolders.filter(id => id !== folder.id);
                              setEditingMetadata({ ...editingMetadata, selectedFolders });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{folder.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormLabel>File Info</FormLabel>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Size: {formatFileSize(previewItem.size)}</p>
                      <p>Type: {previewItem.type}</p>
                      <p>Uploaded: {new Date(previewItem.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="primary"
                      onClick={saveMetadataChanges}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this image?')) {
                          try {
                            const response = await mediaService.deleteMediaItem(currentBrandId, previewItem.id);
                            if (response.ok) {
                              setMediaItems(prev => prev.filter(item => item.id !== previewItem.id));
                              setTotalCount(prev => prev - 1);
                              closePreviewModal();
                              alert('Image deleted successfully');
                            } else {
                              alert('Failed to delete image: ' + response.error?.message);
                            }
                          } catch (error) {
                            console.error('Delete error:', error);
                            alert('Failed to delete image');
                          }
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