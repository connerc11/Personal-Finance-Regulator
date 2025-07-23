package com.personalfinance.user.service;

import com.personalfinance.user.model.Goal;
import com.personalfinance.user.repository.GoalRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Optional<Goal> getGoalById(Long id) {
        return goalRepository.findById(id);
    }

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long id, Goal updatedGoal) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goal.setName(updatedGoal.getName());
                    goal.setTargetAmount(updatedGoal.getTargetAmount());
                    goal.setCurrentAmount(updatedGoal.getCurrentAmount());
                    goal.setDueDate(updatedGoal.getDueDate());
                    goal.setDescription(updatedGoal.getDescription());
                    goal.setPriority(updatedGoal.getPriority());
                    goal.setUpdatedAt(java.time.LocalDateTime.now());
                    return goalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
