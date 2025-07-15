package com.personalfinance.user.repository;

import com.personalfinance.user.model.GoalComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalCommentRepository extends JpaRepository<GoalComment, Long> {
    
    List<GoalComment> findByGoalIdOrderByTimestampAsc(Long goalId);
    
    @Query("SELECT gc FROM GoalComment gc JOIN FETCH gc.user WHERE gc.goalId = :goalId ORDER BY gc.timestamp ASC")
    List<GoalComment> findByGoalIdWithUserOrderByTimestampAsc(Long goalId);
    
    List<GoalComment> findByUserIdOrderByTimestampDesc(Long userId);
    
    @Query("SELECT COUNT(gc) FROM GoalComment gc WHERE gc.goalId = :goalId")
    Long countByGoalId(Long goalId);
    
    void deleteByGoalId(Long goalId);
}
