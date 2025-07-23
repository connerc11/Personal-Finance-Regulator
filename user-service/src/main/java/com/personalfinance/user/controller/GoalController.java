package com.personalfinance.user.controller;

import com.personalfinance.user.model.Goal;
import com.personalfinance.user.service.GoalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.personalfinance.user.security.UserDetailsImpl;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;
    private static final Logger logger = LoggerFactory.getLogger(GoalController.class);

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails instanceof UserDetailsImpl) {
            goal.setUserId(((UserDetailsImpl) userDetails).getId());
        }
        logger.info("[GoalController] Received createGoal request: name={}, dueDate={}, targetAmount={}, currentAmount={}", goal.getName(), goal.getDueDate(), goal.getTargetAmount(), goal.getCurrentAmount());
        Goal savedGoal = goalService.createGoal(goal);
        logger.info("[GoalController] Saved Goal: id={}, name={}, dueDate={}, createdAt={}, updatedAt={}", savedGoal.getId(), savedGoal.getName(), savedGoal.getDueDate(), savedGoal.getCreatedAt(), savedGoal.getUpdatedAt());
        return savedGoal;
    }

    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal goal) {
        return goalService.updateGoal(id, goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }
}
