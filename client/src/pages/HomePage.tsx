import { useLivestreams } from '@/hooks/stream/useLivestreams';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeroBanner } from '@/components/stream/HeroBanner';
import { SectionHeader } from '@/components/stream/SectionHeader';
import { TopStreamCard } from '@/components/stream/TopStreamCard';
import { CategoryCard } from '@/components/stream/CategoryCard';
import { StreamCard } from '@/components/stream/StreamCard';
import { categories } from '@/constants/categories';

export default function HomePage() {
  const { topLivestreams, regularLivestream, isLoading } = useLivestreams();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        <HeroBanner />

        <SectionHeader
          title="Livestream xu hướng xem nhiều"
          barColor="bg-danger"
        />

        {topLivestreams.map((stream, index) => (
          <TopStreamCard key={index} stream={stream} />
        ))}

        <SectionHeader
          title="Khám phá theo chuyên mục"
          barColor="bg-primary"
        />

        {categories.map((cat, index) => (
          <CategoryCard key={index} category={cat} />
        ))}

        <SectionHeader
          title="Các buổi livestream đang diễn ra"
          barColor="bg-info"
        />

        {regularLivestream.map((stream, index) => (
          <StreamCard key={index} stream={stream} />
        ))}
      </div>
    </div>
  );
}
