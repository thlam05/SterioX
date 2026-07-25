import { Button } from '@/components/ui/Button';
import type { CategoryItem } from '@/constants/categories';

type CategoryCardProps = {
  category: CategoryItem;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <div className="md:col-span-1 md:row-span-2 group relative rounded-2xl border border-accent bg-background p-4 flex flex-col justify-between overflow-hidden hover:border-primary transition-all duration-200 min-h-[220px]">
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity select-none">
        {category.bgEmoji}
      </div>

      <div className="space-y-3 z-10">
        <div
          className={`w-10 h-10 rounded-xl bg-accent flex items-center justify-center ${category.color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {category.name}
          </h4>
          <p className="text-xs text-secondary mt-1">{category.count}</p>
        </div>
      </div>

      <div className="z-10 pt-4">
        <Button
          variant="outline"
          className="w-full text-xs font-bold py-2 border-accent hover:bg-selection hover:text-primary rounded-xl transition-colors"
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
