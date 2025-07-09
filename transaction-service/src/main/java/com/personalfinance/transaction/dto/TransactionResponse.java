package com.personalfinance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.personalfinance.transaction.model.Transaction;

public class TransactionResponse {

    private Long id;
    private Long userId;
    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Transaction.Category category;
    private LocalDateTime transactionDate;
    private String notes;
    private String location;
    private String merchant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public TransactionResponse() {}

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.userId = transaction.getUserId();
        this.description = transaction.getDescription();
        this.amount = transaction.getAmount();
        this.type = transaction.getType();
        this.category = transaction.getCategory();
        this.transactionDate = transaction.getTransactionDate();
        this.notes = transaction.getNotes();
        this.location = transaction.getLocation();
        this.merchant = transaction.getMerchant();
        this.createdAt = transaction.getCreatedAt();
        this.updatedAt = transaction.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
