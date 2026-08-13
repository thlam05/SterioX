import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Settings, Radio, ArrowLeft, Video, VideoOff } from "lucide-react";
import StreamCredentials from "@/components/features/stream-setup/StreamCredentials";
import StreamDetailForm from "@/components/features/stream-setup/StreamDetailForm";

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

        <StreamDetailForm></StreamDetailForm>
      </div>
    </div>
  );
}
