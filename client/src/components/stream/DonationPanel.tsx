import { Sparkles } from 'lucide-react';

export function DonationPanel() {
  return (
    <div className="bg-background border border-accent p-4 rounded-3xl space-y-3">
      <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-warning" /> Vinh danh quyên góp
        mới nhất
      </h3>

      <div className="space-y-2.5">
        <p className="text-xs text-secondary italic text-center py-4">
          Chưa có quyên góp nào.
        </p>
      </div>
    </div>
  );
}
