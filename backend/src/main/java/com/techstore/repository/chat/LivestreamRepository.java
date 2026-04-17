package com.techstore.repository.chat;

import com.techstore.entity.chat.Livestream;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivestreamRepository extends JpaRepository<Livestream, Long> {
    List<Livestream> findByStatus(Livestream.LivestreamStatus status);
    
    @Query("SELECT l FROM Livestream l WHERE l.status = 'LIVE' ORDER BY l.viewerCount DESC")
    List<Livestream> findPopularLiveStreams();
}
