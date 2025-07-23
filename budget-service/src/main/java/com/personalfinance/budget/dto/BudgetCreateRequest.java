package com.personalfinance.budget.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.personalfinance.budget.model.Budget.BudgetPeriod;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class BudgetCreateRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private BudgetPeriod period;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    // Constructors
    public BudgetCreateRequest() {}

    public BudgetCreateRequest(Long userId, String name, String category, BigDecimal amount,
                               BudgetPeriod period, LocalDate startDate, LocalDate endDate) {
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BudgetPeriod getPeriod() { return period; }
    public void setPeriod(BudgetPeriod period) { this.period = period; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
