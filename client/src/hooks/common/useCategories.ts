import { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import type { CategoryResponse } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    categoryService
      .getCategories()
      .then((response) => {
        if (isMounted) setCategories(response.data.data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to fetch categories");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}

export default useCategories;