package com.thlam05.steriox.modules.stream.types;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamLikeId implements Serializable {
    @Column(name = "stream_id")
    private String streamId;

    @Column(name = "user_id")
    private String userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StreamLikeId that = (StreamLikeId) o;

        if (!streamId.equals(that.streamId)) return false;
        return userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        int result = streamId.hashCode();
        result = 31 * result + userId.hashCode();
        return result;
    }
}
