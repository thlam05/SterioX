export type Subcategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export const CATEGORIES: Category[] = [
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

export const PRIVACY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "unlisted", label: "Unlisted" },
  { value: "private", label: "Private" },
] as const;

export type PrivacyValue = (typeof PRIVACY_OPTIONS)[number]["value"];