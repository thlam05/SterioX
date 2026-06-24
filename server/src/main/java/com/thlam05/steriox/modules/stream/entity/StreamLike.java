package com.thlam05.steriox.modules.stream.entity;

import com.thlam05.steriox.common.model.BaseModel;
import com.thlam05.steriox.modules.stream.types.StreamLikeId;
import com.thlam05.steriox.modules.user.entity.User;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity(name = "user_liked_stream")
@Table(name = "user_liked_stream")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamLike extends BaseModel {
    @EmbeddedId
    StreamLikeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("streamId")
    @JoinColumn(name = "stream_id")
    private Stream stream;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
}
