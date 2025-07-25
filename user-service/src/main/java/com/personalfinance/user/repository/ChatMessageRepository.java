package com.personalfinance.user.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.personalfinance.user.model.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByRoomIdOrderByTimestampDesc(Long roomId, Pageable pageable);
    
    List<ChatMessage> findByRoomIdOrderByTimestampAsc(Long roomId);
    
    @Query("SELECT cm FROM ChatMessage cm JOIN FETCH cm.user WHERE cm.roomId = :roomId ORDER BY cm.timestamp ASC")
    List<ChatMessage> findByRoomIdWithUserOrderByTimestampAsc(Long roomId);
    
    @Query(
        value = "SELECT cm FROM ChatMessage cm JOIN FETCH cm.user WHERE cm.roomId = :roomId ORDER BY cm.timestamp DESC",
        countQuery = "SELECT count(cm) FROM ChatMessage cm WHERE cm.roomId = :roomId"
    )
    Page<ChatMessage> findByRoomIdWithUserOrderByTimestampDesc(Long roomId, Pageable pageable);
    
    List<ChatMessage> findByUserIdOrderByTimestampDesc(Long userId);
    
    void deleteByRoomId(Long roomId);
}
