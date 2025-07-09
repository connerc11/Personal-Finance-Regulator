package com.personalfinance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.personalfinance.transaction.model.Transaction;

public class TransactionUpdateRequest {

    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private Transaction.Category category;
    private LocalDateTime transactionDate;
    private String notes;
    private String location;
    private String merchant;

    // Getters and Setters
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
}
