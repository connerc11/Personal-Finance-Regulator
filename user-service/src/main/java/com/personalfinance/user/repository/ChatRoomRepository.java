package com.personalfinance.user.repository;

import com.personalfinance.user.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    List<ChatRoom> findByIsPublicTrueOrderByLastActivityDesc();
    
    List<ChatRoom> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.isPublic = true OR cr.createdBy = :userId ORDER BY cr.lastActivity DESC")
    List<ChatRoom> findAccessibleRooms(Long userId);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE LOWER(cr.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND cr.isPublic = true")
    List<ChatRoom> findByNameContainingIgnoreCaseAndIsPublicTrue(String searchTerm);
}
