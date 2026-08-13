import { useState, useCallback, useMemo, useEffect } from "react";
import { Folder, Globe, Tag, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import DescriptionEditor from "./DescriptionEditor";

// --- Category data: 2 levels (category -> subcategories) ---
const CATEGORIES = [
  {
    id: "gaming",
    name: "Gaming",
    subcategories: [
      { id: "fps", name: "FPS" },
      { id: "moba", name: "MOBA" },
      { id: "rpg", name: "RPG" },
      { id: "sandbox", name: "Sandbox / Survival" },
    ],
  },
  {
    id: "music",
    name: "Music",
    subcategories: [
      { id: "live-performance", name: "Live Performance" },
      { id: "dj-set", name: "DJ Set" },
      { id: "production", name: "Music Production" },
    ],
  },
  {
    id: "talk",
    name: "Just Chatting",
    subcategories: [
      { id: "irl", name: "IRL" },
      { id: "qna", name: "Q&A" },
      { id: "podcast", name: "Podcast" },
    ],
  },
  {
    id: "art",
    name: "Art & Creative",
    subcategories: [
      { id: "drawing", name: "Drawing & Painting" },
      { id: "design", name: "Design" },
      { id: "crafting", name: "Crafting" },
    ],
  },
  {
    id: "education",
    name: "Education",
    subcategories: [
      { id: "coding", name: "Coding" },
      { id: "language", name: "Language Learning" },
      { id: "science", name: "Science" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    subcategories: [
      { id: "football", name: "Football" },
      { id: "esports", name: "Esports" },
      { id: "fitness", name: "Fitness" },
    ],
  },
];

export default function StreamDetailForm() {
  const [streamTitle, setStreamTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    CATEGORIES[0].subcategories[0].id,
  );
  const [privacy, setPrivacy] = useState("public");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const currentSubcategories = useMemo(() => {
    return (
      CATEGORIES.find((cat) => cat.id === selectedCategory)?.subcategories ?? []
    );
  }, [selectedCategory]);

  // Whenever the top-level category changes, reset subcategory to its first option
  useEffect(() => {
    if (currentSubcategories.length > 0) {
      setSelectedSubcategory(currentSubcategories[0].id);
    } else {
      setSelectedSubcategory("");
    }
  }, [selectedCategory, currentSubcategories]);

  // --- Tag handlers ---
  const handleAddTag = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const value = tagInput.trim().replace(/^#/, "");
      if (value && !tags.includes(value)) {
        setTags((prev) => [...prev, value]);
      }
      setTagInput("");
    },
    [tagInput, tags],
  );

  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

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
              {streamTitle.length}/100
            </span>
          </label>
          <Input
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            maxLength={100}
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
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full bg-accent border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
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
