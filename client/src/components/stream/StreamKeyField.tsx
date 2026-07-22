import { Input } from '@/components/ui/input';
import { Copy, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface StreamKeyFieldProps {
  streamUrl: string | null;
  streamKey: string | null;
  showStreamKey: boolean;
  copied: 'streamUrl' | 'streamKey' | null;
  onToggleShowKey: () => void;
  onCopyUrl: () => void;
  onCopyKey: () => void;
}

export function StreamKeyField({
  streamUrl,
  streamKey,
  showStreamKey,
  copied,
  onToggleShowKey,
  onCopyUrl,
  onCopyKey,
}: StreamKeyFieldProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
          Stream URL
        </label>
        <div className="relative group">
          <Input
            readOnly
            value={streamUrl ?? ''}
            className="bg-accent font-mono text-[11px] pr-10 border-accent"
          />
          <button
            type="button"
            onClick={onCopyUrl}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
          >
            {copied === 'streamUrl' ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-end">
          <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
            Stream Key
          </label>
          <span className="text-[9px] font-bold text-danger flex items-center gap-1 bg-selection px-1.5 py-0.5 rounded uppercase">
            <AlertCircle className="w-3 h-3" /> Bảo mật
          </span>
        </div>
        <div className="relative group">
          <Input
            type={showStreamKey ? 'text' : 'password'}
            readOnly
            value={streamKey ?? ''}
            className="bg-accent font-mono text-[11px] pr-20 tracking-widest border-accent"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={onToggleShowKey}
              className="p-1.5 text-secondary hover:text-foreground"
            >
              {showStreamKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onCopyKey}
              className="p-1.5 text-secondary hover:text-foreground"
            >
              {copied === 'streamKey' ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
