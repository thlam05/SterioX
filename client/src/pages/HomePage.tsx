import { useState } from "react";
import { Compass, Eye, Flame, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Banner, type LiveStreamItem } from "@/components/features/home/Banner";
import { StreamCard } from "@/components/features/home/StreamCard";

interface Category {
  id: string;
  name: string;
}

const CATEGORIES: Category[] = [
  { id: "all", name: "All live" },
  { id: "gaming", name: "Gaming" },
  { id: "talk", name: "Talk" },
  { id: "music", name: "Music" },
  { id: "beauty", name: "Beauty" },
  { id: "tech", name: "Tech" },
  { id: "food", name: "Food" },
];

const MOCK_STREAMS: LiveStreamItem[] = [
  { id: "1", title: "Late night stories, no script", description: "A quiet room for honest conversations and whatever is on your mind.", streamer: { id: "s1", name: "Minh Anh Live", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", isVerified: true }, category: "Talk", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80", viewerCount: 12450, isLive: true, tags: ["Stories", "Chill"] },
  { id: "2", title: "Ranked finals with the squad", streamer: { id: "s2", name: "ProGamer_VN", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", isVerified: true }, category: "Gaming", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80", viewerCount: 8920, isLive: true, tags: ["Esports", "FPS"] },
  { id: "3", title: "Soft glam makeup session", streamer: { id: "s3", name: "Thao Nhi Beauty", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }, category: "Beauty", thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", viewerCount: 3410, isLive: true, tags: ["Makeup", "Tutorial"] },
  { id: "4", title: "Acoustic night: take a request", streamer: { id: "s4", name: "Hoang Band", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }, category: "Music", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80", viewerCount: 5600, isLive: true, tags: ["Acoustic", "Live"] },
  { id: "5", title: "Building a tiny AI workstation", streamer: { id: "s5", name: "TechMaster", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", isVerified: true }, category: "Tech", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80", viewerCount: 1890, isLive: true, tags: ["Build", "AI"] },
  { id: "6", title: "Seafood feast and fan questions", streamer: { id: "s6", name: "Foodie Linh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80" }, category: "Food", thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", viewerCount: 7200, isLive: true, tags: ["Food", "Chat"] },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = MOCK_STREAMS.filter((stream) => {
    const matchesCategory = selectedCategory === "all" || stream.category.toLowerCase() === selectedCategory;
    const query = searchQuery.toLowerCase();
    return matchesCategory && (!query || stream.title.toLowerCase().includes(query) || stream.streamer.name.toLowerCase().includes(query));
  });
  const featuredStream = MOCK_STREAMS[0];

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-7 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Pinklive / discover</p>
            <h1 className="max-w-xl text-4xl font-black tracking-[-0.055em] text-foreground sm:text-5xl">Find your next live room.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-secondary">A hand-picked view of what is happening now, from quiet conversations to loud victories.</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search rooms or creators" className="h-11 w-full rounded-xl border border-border bg-accent pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-secondary focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </div>
            <Button variant="ghost" aria-label="Open filters" className="h-11 w-11 rounded-xl border border-border bg-accent p-0 text-secondary hover:text-primary"><SlidersHorizontal className="h-4 w-4" /></Button>
          </div>
        </header>

        {!searchQuery && selectedCategory === "all" && <Banner stream={featuredStream} />}

        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary-light text-primary"><Flame className="h-4 w-4" /></span>
              <div><h2 className="text-xl font-extrabold tracking-[-0.03em]">{selectedCategory === "all" ? "Live right now" : CATEGORIES.find((category) => category.id === selectedCategory)?.name}</h2><p className="text-xs text-secondary">{filteredStreams.length} rooms are broadcasting</p></div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary"><Eye className="h-3.5 w-3.5" /> Updated moments ago</div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {CATEGORIES.map((category) => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${selectedCategory === category.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border border-border bg-accent text-secondary hover:border-primary/50 hover:text-primary"}`}>{category.name}</button>)}
          </div>
          {filteredStreams.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-accent py-20 text-center"><Compass className="mx-auto mb-4 h-8 w-8 text-secondary" /><p className="font-semibold">No rooms match that search.</p><button onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }} className="mt-3 text-sm font-bold text-primary hover:underline">Clear filters</button></div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredStreams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}</div>}
        </section>
      </main>
    </div>
  );
}
