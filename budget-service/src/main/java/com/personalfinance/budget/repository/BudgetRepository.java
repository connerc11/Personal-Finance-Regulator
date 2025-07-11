package com.personalfinance.budget.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.personalfinance.budget.model.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Budget> findByUserIdAndCategory(Long userId, String category);
}
