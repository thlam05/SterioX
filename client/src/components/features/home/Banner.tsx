import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface LiveStreamItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail: string;
  viewerCount: number;
  isLive: boolean;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  tags?: string[];
}

interface BannerProps {
  stream: LiveStreamItem;
}

export function Banner({ stream }: BannerProps) {
  const formattedViewers = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stream.viewerCount);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-foreground text-primary-foreground shadow-2xl">
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full min-h-[360px]">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/30" />

        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            {stream.isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-live px-3 py-1 text-xs font-bold uppercase text-primary-foreground shadow-md">
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                LIVE
              </span>
            )}

              <span className="rounded-full bg-primary-foreground/15 px-3.5 py-1 text-xs font-medium text-primary-foreground/90 backdrop-blur-md border border-primary-foreground/10">
              {stream.category}
            </span>
          </div>

          <div className="max-w-2xl space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-primary-foreground drop-shadow-md">
              {stream.title}
            </h1>

            {stream.description && (
              <p className="text-sm md:text-base text-primary-foreground/80 line-clamp-2 leading-relaxed max-w-xl">
                {stream.description}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2">
              <Button variant="live" size="lg">
                <Play className="h-4 w-4 fill-current shrink-0" />
                <span>Xem ngay</span>
              </Button>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-foreground object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                    alt="Viewer 1"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-foreground object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                    alt="Viewer 2"
                  />
                </div>
                <span className="text-xs font-bold text-primary-foreground/90 bg-primary-foreground/10 px-2 py-0.5 rounded-full border border-primary-foreground/10">
                  +{formattedViewers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
