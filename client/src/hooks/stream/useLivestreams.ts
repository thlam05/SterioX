import { streamApi } from '@/api/streamApi';
import type { StreamResponse } from '@/types/streamType';
import { useEffect, useState } from 'react';

export function useLivestreams() {
  const [livestreams, setLivestreams] = useState<StreamResponse[]>([]);
  const [topLivestreams, setTopLivestream] = useState<StreamResponse[]>([]);
  const [regularLivestream, setRegularLivestream] = useState<StreamResponse[]>(
    [],
  );
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

  useEffect(() => {
    if (!livestreams) return;

    setTopLivestream(livestreams.slice(0, 2));
    setRegularLivestream(livestreams.slice(2, 11));
  }, [livestreams]);

  return { topLivestreams, regularLivestream, isLoading };
}
