import { useCallback, useState, type KeyboardEvent } from "react";

export function useTagsInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const value = tagInput.trim().replace(/^#/, "");
      if (value) {
        setTags((prev) => (prev.includes(value) ? prev : [...prev, value]));
      }
      setTagInput("");
    },
    [tagInput],
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

  return { tags, tagInput, setTagInput, handleAddTag, handleRemoveTag };
}