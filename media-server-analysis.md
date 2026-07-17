# SterioX - RTMP to HLS Streaming Pipeline Analysis

## 1. Architecture Overview

```
[OBS/Broadcaster] --RTMP--> [NGINX-RTMP Server] --HLS--> [React Client (hls.js)]
                                port:1935              port:5555
```

SterioX implements a **livestreaming platform** using the classic RTMP ingestion + HLS delivery pattern. The pipeline has three tiers:

| Layer | Technology | Role |
|-------|-----------|------|
| **Ingestion** | NGINX + RTMP module (Docker) | Receives RTMP from OBS, transmuxes to HLS |
| **Delivery** | NGINX HTTP server (same container) | Serves .m3u8 playlists and .ts segments over HTTP with CORS |
| **Playback** | hls.js on React frontend | Downloads and plays HLS stream in browser `<video>` |

---

## 2. Media Server (NGINX-RTMP)

### Docker Setup (`media-server/docker-compose.yml`)

- **Image**: `tiangolo/nginx-rtmp:latest` — a pre-built NGINX with RTMP module
- **Ports**:
  - `1935:1935` — RTMP ingest (OBS pushes here)
  - `5555:80` — HTTP serving HLS (browser fetches from here)
- **Volume**: mounts custom `nginx.conf` (read-only)

### NGINX Configuration (`nginx.conf`)

Two main blocks:

#### RTMP Block (Ingestion)

```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        allow publish all;

        application hls {
            live on;
            record off;
            hls on;
            hls_path /tmp/hls;
            hls_fragment 5;
        }
    }
}
```

- **`application hls`**: defines an RTMP app endpoint at `rtmp://<host>/hls`
- **`live on`**: enables live streaming mode
- **`record off`**: no recording to disk
- **`hls on`**: enables HLS packaging
- **`hls_path /tmp/hls`**: output directory for `.m3u8` + `.ts` files
- **`hls_fragment 5`**: each segment is 5 seconds (influences latency)

The **RTMP module acts as a transmuxer** — it takes the incoming RTMP stream (usually FLV container with H.264/AAC) and converts it on-the-fly to the HLS format (MPEG-TS segments + m3u8 playlist). No re-encoding (transcoding) happens unless configured — this is **transmuxing** (container format change, same codec).

#### HTTP Block (Delivery)

```nginx
http {
    server {
        listen 80;

        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /tmp;

            add_header Access-Control-Allow-Origin "http://localhost:5173" always;
            add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
            add_header Access-Control-Allow-Headers "*" always;

            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }
    }
}
```

- Serves static files from `/tmp/hls` (the HLS output directory)
- Manually defines MIME types for `.m3u8` and `.ts`
- **CORS headers** specifically allow the Vite dev server at `localhost:5173`
- Handles `OPTIONS` preflight with 204 (no content)

---

## 3. HLS Protocol Basics (for interview)

**HLS (HTTP Live Streaming)** is Apple's adaptive streaming protocol:

1. **Live stream is split into small chunks** (`.ts` files — MPEG Transport Stream)
2. A **playlist file** (`.m3u8`) lists available segments and their URLs
3. The **client (hls.js)** repeatedly fetches the m3u8, discovers new segments, and appends them to the media buffer

The 5-second fragment means:
- Minimum end-to-end latency: ~5-10 seconds (fragment + playlist refresh + buffering)
- Trade-off: shorter fragments = lower latency but more HTTP requests and more files on disk

---

## 4. Backend Orchestration (Spring Boot)

### StreamKeyService (`StreamKeyService.java`)

```java
private String generateStreamUrl(String streamKey) {
    return "rtmp://localhost:1935/hls";
}
```

Returns the **RTMP ingest URL**. The stream key (UUID) is appended by OBS as the path: `rtmp://localhost:1935/hls/<stream-key>`.

### StreamService (`StreamService.java`)

```java
private String generatePlayUrl(StreamKey streamKey) {
    String playUrl = "http://localhost:5555/hls/" + streamKey.getStreamKey() + ".m3u8";
    return playUrl;
}
```

Generates the **HLS playback URL** that the browser will consume.

### Entity Design

| Entity | Key Fields |
|--------|-----------|
| **Stream** | id (UUID), userId, title, playUrl, isActive, onStream, thumbnail, totalViews, totalLikes |
| **StreamKey** | streamKey (UUID PK), userId, streamUrl (`rtmp://localhost:1935/hls`) |

- `Stream.onStream` tracks whether the broadcaster is actively streaming
- `Stream.isActive` presumably tracks if the stream is published (has viewers)

---

## 5. Client-Side Player (`CustomStreamPlayer.tsx`)

### hls.js Integration

```typescript
import Hls, { type HlsConfig } from 'hls.js';

const config: Partial<HlsConfig> = {
    enableWorker: true,     // Offloads TS parsing to a Web Worker — avoids blocking UI
    lowLatencyMode: true,   // Enables LL-HLS (partial segments, delta playlists)
    maxBufferLength: 15,    // Max seconds of buffered data — balance between smoothness & latency
};
```

### Initialization Flow

```typescript
if (Hls.isSupported()) {
    const hls = new Hls(config);
    hls.loadSource(src);       // src = "http://localhost:5555/hls/<key>.m3u8"
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
    });
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Fallback for native Safari HLS support
    video.src = src;
}
```

