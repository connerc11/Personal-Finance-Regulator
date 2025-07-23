package com.personalfinance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.personalfinance.transaction.model.Transaction;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class TransactionCreateRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private Transaction.TransactionType type;

    @NotNull
    private Transaction.Category category;

    private LocalDate transactionDate;
    private String notes;
    private String location;
    private String merchant;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Transaction.TransactionType getType() { return type; }
    public void setType(Transaction.TransactionType type) { this.type = type; }

    public Transaction.Category getCategory() { return category; }
    public void setCategory(Transaction.Category category) { this.category = category; }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
}
