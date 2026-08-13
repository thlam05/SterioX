import { Folder, Globe, Image as ImageIcon, Tag } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import DescriptionEditor from "@/components/features/stream-setup/DescriptionEditor";
import {
  CATEGORIES,
  PRIVACY_OPTIONS,
  type PrivacyValue,
} from "@/constants/StreamCategories";
import { useCategorySelection } from "@/hooks/features/stream-setup/useCategorySelection";
import { useTagsInput } from "@/hooks/features/stream-setup/useTagInput";

const TITLE_MAX_LENGTH = 100;

export default function StreamDetailForm() {
  const [streamTitle, setStreamTitle] = useState("");
  const [privacy, setPrivacy] = useState<PrivacyValue>("public");
  const [description, setDescription] = useState("");

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    currentSubcategories,
  } = useCategorySelection();

  const { tags, tagInput, setTagInput, handleAddTag, handleRemoveTag } =
    useTagsInput();

  return (
    <section className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-accent/30 border border-border rounded-2xl p-5 space-y-5 flex-1">
        <h3 className="font-bold text-base flex items-center gap-2 text-foreground border-b border-border/60 pb-3">
          Live Room Information
        </h3>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary flex items-center justify-between">
            <span>Stream Title</span>
            <span className="text-[10px] text-secondary">
              {streamTitle.length}/{TITLE_MAX_LENGTH}
            </span>
          </label>
          <Input
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            maxLength={TITLE_MAX_LENGTH}
            placeholder="Enter an engaging title for viewers..."
            className="bg-accent border border-border focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category (2 levels) + Privacy */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-primary" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-accent border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Level 2: Subcategory, depends on selected category */}
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={currentSubcategories.length === 0}
              className="w-full bg-accent border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
            >
              {currentSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Privacy
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as PrivacyValue)}
              className="w-full bg-accent border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
              {PRIVACY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Editor: bold, italic, link only */}
        <DescriptionEditor
          value={description}
          onChange={setDescription}
          label="Live Room Description"
        />

        {/* Tags Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            Hashtags (Press Enter to add)
          </label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add hashtag..."
            className="bg-accent border border-border focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-light text-primary px-2.5 py-1 rounded-lg font-medium border border-primary/20 flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-danger cursor-pointer ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Custom Thumbnail Upload */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            Stream Thumbnail
          </label>
          <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-4 text-center bg-accent/40 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
            <ImageIcon className="w-8 h-8 text-secondary" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                Drag & drop an image or{" "}
                <span className="text-primary">upload</span>
              </p>
              <p className="text-[10px] text-secondary">
                16:9 - PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
