import { ChevronRight } from 'lucide-react';
import type { CategoryResponse } from '@/types/categoryType';

type CategorySelectorProps = {
  categoriesData: CategoryResponse[];
  parentCategory: string;
  subCategory: string;
  activeParent: CategoryResponse | undefined;
  categoryError: string;
  onParentSelect: (id: string) => void;
  onSubSelect: (id: string) => void;
};

export function CategorySelector({
  categoriesData,
  parentCategory,
  subCategory,
  activeParent,
  categoryError,
  onParentSelect,
  onSubSelect,
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold tracking-widest opacity-60 uppercase">
          Chuyên mục phân cấp
        </label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-secondary">
            Bước 1: Chọn chuyên mục chính
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoriesData.map((cat) => {
              const isSelected = parentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onParentSelect(cat.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-selection text-foreground'
                      : 'border-accent bg-background text-secondary hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{cat.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isSelected ? 'text-primary rotate-90' : 'text-accent'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {parentCategory && activeParent && (
          <div className="space-y-2 pt-2 border-t border-accent border-dashed animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-[11px] font-bold text-secondary">
              Bước 2: Chọn danh mục chi tiết thuộc {activeParent.name}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeParent.subCategories?.map((sub) => {
                const isSubSelected = subCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSubSelect(sub.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isSubSelected
                        ? 'border-primary bg-selection text-foreground'
                        : 'border-accent bg-background text-secondary hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{sub.name}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSubSelected ? 'border-primary' : 'border-accent'}`}
                    >
                      {isSubSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-accent/30 rounded-xl flex items-center gap-2 text-xs">
        <span className="font-bold text-secondary">Đã chọn:</span>
        {parentCategory ? (
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <span>{activeParent?.name}</span>
            {subCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-secondary" />
                <span className="text-primary">
                  {
                    activeParent?.subCategories?.find(
                      (s) => s.id === subCategory,
                    )?.name
                  }
                </span>
              </>
            )}
          </div>
        ) : (
          <span className="italic text-secondary">
            Vui lòng chọn đầy đủ chuyên mục 2 cấp
          </span>
        )}
      </div>
      {categoryError && (
        <p className="text-danger text-xs mt-1">{categoryError}</p>
      )}
    </div>
  );
}
