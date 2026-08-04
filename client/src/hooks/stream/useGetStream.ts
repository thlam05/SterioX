import { streamApi } from '@/api/streamApi';
import type { StreamResponse } from '@/types/streamType';
import { useEffect, useState } from 'react';

interface UseGetStreamProps {
  streamId: string;
}

export function useGetStream({ streamId }: UseGetStreamProps) {
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!streamId) return;

    const abortController = new AbortController();

    const fetchStream = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await streamApi.getStreamById(streamId);
        if (!abortController.signal.aborted) {
          setStream(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.log(error);
        if (!abortController.signal.aborted) {
          setError('Failed to fetch stream');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchStream();

    return () => abortController.abort();
  }, [streamId]);

  return { stream, isLoading, error };
}