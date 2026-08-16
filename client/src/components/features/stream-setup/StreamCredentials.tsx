"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertCircle, Check, Copy, Eye, EyeOff, Radio } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/features/stream-setup/useCopyToClipboard";

interface StreamCredentialsProps {
  streamUrl: string;
  streamKey: string;
}

export default function StreamCredentials({
  streamUrl,
  streamKey,
}: StreamCredentialsProps) {
  const [showStreamKey, setShowStreamKey] = useState(false);
  const { isCopied: isUrlCopied, copy: copyUrl } = useCopyToClipboard();
  const { isCopied: isKeyCopied, copy: copyKey } = useCopyToClipboard();

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-accent/60 p-5 shadow-xl shadow-foreground/5">
      <div className="flex items-center justify-between">
        <div><h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
          <Radio className="w-4 h-4 text-primary" />
          Broadcast source
        </h3><p className="mt-1 text-xs text-secondary">Connect OBS, Prism, or another RTMP source.</p></div>
        <span className="text-xs text-secondary flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-warning" /> Never share your
          live stream key
        </span>
      </div>

      {/* Server URL */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-secondary">
          Stream URL
        </label>
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input
              readOnly
              value={streamUrl}
              className="w-full font-mono text-xs bg-accent border-border"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => copyUrl(streamUrl)}
            className="shrink-0 border-border text-foreground hover:bg-accent"
          >
            {isUrlCopied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stream Key */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-secondary">
          Stream Key
        </label>
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input
              type={showStreamKey ? "text" : "password"}
              readOnly
              value={streamKey}
              className="w-full font-mono text-xs bg-accent border-border"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowStreamKey(!showStreamKey)}
            className="shrink-0 border-border text-foreground hover:bg-accent"
          >
            {showStreamKey ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => copyKey(streamKey)}
            className="shrink-0 border-border text-foreground hover:bg-accent"
          >
            {isKeyCopied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
