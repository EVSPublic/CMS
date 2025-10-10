import React, { useState } from 'react';
import Button from '../Base/Button';
import FormInput from '../Base/Form/FormInput';
import Lucide from '../Base/Lucide';
import ImageSelector from '../ImageSelector';

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

interface ImageInputProps {
  value: string;
  onChange: (url: string, item?: MediaItem) => void;
  placeholder?: string;
  label?: string;
  showPreview?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  placeholder = "Select an image...",
  label,
  showPreview = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleImageSelect = (item: MediaItem) => {
    setSelectedItem(item);
    onChange(item.url, item);
    setIsModalOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
    onChange('');
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="flex space-x-2">
        <div className="flex-1">
          <FormInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={!!selectedItem}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
        >
          <Lucide icon="Image" className="w-4 h-4 mr-1" />
          Browse
        </Button>
        {(value || selectedItem) && (
          <Button
            type="button"
            variant="outline-danger"
            onClick={handleClearSelection}
          >
            <Lucide icon="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showPreview && (value || selectedItem?.thumbnail) && (
        <div className="mt-3">
          <div className="w-32 h-32 border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={selectedItem?.thumbnail ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050'}${selectedItem.thumbnail}` : value}
              alt={selectedItem?.alt || "Selected image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          {selectedItem && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">{selectedItem.filename}</p>
              {selectedItem.alt && (
                <p className="text-xs">Alt: {selectedItem.alt}</p>
              )}
            </div>
          )}
        </div>
      )}

      <ImageSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
        selectedImageId={selectedItem?.id}
        title={label ? `Select Image for ${label}` : "Select Image"}
      />
    </div>
  );
};

export default ImageInput;