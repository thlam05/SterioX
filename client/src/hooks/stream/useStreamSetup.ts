import { useState } from 'react';
import { useNavigate } from 'react-router';
import { streamApi } from '@/api/streamApi';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';
import { STREAM_STATUS, STREAM_LATENCY } from '@/constants/streamSetup';
import { SETUP_VALIDATION } from '@/constants/validation';

import { useCategories } from './useCategories';
import { useStreamKey } from './useStreamKey';
import { useCopyToClipboard } from './useCopyToClipboard';
import { useThumbnailUpload } from './useThumbnailUpload';
import { useStreamFormFields } from './useStreamFormFields';

export function useStreamSetup() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { categoriesData } = useCategories();
  const { streamKey, streamUrl, createStreamKey } = useStreamKey(user?.id);
  const { copied, copy } = useCopyToClipboard<'streamUrl' | 'streamKey'>();
  const thumbnail = useThumbnailUpload();
  const fields = useStreamFormFields();

  const [status, setStatus] = useState<string>(STREAM_STATUS.PUBLIC);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [latency, setLatency] = useState<string>(STREAM_LATENCY.NORMAL);
  const [dvr, setDvr] = useState(true);
  const [vod, setVod] = useState(true);
  const [parentCategory, setParentCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const activeParent = categoriesData.find((cat) => cat.id === parentCategory);

  const handleParentSelect = (id: string) => {
    setParentCategory(id);
    setSubCategory('');
    setCategoryError('');
  };

  const validateCategory = () => {
    if (!parentCategory.trim()) {
      setCategoryError(SETUP_VALIDATION.CATEGORY_REQUIRED);
      return false;
    }
    setCategoryError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const isFieldsValid = fields.validateFields();
    const isThumbnailValid = thumbnail.validateThumbnail();
    const isCategoryValid = validateCategory();
    if (!isFieldsValid || !isThumbnailValid || !isCategoryValid) return;

    if (!user?.id) {
      setSubmitError(SETUP_VALIDATION.NOT_LOGGED_IN);
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryIds = [parentCategory, subCategory].filter(Boolean);
      await streamApi.createStream({
        userId: user.id,
        title: fields.title,
        description: fields.description,
        thumbnail: thumbnail.thumbnailFile,
        categoryIds,
      });
      navigate(PATHS.STREAMS.DASHBOARD);
    } catch (error) {
      console.error('Failed to save livestream settings', error);
      setSubmitError(SETUP_VALIDATION.SAVE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...fields,
    status, setStatus,
    latency, setLatency,
    dvr, setDvr,
    vod, setVod,
    streamKey, streamUrl, showStreamKey, setShowStreamKey,
    handleCreateStreamKey: createStreamKey,
    copied,
    handleCopyStreamKey: () => copy(streamKey, 'streamKey'),
    handleCopyStreamUrl: () => copy(streamUrl, 'streamUrl'),
    thumbnail: thumbnail.thumbnailName,
    thumbnailPreview: thumbnail.thumbnailPreview,
    thumbnailError: thumbnail.thumbnailError,
    fileInputRef: thumbnail.fileInputRef,
    handleThumbnailChange: thumbnail.openFileDialog,
    handleThumbnailSelect: thumbnail.handleThumbnailSelect,
    parentCategory, subCategory, setSubCategory, categoriesData,
    activeParent, categoryError, handleParentSelect,
    isSubmitting, submitError, handleSubmit,
  };
}