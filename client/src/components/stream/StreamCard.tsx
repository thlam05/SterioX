import type { StreamResponse } from '@/types/streamType';
import { Eye } from 'lucide-react';
import { Link } from 'react-router';
import { PATHS } from '@/routes/paths';

type StreamCardProps = {
  stream: StreamResponse;
};

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link
      to={PATHS.STREAMS.DETAIL(stream.id)}
      className="md:col-span-1 group flex flex-col bg-background border border-accent rounded-2xl overflow-hidden hover:border-secondary transition-all duration-200"
    >
      <div className="relative aspect-video bg-foreground overflow-hidden">
        <div className="absolute top-2 left-2 bg-secondary text-background text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
          Đang phát
        </div>
        <div className="absolute top-2 right-2 bg-foreground/60 text-background text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
          <Eye className="w-3 h-3 text-info" /> {stream.totalViews}
        </div>
        <div className="w-full h-full flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 select-none">
          {stream.thumbnail}
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-background">
        <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {stream.title}
        </h4>
        <p className="text-[11px] font-medium text-secondary truncate">
          {stream.user.username}
        </p>
      </div>
    </Link>
  );
}
