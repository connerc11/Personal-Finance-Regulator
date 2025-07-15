package com.personalfinance.user.dto;

public class ShareGoalRequest {
    private Long goalId;

    // Constructors
    public ShareGoalRequest() {}

    public ShareGoalRequest(Long goalId) {
        this.goalId = goalId;
    }

    // Getters and Setters
    public Long getGoalId() {
        return goalId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }
}
