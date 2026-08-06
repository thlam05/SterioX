import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Settings,
  Radio,
  Copy,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Share2,
  Lock,
  Globe,
  Tag,
  Folder,
  ArrowLeft,
  AlertCircle,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Video,
  VideoOff,
} from "lucide-react";
import StreamCredentials from "@/components/features/stream-setup/StreamCredentials";

interface StreamCategory {
  id: string;
  name: string;
}

const CATEGORIES: StreamCategory[] = [
  { id: "chat", name: "Chat & Talk" },
  { id: "gaming", name: "Gaming & Esports" },
  { id: "beauty", name: "Beauty & Style" },
  { id: "music", name: "Music & Performance" },
  { id: "tech", name: "Technology & Programming" },
  { id: "eating", name: "Mukbang & Food" },
];

export default function StreamSetupPage() {
  const [streamTitle, setStreamTitle] = useState<string>(
    "🔥 Weekend Hangout - Chat & Sing Requests",
  );
  const [description, setDescription] = useState<string>(
    "<p>Hello everyone! Today I will <strong>chat</strong>, <em>sing</em> and hang out with you all.</p>",
  );
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("chat");
  const [privacy, setPrivacy] = useState<"public" | "private" | "unlisted">(
    "public",
  );
  const [tags, setTags] = useState<string[]>(["Chill", "Chat", "Interactive"]);
  const [tagInput, setTagInput] = useState<string>("");

  const [streamKey] = useState<string>("live_sk_94827103984719283741");
  const [streamUrl] = useState<string>("rtmp://live.pinklive.com/app/");
  const [showStreamKey, setShowStreamKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFormatText = (command: "bold" | "italic" | "underline") => {
    document.execCommand(command, false);
    descriptionRef.current?.focus();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (!url) return;

    const selectedText = window.getSelection()?.toString() || "Link";
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`,
    );
    descriptionRef.current?.focus();
    handleDescriptionInput();
  };

  const handleDescriptionInput = () => {
    if (descriptionRef.current) {
      setDescription(descriptionRef.current.innerHTML);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-full text-secondary hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost">
            <Settings className="w-4 h-4" />
            <span>Advanced Settings</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
            <Radio className="w-4 h-4" />
            <span>Start Live Stream</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Preview & Hardware Setup (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Live Preview */}
          <div className="bg-accent/30 border border-border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
              <Video className="w-4 h-4 text-primary" />
              Live Preview
            </h3>
            <div className="aspect-video w-full rounded-xl bg-accent border border-border flex flex-col items-center justify-center gap-2">
              <VideoOff className="w-8 h-8 text-secondary" />
              <p className="text-xs text-secondary font-medium">
                No signal from broadcasting software yet
              </p>
            </div>
          </div>

          {/* Software / OBS Stream Credentials */}
          <StreamCredentials streamUrl={streamUrl} streamKey={streamUrl} />
        </section>

        {/* Right Column: Stream Details Form (5 cols) */}
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
                className="bg-accent border-border focus:ring-primary"
              />
            </div>

            {/* Category + Privacy grouped together */}
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

            {/* Description Editor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary flex items-center justify-between">
                <span>Live Room Description</span>
                <span className="text-[10px] text-secondary">
                  Basic formatting supported
                </span>
              </label>

              <div className="rounded-xl border border-border bg-accent p-2">
                <div className="flex items-center gap-1 border-b border-border/60 pb-2">
                  <button
                    type="button"
                    onClick={() => handleFormatText("bold")}
                    className="rounded-md p-2 text-secondary transition-colors hover:bg-background hover:text-foreground"
                    title="Bold"
                  >
                    <BoldIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText("italic")}
                    className="rounded-md p-2 text-secondary transition-colors hover:bg-background hover:text-foreground"
                    title="Italic"
                  >
                    <ItalicIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText("underline")}
                    className="rounded-md p-2 text-secondary transition-colors hover:bg-background hover:text-foreground"
                    title="Underline"
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertLink}
                    className="rounded-md p-2 text-secondary transition-colors hover:bg-background hover:text-foreground"
                    title="Insert link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>

                <div
                  ref={descriptionRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleDescriptionInput}
                  dangerouslySetInnerHTML={{ __html: description }}
                  className="min-h-28 rounded-lg bg-background/80 px-3 py-2 text-sm text-foreground outline-none"
                  role="textbox"
                  aria-multiline="true"
                />
              </div>

              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                  Preview
                </p>
                <div
                  className="mt-2 text-sm text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: description || "<p>...</p>",
                  }}
                />
              </div>
            </div>

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
                className="bg-accent border-border focus:ring-primary"
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
      </div>
    </div>
  );
}
