package com.personalfinance.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_financial_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFinancialData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "data", columnDefinition = "jsonb")
    private String data; // Store as JSON string

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
