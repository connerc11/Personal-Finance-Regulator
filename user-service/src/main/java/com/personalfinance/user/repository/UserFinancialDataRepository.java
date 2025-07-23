package com.personalfinance.user.repository;

import com.personalfinance.user.model.UserFinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

public interface UserFinancialDataRepository extends JpaRepository<UserFinancialData, Long> {

    Optional<UserFinancialData> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_financial_data (user_id, data, updated_at) VALUES (:userId, CAST(:data AS jsonb), :updatedAt) ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at", nativeQuery = true)
    void upsertFinancialData(@Param("userId") Long userId, @Param("data") String data, @Param("updatedAt") LocalDateTime updatedAt);
}
