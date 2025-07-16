package com.personalfinance.user.controller;

import com.personalfinance.user.model.Goal;
import com.personalfinance.user.service.GoalService;
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
        return goalService.createGoal(goal);
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
