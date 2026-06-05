'use client';

import '@videojs/react/video/skin.css';
import { createPlayer, liveVideoFeatures } from '@videojs/react';
import { LiveVideoSkin, Video } from '@videojs/react/live-video';

const Player = createPlayer({ features: liveVideoFeatures });

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  return (
    <Player.Provider>
      <LiveVideoSkin>
        <Video src={src} playsInline />
      </LiveVideoSkin>
    </Player.Provider>
  );
};