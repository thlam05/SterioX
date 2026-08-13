import { Eye, Heart, Play, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LiveStreamItem } from "@/components/features/home/Banner";

interface StreamCardProps {
  stream: LiveStreamItem;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <article className="group flex flex-col bg-accent/20 border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      <div className="relative aspect-video w-full overflow-hidden bg-accent">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 bg-live text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Live
        </div>

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
          <Eye className="w-3 h-3 text-live" />
          {stream.viewerCount.toLocaleString()}
        </div>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-live/90 text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
            {stream.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-2.5">
            <img
              src={stream.streamer.avatar}
              alt={stream.streamer.name}
              className="w-8 h-8 rounded-full object-cover border border-primary/40"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                {stream.streamer.name}
                {stream.streamer.isVerified && (
                  <UserCheck className="w-3 h-3 text-primary" />
                )}
              </span>
              <span className="text-[10px] text-secondary">
                {stream.category}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full text-secondary hover:text-primary hover:bg-primary-light/50 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
