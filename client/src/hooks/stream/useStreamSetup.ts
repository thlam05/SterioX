import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { streamApi, streamKeyApi } from '@/api/streamApi';
import { categoryApi } from '@/api/categoryApi';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';
import { STREAM_STATUS, STREAM_LATENCY, THUMBNAIL_MAX_SIZE } from '@/constants/streamSetup';
import { SETUP_VALIDATION } from '@/constants/validation';
import type { CategoryResponse } from '@/types/categoryType';

export function useStreamSetup() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>(STREAM_STATUS.PUBLIC);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copied, setCopied] = useState<'streamUrl' | 'streamKey' | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [latency, setLatency] = useState<string>(STREAM_LATENCY.NORMAL);
  const [dvr, setDvr] = useState(true);
  const [vod, setVod] = useState(true);

  const [parentCategory, setParentCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        const categories = await categoryApi.getCategories();
        if (!abortController.signal.aborted && categories)
          setCategoriesData(categories);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      }
    };

    fetchCategories();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const abortController = new AbortController();

    const loadStreamKey = async () => {
      try {
        const data = await streamKeyApi.getStreamKey(user.id);
        if (!abortController.signal.aborted) {
          setStreamKey(data.streamKey ?? null);
          setStreamUrl(data.streamUrl ?? null);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('Không thể tải stream key', error);
      }
    };

    loadStreamKey();

    return () => abortController.abort();
  }, [user?.id]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleCreateStreamKey = async () => {
    if (!user?.id) return;

    try {
      const data = await streamKeyApi.createStreamKey({
        userId: user.id,
        isActive: false,
      });
      setStreamKey(data.streamKey ?? null);
      setStreamUrl(data.streamUrl ?? null);
    } catch (error) {
      console.error('Failed to create or load stream key', error);
    }
  };

  const handleCopyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      setCopied('streamKey');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyStreamUrl = () => {
    if (streamUrl) {
      navigator.clipboard.writeText(streamUrl);
      setCopied('streamUrl');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleThumbnailChange = () => {
    fileInputRef.current?.click();
  };

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
    setThumbnail(file.name);
    setThumbnailError('');

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const validateForm = () => {
    let isValid = true;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const selectedParentCategory = parentCategory.trim();

    if (!trimmedTitle) {
      setTitleError(SETUP_VALIDATION.TITLE_REQUIRED);
      isValid = false;
    } else if (trimmedTitle.length < 5) {
      setTitleError(SETUP_VALIDATION.TITLE_MIN_LENGTH);
      isValid = false;
    } else if (trimmedTitle.length > 100) {
      setTitleError(SETUP_VALIDATION.TITLE_MAX_LENGTH);
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!trimmedDescription) {
      setDescriptionError(SETUP_VALIDATION.DESCRIPTION_REQUIRED);
      isValid = false;
    } else if (trimmedDescription.length < 10) {
      setDescriptionError(SETUP_VALIDATION.DESCRIPTION_MIN_LENGTH);
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!thumbnailFile) {
      setThumbnailError(SETUP_VALIDATION.THUMBNAIL_REQUIRED);
      isValid = false;
    } else {
      setThumbnailError('');
    }

    if (!selectedParentCategory) {
      setCategoryError(SETUP_VALIDATION.CATEGORY_REQUIRED);
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError('');
    if (!validateForm()) return;

    if (!user?.id) {
      setSubmitError(SETUP_VALIDATION.NOT_LOGGED_IN);
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryIds = [];
      if (parentCategory) categoryIds.push(parentCategory);
      if (subCategory) categoryIds.push(subCategory);
      await streamApi.createStream({
        userId: user.id,
        title,
        description,
        thumbnail: thumbnailFile,
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

  const activeParent = categoriesData.find((cat) => cat.id === parentCategory);

  const handleParentSelect = (id: string) => {
    setParentCategory(id);
    setSubCategory('');
    setCategoryError('');
  };

  return {
    title, setTitle,
    description, setDescription,
    status, setStatus,
    streamKey, streamUrl,
    showStreamKey, setShowStreamKey,
    copied,
    thumbnail, thumbnailPreview,
    titleError, descriptionError, thumbnailError, categoryError,
    isSubmitting, submitError,
    latency, setLatency,
    dvr, setDvr,
    vod, setVod,
    parentCategory, subCategory, setSubCategory, categoriesData,
    activeParent,
    handleCreateStreamKey,
    handleCopyStreamKey,
    handleCopyStreamUrl,
    handleThumbnailChange,
    handleThumbnailSelect,
    handleSubmit,
    handleParentSelect,
  };
}
