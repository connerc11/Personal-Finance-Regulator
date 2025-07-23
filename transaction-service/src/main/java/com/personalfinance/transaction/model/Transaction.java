package com.personalfinance.transaction.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotBlank
    @Column(length = 100)
    private String description;

    @NotNull
    @Positive
    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Category category;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(length = 500)
    private String notes;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String merchant;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public Transaction() {}

    public Transaction(Long userId, String description, BigDecimal amount, TransactionType type, Category category) {
        this.userId = userId;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.transactionDate = LocalDate.now();
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

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum TransactionType {
        INCOME, EXPENSE
    }

    public enum Category {
        // Income Categories
        SALARY, BONUS, INVESTMENT, BUSINESS, OTHER_INCOME,
        
        // Expense Categories
        GROCERIES, DINING, TRANSPORTATION, UTILITIES, RENT, 
        ENTERTAINMENT, HEALTHCARE, SHOPPING, EDUCATION, 
        TRAVEL, INSURANCE, CHARITY, OTHER_EXPENSE
    }
}
