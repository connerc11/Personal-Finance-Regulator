package com.personalfinance.budget.model;

public enum GoalCategory {
    EMERGENCY_FUND("Emergency Fund"),
    VACATION("Vacation"),
    CAR_PURCHASE("Car Purchase"),
    HOME_PURCHASE("Home Purchase"),
    EDUCATION("Education"),
    RETIREMENT("Retirement"),
    DEBT_PAYOFF("Debt Payoff"),
    INVESTMENT("Investment"),
    WEDDING("Wedding"),
    HOME_IMPROVEMENT("Home Improvement"),
    MEDICAL("Medical"),
    OTHER("Other");

    private final String displayName;

    GoalCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
