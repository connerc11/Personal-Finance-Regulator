package com.personalfinance.user.repository;

import com.personalfinance.user.model.UserFinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserFinancialDataRepository extends JpaRepository<UserFinancialData, Long> {
    Optional<UserFinancialData> findByUserId(Long userId);
}
