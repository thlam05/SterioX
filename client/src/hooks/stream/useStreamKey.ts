import { useEffect, useState } from 'react';
import { streamKeyApi } from '@/api/streamApi';

export function useStreamKey(userId: string | undefined) {
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    if (!userId) return;
    const abortController = new AbortController();

    streamKeyApi
      .getStreamKey(userId)
      .then((data) => {
        if (!abortController.signal.aborted) {
          setStreamKey(data.streamKey ?? null);
          setStreamUrl(data.streamUrl ?? '');
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Failed to load stream key', error);
      });

    return () => abortController.abort();
  }, [userId]);

  const createStreamKey = async () => {
    if (!userId) return;
    try {
      const data = await streamKeyApi.createStreamKey({ userId, isActive: false });
      setStreamKey(data.streamKey ?? null);
      setStreamUrl(data.streamUrl ?? '');
    } catch (error) {
      console.error('Failed to create stream key', error);
    }
  };

  return { streamKey, streamUrl, createStreamKey };
}