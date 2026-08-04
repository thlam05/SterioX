import { useState } from 'react';

export function useCopyToClipboard<T extends string>() {
  const [copied, setCopied] = useState<T | null>(null);

  const copy = (value: string | null, key: T) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return { copied, copy };
}