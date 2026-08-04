import { useEffect, useState } from 'react';
import { categoryApi } from '@/api/categoryApi';
import type { CategoryResponse } from '@/types/categoryType';

export function useCategories() {
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    categoryApi
      .getCategories()
      .then((categories) => {
        if (!abortController.signal.aborted && categories) {
          setCategoriesData(categories);
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Failed to fetch categories', error);
      });

    return () => abortController.abort();
  }, []);

  return { categoriesData };
}