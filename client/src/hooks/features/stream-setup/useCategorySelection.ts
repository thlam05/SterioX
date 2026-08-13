import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/hooks/common/useCategories";

export function useCategorySelection() {
  const { categories, loading, error } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const currentSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return categories.find((cat) => cat.id === selectedCategory)?.subCategories ?? [];
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (currentSubcategories.length > 0) {
      setSelectedSubcategory(currentSubcategories[0].id);
    } else {
      setSelectedSubcategory("");
    }
  }, [currentSubcategories]);

  return {
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    currentSubcategories,
  };
}