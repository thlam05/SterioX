CREATE TABLE IF NOT EXISTS streams (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', 
    playback_url TEXT, 
    current_viewers INT DEFAULT 0,
    max_viewers INT DEFAULT 0,
    total_likes INT DEFAULT 0,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stream_keys (
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    stream_key VARCHAR(255) UNIQUE NOT NULL, 
    stream_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_streams_host_id ON streams(host_id);
CREATE INDEX IF NOT EXISTS idx_streams_status_created_at ON streams(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stream_tags_stream_id ON stream_tags(stream_id);
