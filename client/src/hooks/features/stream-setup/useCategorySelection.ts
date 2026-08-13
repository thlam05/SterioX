import { CATEGORIES } from "@/constants/StreamCategories";
import { useEffect, useMemo, useState } from "react";

export function useCategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    CATEGORIES[0].subcategories[0]?.id ?? "",
  );

  const currentSubcategories = useMemo(
    () => CATEGORIES.find((cat) => cat.id === selectedCategory)?.subcategories ?? [],
    [selectedCategory],
  );

  useEffect(() => {
    setSelectedSubcategory(currentSubcategories[0]?.id ?? "");
  }, [currentSubcategories]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    currentSubcategories,
  };
}