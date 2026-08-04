import { useState } from 'react';
import { SETUP_VALIDATION } from '@/constants/validation';

export function useStreamFormFields() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const validateFields = () => {
    let isValid = true;
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

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

    return isValid;
  };

  return {
    title, setTitle, titleError,
    description, setDescription, descriptionError,
    validateFields,
  };
}