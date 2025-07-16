package com.personalfinance.user.service;

import com.personalfinance.user.model.UserFinancialData;
import com.personalfinance.user.repository.UserFinancialDataRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserFinancialDataService {
    private final UserFinancialDataRepository repo;

    public UserFinancialDataService(UserFinancialDataRepository repo) {
        this.repo = repo;
    }

    public Optional<UserFinancialData> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public UserFinancialData saveOrUpdate(Long userId, String dataJson) {
        UserFinancialData entity = repo.findByUserId(userId)
            .orElse(new UserFinancialData(null, userId, dataJson, LocalDateTime.now()));
        entity.setData(dataJson);
        entity.setUpdatedAt(LocalDateTime.now());
        return repo.save(entity);
    }
}