**hls.js**:
1. Fetches the `.m3u8` manifest
2. Parses the segment list
3. Downloads `.ts` segments via HTTP (with range requests)
4. Demuxes (extracts video/audio tracks from the TS container)
5. Appends to `SourceBuffer` via **MSE (Media Source Extensions)** API
6. The `<video>` element renders the decoded frames

### Live Edge Detection

```typescript
const checkLiveStatus = () => {
    let currentLivePosition = video.duration;

    if (hlsRef.current && hlsRef.current.liveSyncPosition) {
        currentLivePosition = hlsRef.current.liveSyncPosition;
    } else if (video.seekable && video.seekable.length > 0) {
        currentLivePosition = video.seekable.end(video.seekable.length - 1);
    }

    if (currentLivePosition - video.currentTime > 2) {
        setIsAtLiveEdge(false);  // Viewer is behind
    } else {
        setIsAtLiveEdge(true);
    }
};
```

- Maintains a "Live" badge in the top-left
- If the viewer falls more than 2 seconds behind the live edge, the badge changes to allow a "jump to live" action
- `jumpToLiveEdge()` seeks to `hlsRef.current.liveSyncPosition` or `seekable.end()`

### Player Features

| Feature | Implementation |
|---------|---------------|
| Play/Pause | Toggle on `<video>` click + button |
| Mute/Volume | Range slider + mute button, maps to `video.muted` / `video.volume` |
| Fullscreen | `containerRef.requestFullscreen()` / `document.exitFullscreen()` |
| Live indicator | Shows `isAtLiveEdge` state with animated pulse when live |
| Jump to Live | Seeks to live edge position from hls.js or `seekable.end()` |

### Cleanup

```typescript
return () => {
    if (hlsRef.current) hlsRef.current.destroy();
    video.removeEventListener('play', handleNativePlay);
    video.removeEventListener('pause', handleNativePause);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    video.removeEventListener('timeupdate', checkLiveStatus);
};
```

Properly destroys the hls.js instance and removes event listeners on unmount.

---

## 6. End-to-End Data Flow

```
[Streamer opens OBS]
    |
    | Enters: rtmp://localhost:1935/hls/<stream-key>
    | (stream-key obtained from POST /api/stream-keys)
    v
[OBS sends RTMP stream] -----> [NGINX-RTMP :1935]
                                   |
                                   | RTMP module transmuxes FLV -> MPEG-TS
                                   | Writes segments to /tmp/hls/<stream-key>.m3u8
                                   v
                              [NGINX HTTP :80 -> :5555]
                                   |
                                   | Serves .m3u8 + .ts on GET /hls/
                                   v
[hls.js on React client] ---> [http://localhost:5555/hls/<stream-key>.m3u8]
    |
    | Parses m3u8 playlist
    | Downloads .ts segments
    | Feeds to MSE SourceBuffer
    v
[<video> element renders stream]
```

---

## 7. Key Technical Decisions (why this architecture?)

### Why NGINX-RTMP for HLS packaging?

- **No custom ffmpeg needed** — the NGINX RTMP module handles transmuxing internally
- **Single Docker container** — lightweight, easy to deploy
- **Proven in production** — NGINX-RTMP is widely adopted for live streaming
- **Limitation**: pure HLS, no adaptive bitrate ladder (ABR). For ABR, you'd need ffmpeg to produce multiple renditions, which would require a more complex setup

### Why hls.js instead of native `<video>` HLS?

- **Cross-browser support** — Safari has native HLS, but Chrome/Firefox don't
- **hls.js** implements HLS via **MSE (Media Source Extensions)** + **EME (Encrypted Media Extensions)** if needed
- **Low-latency HLS support** — `lowLatencyMode: true` enables partial segments and delta playlists

### Why 5-second fragments?

- Standard trade-off: lower latency vs. more disk I/O and HTTP requests
- 5s is a common default — provides ~10-15s end-to-end latency
- For sub-3s latency, you'd need LL-HLS (low-latency HLS) with partial segments and HTTP/2 server push

---

## 8. Potential Interview Discussion Points

| Topic | Talking Points |
|-------|---------------|
| **RTMP vs HLS vs WebRTC** | RTMP for ingest (low-latency push), HLS for delivery (widely compatible, HTTP-based, passes through CDNs easily). WebRTC would give sub-second latency but is more complex |
| **Transmuxing vs Transcoding** | This system only transmuxes (changes container format). Transcoding (re-encoding codec/resolution) would require ffmpeg and is CPU-intensive |
| **Scalability** | Single NGINX instance works for small scale. For production, you'd use a CDN like Cloudflare Stream, Mux, or Wowza for edge delivery |
| **HLS Latency** | Standard HLS: 10-30s. LL-HLS (partial segments): 3-6s. This project uses lowLatencyMode in hls.js |
| **MSE API** | hls.js uses Media Source Extensions to feed demuxed segments to `<video>`. Without MSE, browsers can only play formats they natively support |
| **Live Edge Sync** | The player detects how far behind the live edge the viewer is and offers a "Jump to Live" button |
| **Security** | Stream keys are UUIDs (hard to guess). No authentication on RTMP push or HLS fetch in this setup — in production you'd add signed URLs or token auth |
| **Alternative: WebRTC** | For lower latency, WebRTC with a media server (like Janus, MediaSoup, LiveKit) could replace HLS entirely, but adds complexity (WebSocket signaling, TURN servers) |
