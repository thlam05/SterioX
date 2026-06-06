'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls, { type HlsConfig } from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, Tv, Radio, Minimize2 } from 'lucide-react'; // Thêm VolumeX cho trực quan

interface StreamPlayerProps {
  src: string;
}

const config: Partial<HlsConfig> = {
  enableWorker: true,
  lowLatencyMode: true,
  maxBufferLength: 15,
};

export const CustomStreamPlayer = ({ src }: StreamPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = volume / 100;

    if (Hls.isSupported()) {
      const hls = new Hls(config);
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log(err));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) console.error(data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log(err));
      });
    }

    const handleNativePlay = () => setIsPlaying(true);
    const handleNativePause = () => setIsPlaying(false);
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    video.addEventListener('play', handleNativePlay);
    video.addEventListener('pause', handleNativePause);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener('play', handleNativePlay);
      video.removeEventListener('pause', handleNativePause);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => console.log(err));
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val / 100;
      const shouldMute = val === 0;
      videoRef.current.muted = shouldMute;
      setIsMuted(shouldMute);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Lỗi không thể bật Fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="relative group rounded-2xl bg-foreground overflow-hidden shadow-xl aspect-video w-full max-w-[1200px] mx-auto select-none font-sans">
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
      />

      <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
        <span className="bg-danger text-background text-xs font-black px-3 py-1 rounded-md flex items-center gap-1.5 shadow-md">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> Trực tiếp
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground via-foreground/75 to-transparent p-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">

        <div className="h-1 w-full bg-secondary/40 rounded-full overflow-hidden cursor-default">
          <div className="h-full w-full bg-primary rounded-full"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={togglePlay}
              className="text-background hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleMute}
                className="text-background hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-secondary" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1 bg-secondary/40 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button type="button" className="text-background hover:text-primary transition-colors focus:outline-none cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <button type="button" className="text-background hover:text-primary transition-colors focus:outline-none cursor-pointer">
              <Tv className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-background hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};