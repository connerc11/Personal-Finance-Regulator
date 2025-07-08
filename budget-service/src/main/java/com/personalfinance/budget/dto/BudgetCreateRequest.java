package com.personalfinance.budget.dto;

import com.personalfinance.budget.model.Budget;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BudgetCreateRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String name;

    @NotNull
    private Budget.Category category;

    @NotNull
    @Positive
    private BigDecimal budgetLimit;

    @NotNull
    private Budget.Period period;

    private String description;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Budget.Category getCategory() { return category; }
    public void setCategory(Budget.Category category) { this.category = category; }

    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public void setBudgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; }

    public Budget.Period getPeriod() { return period; }
    public void setPeriod(Budget.Period period) { this.period = period; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
