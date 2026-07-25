import { Button } from '@/components/ui/Button';
import { StreamKeyField } from '@/components/stream/StreamKeyField';
import { Sparkles, KeyRound, Zap } from 'lucide-react';

type StreamKeySectionProps = {
  streamKey: string | null;
  streamUrl: string;
  showStreamKey: boolean;
  copied: 'streamUrl' | 'streamKey' | null;
  onToggleShowKey: () => void;
  onCopyUrl: () => void;
  onCopyKey: () => void;
  onCreateKey: () => void;
};

export function StreamKeySection({
  streamKey,
  streamUrl,
  showStreamKey,
  copied,
  onToggleShowKey,
  onCopyUrl,
  onCopyKey,
  onCreateKey,
}: StreamKeySectionProps) {
  if (streamKey) {
    return (
      <section className="bg-background border border-accent rounded-3xl p-6 relative overflow-hidden min-h-[250px] flex flex-col justify-center">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black tracking-tight uppercase">
              Cấu hình phần mềm
            </h3>
          </div>

          <StreamKeyField
            streamUrl={streamUrl}
            streamKey={streamKey}
            showStreamKey={showStreamKey}
            copied={copied}
            onToggleShowKey={onToggleShowKey}
            onCopyUrl={onCopyUrl}
            onCopyKey={onCopyKey}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background border border-accent rounded-3xl p-6 relative overflow-hidden min-h-[250px] flex flex-col justify-center">
      <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-selection rounded-full flex items-center justify-center mx-auto mb-2 text-primary border border-primary/20">
          <KeyRound className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">Chưa có khóa luồng</h3>
          <p className="text-[10px] text-secondary mt-1 px-4">
            Bạn cần khởi tạo Stream Key để bắt đầu truyền tín hiệu từ phần mềm
            (OBS, vMix...)
          </p>
        </div>
        <Button
          onClick={onCreateKey}
          variant="primary"
          className="w-full max-w-[200px] rounded-xl font-bold uppercase tracking-tight gap-2"
        >
          <Zap className="w-4 h-4" /> Khởi tạo ngay
        </Button>
      </div>
    </section>
  );
}
