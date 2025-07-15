package com.personalfinance.user.repository;

import com.personalfinance.user.model.SharedGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SharedGoalRepository extends JpaRepository<SharedGoal, Long> {
    
    List<SharedGoal> findByIsPublicTrueOrderByCreatedAtDesc();
    
    List<SharedGoal> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT sg FROM SharedGoal sg JOIN FETCH sg.user WHERE sg.isPublic = true ORDER BY sg.createdAt DESC")
    List<SharedGoal> findPublicGoalsWithUser();
    
    @Query("SELECT sg FROM SharedGoal sg WHERE sg.userId = :userId AND sg.goalId = :goalId")
    Optional<SharedGoal> findByUserIdAndGoalId(Long userId, Long goalId);
    
    List<SharedGoal> findByCategoryAndIsPublicTrueOrderByCreatedAtDesc(String category);
    
    @Query("SELECT sg FROM SharedGoal sg WHERE sg.isPublic = true AND LOWER(sg.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY sg.createdAt DESC")
    List<SharedGoal> findByTitleContainingIgnoreCaseAndIsPublicTrue(String searchTerm);
    
    @Query("SELECT COUNT(sg) FROM SharedGoal sg WHERE sg.userId = :userId")
    Long countByUserId(Long userId);
}
