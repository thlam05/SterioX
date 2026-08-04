import { useState } from "react";

export interface StreamStats {
  viewerCount: number;
  likeCount: number; 
}

interface UseStreamStatsProps {
  streamId: string;
  initialStats?: Partial<StreamStats>;
  isLive?: boolean;
}

export function useStreamStats({
  streamId,
  initialStats,
  isLive = true,
}: UseStreamStatsProps) {
    const [viewerCount, setViewerCount] = useState<number>(initialStats?.likeCount || 0);
    const [likeCount, setLikeCount] = useState<number>(initialStats?.viewerCount || 0);
}