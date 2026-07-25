import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StreamKeyField } from '@/components/stream/StreamKeyField';
import { Sliders, Power, AlertTriangle, Share2 } from 'lucide-react';

type StreamControlsProps = {
  streamUrl: string | null;
  streamKey: string | null;
  showStreamKey: boolean;
  copied: 'streamUrl' | 'streamKey' | null;
  streamTitle: string;
  onStreamTitleChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  enableOnStream: boolean;
  onToggleShowKey: () => void;
  onCopyUrl: () => void;
  onCopyKey: () => void;
  onOnStream: () => void;
};

export function StreamControls({
  streamUrl,
  streamKey,
  showStreamKey,
  copied,
  streamTitle,
  onStreamTitleChange,
  category,
  onCategoryChange,
  enableOnStream,
  onToggleShowKey,
  onCopyUrl,
  onCopyKey,
  onOnStream,
}: StreamControlsProps) {
  return (
    <div className="bg-background border border-accent p-6 rounded-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-black tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary" /> Công cụ thao tác nhanh
        </h3>
        <div className="flex gap-2">
          <Button
            variant="primary"
            disabled={!enableOnStream}
            className="text-xs font-bold flex items-center gap-1.5 text-danger border-accent"
            onClick={onOnStream}
          >
            <Power className="w-3.5 h-3.5" /> On stream
          </Button>
          <Button
            variant="outline"
            className="text-xs font-bold flex items-center gap-1.5 text-danger border-accent"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Báo cáo sự cố
          </Button>
          <Button
            variant="outline"
            className="text-xs font-bold flex items-center gap-1.5 border-accent"
          >
            <Share2 className="w-3.5 h-3.5" /> Chia sẻ luồng
          </Button>
        </div>
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

      <div className="border-t border-accent pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
            Tiêu đề buổi phát sóngs
          </label>
          <Input
            type="text"
            value={streamTitle}
            onChange={(e) => onStreamTitleChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
            Chuyên mục hiển thị
          </label>
          <Input
            type="text"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
