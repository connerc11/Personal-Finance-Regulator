package com.personalfinance.budget.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.personalfinance.budget.dto.BudgetCreateRequest;
import com.personalfinance.budget.dto.BudgetResponse;
import com.personalfinance.budget.dto.BudgetUpdateRequest;
import com.personalfinance.budget.model.Budget;
import com.personalfinance.budget.repository.BudgetRepository;

@Service
@Transactional
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public BudgetResponse createBudget(BudgetCreateRequest request) {
        Budget budget = new Budget();
        budget.setUserId(request.getUserId());
        budget.setName(request.getName());
        budget.setCategory(request.getCategory());
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());

        Budget savedBudget = budgetRepository.save(budget);
        return new BudgetResponse(savedBudget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsByUser(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return budgets.stream()
                .map(BudgetResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<BudgetResponse> getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .map(BudgetResponse::new);
    }

    public BudgetResponse updateBudget(Long id, BudgetUpdateRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        if (request.getName() != null) {
            budget.setName(request.getName());
        }
        if (request.getCategory() != null) {
            budget.setCategory(request.getCategory());
        }
        if (request.getAmount() != null) {
            budget.setAmount(request.getAmount());
        }
        if (request.getPeriod() != null) {
            budget.setPeriod(request.getPeriod());
        }
        if (request.getStartDate() != null) {
            budget.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            budget.setEndDate(request.getEndDate());
        }

        Budget savedBudget = budgetRepository.save(budget);
        return new BudgetResponse(savedBudget);
    }

    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        budgetRepository.deleteById(id);
    }
}
