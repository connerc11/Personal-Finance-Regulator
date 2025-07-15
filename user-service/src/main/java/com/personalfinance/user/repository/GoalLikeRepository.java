package com.personalfinance.user.repository;

import com.personalfinance.user.model.GoalLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalLikeRepository extends JpaRepository<GoalLike, Long> {
    
    Optional<GoalLike> findByGoalIdAndUserId(Long goalId, Long userId);
    
    List<GoalLike> findByGoalIdOrderByCreatedAtDesc(Long goalId);
    
    List<GoalLike> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT COUNT(gl) FROM GoalLike gl WHERE gl.goalId = :goalId")
    Long countByGoalId(Long goalId);
    
    @Query("SELECT CASE WHEN COUNT(gl) > 0 THEN true ELSE false END FROM GoalLike gl WHERE gl.goalId = :goalId AND gl.userId = :userId")
    Boolean existsByGoalIdAndUserId(Long goalId, Long userId);
    
    void deleteByGoalId(Long goalId);
    
    void deleteByGoalIdAndUserId(Long goalId, Long userId);
}
