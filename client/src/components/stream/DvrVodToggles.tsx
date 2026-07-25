import { ToggleLeft, ToggleRight } from 'lucide-react';

type DvrVodTogglesProps = {
  dvr: boolean;
  vod: boolean;
  onDvrChange: (value: boolean) => void;
  onVodChange: (value: boolean) => void;
};

export function DvrVodToggles({ dvr, vod, onDvrChange, onVodChange }: DvrVodTogglesProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between py-3 border-b border-accent">
        <div className="space-y-0.5">
          <p className={`text-xs font-bold ${dvr ? 'text-foreground' : 'text-secondary'}`}>
            Chế độ tua lại (DVR)
          </p>
          <p className={`text-[10px] italic ${dvr ? 'text-secondary' : 'text-secondary opacity-70'}`}>
            Cho phép người xem tua lại
          </p>
        </div>
        <button type="button" onClick={() => onDvrChange(!dvr)}>
          {dvr ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-secondary" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="space-y-0.5">
          <p className={`text-xs font-bold ${vod ? 'text-foreground' : 'text-secondary'}`}>
            Lưu bản ghi (VOD)
          </p>
          <p className={`text-[10px] italic ${vod ? 'text-secondary' : 'text-secondary opacity-70'}`}>
            Tự động lưu sau khi kết thúc
          </p>
        </div>
        <button type="button" onClick={() => onVodChange(!vod)}>
          {vod ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-secondary" />
          )}
        </button>
      </div>
    </div>
  );
}
