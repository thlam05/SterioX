package com.thlam05.steriox.modules.stream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thlam05.steriox.modules.stream.entity.StreamLike;
import com.thlam05.steriox.modules.stream.types.StreamLikeId;

public interface StreamLikeRepository extends JpaRepository<StreamLike, StreamLikeId> {
    @Query("SELECT COUNT(sl) > 0 FROM user_liked_stream sl WHERE sl.id.streamId = :streamId AND sl.id.userId = :userId")
    boolean existsByStreamIdAndUserId(@Param("streamId") String streamId, @Param("userId") String userId);

    @Modifying
    @Query("DELETE FROM user_liked_stream sl WHERE sl.id.streamId = :streamId AND sl.id.userId = :userId")
    void deleteByStreamIdAndUserId(@Param("streamId") String streamId, @Param("userId") String userId);
}
