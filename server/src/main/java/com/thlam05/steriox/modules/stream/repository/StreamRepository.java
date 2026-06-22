package com.thlam05.steriox.modules.stream.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thlam05.steriox.modules.stream.entity.Stream;

public interface StreamRepository extends JpaRepository<Stream, String> {
        @Query("""
                        SELECT s FROM streams s
                        WHERE s.user.id = :userId AND s.isActive = true
                        """)
        Optional<Stream> findStreamOnlineByUserId(@Param("userId") String userId);

        List<Stream> findTop10ByOnStreamTrueOrderByTotalLikesDesc();

        @Query("""
                        SELECT s FROM streams s
                        WHERE s.onStream = true
                        """)
        List<Stream> findAllStreamOnline();

        @Query("SELECT COUNT(s) > 0 FROM streams s JOIN s.usersLiked u WHERE s.id = :streamId AND u.id = :userId")
        boolean existsByStreamIdAndUserId(@Param("streamId") String streamId, @Param("userId") String userId);

        
}
