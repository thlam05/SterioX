import { useEffect, useRef, useState } from 'react';
import { THUMBNAIL_MAX_SIZE } from '@/constants/streamSetup';
import { SETUP_VALIDATION } from '@/constants/validation';

export function useThumbnailUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState('');

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setThumbnailError(SETUP_VALIDATION.THUMBNAIL_TYPE);
      return;
    }
    if (file.size > THUMBNAIL_MAX_SIZE) {
      setThumbnailError(SETUP_VALIDATION.THUMBNAIL_SIZE);
      return;
    }

    setThumbnailFile(file);
    setThumbnailError('');
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const validateThumbnail = () => {
    if (!thumbnailFile) {
      setThumbnailError(SETUP_VALIDATION.THUMBNAIL_REQUIRED);
      return false;
    }
    setThumbnailError('');
    return true;
  };

  return {
    fileInputRef,
    thumbnailFile,
    thumbnailName: thumbnailFile?.name ?? null,
    thumbnailPreview,
    thumbnailError,
    openFileDialog,
    handleThumbnailSelect,
    validateThumbnail,
  };
}