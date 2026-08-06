import { useCallback, useEffect, useRef, useState } from "react";

interface UseCopyToClipboardOptions {
  resetDelay?: number;
}

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copy: (text: string) => Promise<boolean>;
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { resetDelay = 2000 } = options;
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.error("Clipboard API không được hỗ trợ trên trình duyệt này.");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetDelay);

        return true;
      } catch (err) {
        console.error("Không thể sao chép vào clipboard:", err);
        return false;
      }
    },
    [resetDelay],
  );

  return { isCopied, copy };
}
