package com.personalfinance.user.service;

import com.personalfinance.user.model.UserFinancialData;
import com.personalfinance.user.repository.UserFinancialDataRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserFinancialDataService {
    private final UserFinancialDataRepository repo;
    private static final Logger logger = LoggerFactory.getLogger(UserFinancialDataService.class);

    public UserFinancialDataService(UserFinancialDataRepository repo) {
        this.repo = repo;
    }

    public Optional<UserFinancialData> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public void saveOrUpdate(Long userId, com.fasterxml.jackson.databind.JsonNode dataNode) {
        String json = dataNode.toString();
        LocalDateTime now = LocalDateTime.now();
        logger.info("Calling upsertFinancialData with userId={}, updatedAt={}, dataNode={}", userId, now, json);
        try {
            repo.upsertFinancialData(userId, json, now);
            logger.info("upsertFinancialData executed successfully for userId={}", userId);
        } catch (Exception e) {
            logger.error("Error executing upsertFinancialData for userId={}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }
}
