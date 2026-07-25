import { Flame, TrendingUp } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="md:col-span-4 md:row-span-2 relative rounded-3xl bg-foreground text-background p-6 md:p-10 overflow-hidden flex flex-col justify-between min-h-[360px] border border-accent shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-100 flex items-center justify-center text-9xl select-none filter blur-sm">
        ✨
      </div>

      <div className="z-20 max-w-xl space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-danger text-background px-3 py-1 rounded-full text-xs font-bold tracking-wide">
          <Flame className="w-3.5 h-3.5" /> Sự kiện công nghệ lớn nhất năm
        </span>
        <h2 className="text-3xl md:text-5xl font-black leading-tight text-background">
          SterioX Developer Conference 2026
        </h2>
        <p className="text-sm md:text-base text-accent max-w-md leading-relaxed">
          Cập nhật những xu hướng công nghệ đột phá nhất, kết nối các lập
          trình viên xuất sắc và trải nghiệm không gian triển lãm ảo.
        </p>
      </div>

      <div className="z-20 flex flex-wrap items-center gap-4 pt-6">
        <div className="flex items-center gap-2 text-xs md:text-sm text-accent">
          <TrendingUp className="w-4 h-4 text-success" />{' '}
          <strong>45.9k</strong> người đang theo dõi sự kiện trực tiếp
        </div>
      </div>
    </section>
  );
}
