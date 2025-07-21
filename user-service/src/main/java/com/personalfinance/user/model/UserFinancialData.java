package com.personalfinance.user.model;

import jakarta.persistence.*;
// import lombok.*; // Removed Lombok, using explicit constructors/getters/setters
import java.time.LocalDateTime;

@Entity
@Table(name = "user_financial_data")
// Removed Lombok annotations; explicit constructors/getters/setters are used
public class UserFinancialData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "data", columnDefinition = "jsonb")
    @Convert(converter = com.personalfinance.user.util.JsonNodeConverter.class)
    private com.fasterxml.jackson.databind.JsonNode data;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserFinancialData() {}

    public UserFinancialData(Long id, Long userId, com.fasterxml.jackson.databind.JsonNode data, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.data = data;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public com.fasterxml.jackson.databind.JsonNode getData() { return data; }
    public void setData(com.fasterxml.jackson.databind.JsonNode data) { this.data = data; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
