package com.personalfinance.budget.controller;

import com.personalfinance.budget.dto.BudgetCreateRequest;
import com.personalfinance.budget.dto.BudgetResponse;
import com.personalfinance.budget.dto.BudgetUpdateRequest;
import com.personalfinance.budget.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/budgets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetCreateRequest request) {
        BudgetResponse budget = budgetService.createBudget(request);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByUser(@PathVariable Long userId) {
        List<BudgetResponse> budgets = budgetService.getBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<BudgetResponse>> getActiveBudgetsByUser(@PathVariable Long userId) {
        List<BudgetResponse> budgets = budgetService.getActiveBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> getBudget(@PathVariable Long id) {
        BudgetResponse budget = budgetService.getBudgetById(id);
        return ResponseEntity.ok(budget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long id, @Valid @RequestBody BudgetUpdateRequest request) {
        BudgetResponse budget = budgetService.updateBudget(id, request);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/add-expense")
    public ResponseEntity<BudgetResponse> addExpenseToBudget(
            @PathVariable Long id, @RequestParam BigDecimal amount) {
        BudgetResponse budget = budgetService.addExpenseToBudget(id, amount);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<List<BudgetResponse>> getBudgetSummary(@PathVariable Long userId) {
        List<BudgetResponse> summary = budgetService.getBudgetSummaryByUser(userId);
        return ResponseEntity.ok(summary);
    }
}
