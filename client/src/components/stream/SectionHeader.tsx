import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

type SectionHeaderProps = {
  title: string;
  barColor: string;
};

export function SectionHeader({ title, barColor }: SectionHeaderProps) {
  return (
    <div className="md:col-span-4 flex justify-between items-center pt-6">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-6 ${barColor} rounded-full`}></div>
        <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
      </div>
      <Button
        variant="outline"
        className="text-xs font-bold flex items-center gap-1 border-accent"
      >
        Xem tất cả <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
