import { streamApi } from '@/api/streamApi';
import type { StreamResponse } from '@/types/streamType';
import { useEffect, useMemo, useState } from 'react';

export function useLivestreams() {
  const [livestreams, setLivestreams] = useState<StreamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTopLivestreams = async () => {
      try {
        const livestreams = await streamApi.getTopStream();
        if (!abortController.signal.aborted) {
          setLivestreams(livestreams);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTopLivestreams();

    return () => abortController.abort();
  }, []);

  const topLivestreams = useMemo(() => livestreams.slice(0, 2), [livestreams]);

  const regularLivestream = useMemo(
    () => livestreams.slice(2, 11),
    [livestreams],
  );

  return { topLivestreams, regularLivestream, isLoading };
}
