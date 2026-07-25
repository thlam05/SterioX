import { Button } from '@/components/ui/Button';
import type { StreamResponse } from '@/types/streamType';
import { Eye, MoreVertical } from 'lucide-react';
import { Link } from 'react-router';
import { PATHS } from '@/routes/paths';

type TopStreamCardProps = {
  stream: StreamResponse;
};

export function TopStreamCard({ stream }: TopStreamCardProps) {
  return (
    <Link
      to={PATHS.STREAMS.DETAIL(stream.id)}
      className="md:col-span-2 md:row-span-1 group flex flex-col bg-background border border-accent rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-video bg-foreground overflow-hidden">
        <div className="absolute top-3 left-3 bg-danger text-background text-xs font-black px-2 py-0.5 rounded-md tracking-wider z-10">
          Live
        </div>
        <div className="absolute top-3 right-3 bg-foreground/80 text-background text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10 backdrop-blur-sm">
          <Eye className="w-3.5 h-3.5 text-danger" /> {stream.totalViews}
        </div>
        <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 select-none overflow-hidden">
          <img
            src={stream.thumbnail}
            alt="Stream thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-4 flex gap-3 flex-1 bg-background">
        <div className="w-10 h-10 rounded-full bg-accent text-foreground flex items-center justify-center font-bold shrink-0 border border-primary">
          <img
            src={stream.user?.avatarImageUrl}
            alt={stream.user?.username || 'Avatar'}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
            {stream.title}
          </h4>
          <p className="text-xs font-medium text-secondary">
            {stream.user.username}
          </p>
          <div className="flex gap-1 pt-1">
            {stream.categories.map((category, tIdx) => (
              <span
                key={tIdx}
                className="text-[10px] font-bold bg-selection text-primary px-2 py-0.5 rounded-md"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          className="p-1 border-none bg-transparent text-secondary hover:text-foreground h-8 w-8"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </Link>
  );
}
