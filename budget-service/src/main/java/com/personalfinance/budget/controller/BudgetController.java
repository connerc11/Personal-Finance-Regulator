package com.personalfinance.budget.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.personalfinance.budget.dto.BudgetCreateRequest;
import com.personalfinance.budget.dto.BudgetResponse;
import com.personalfinance.budget.dto.BudgetUpdateRequest;
import com.personalfinance.budget.service.BudgetService;

@RestController
@RequestMapping("/budgets")
public class BudgetController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BudgetController.class);

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@RequestBody BudgetCreateRequest request) {
        log.info("[BudgetController] Create budget request: {}", request);
        try {
            BudgetResponse budget = budgetService.createBudget(request);
            log.info("[BudgetController] Budget created: {}", budget);
            return ResponseEntity.status(HttpStatus.CREATED).body(budget);
        } catch (Exception e) {
            log.error("[BudgetController] Error creating budget: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets() {
        log.info("[BudgetController] Get all budgets request");
        try {
            List<BudgetResponse> budgets = budgetService.getAllBudgets();
            log.info("[BudgetController] Budgets returned: {}", budgets.size());
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            log.error("[BudgetController] Error getting all budgets: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByUser(@PathVariable Long userId) {
        log.info("[BudgetController] Get budgets by user request: userId={}", userId);
        try {
            List<BudgetResponse> budgets = budgetService.getBudgetsByUser(userId);
            log.info("[BudgetController] Budgets for user {} returned: {}", userId, budgets.size());
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            log.error("[BudgetController] Error getting budgets for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> getBudgetById(@PathVariable Long id) {
        log.info("[BudgetController] Get budget by id request: id={}", id);
        return budgetService.getBudgetById(id)
                .map(budget -> {
                    log.info("[BudgetController] Budget found: {}", budget);
                    return ResponseEntity.ok(budget);
                })
                .orElseGet(() -> {
                    log.warn("[BudgetController] Budget not found: id={}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @RequestBody BudgetUpdateRequest request) {
        log.info("[BudgetController] Update budget request: id={}, data={}", id, request);
        try {
            BudgetResponse budget = budgetService.updateBudget(id, request);
            log.info("[BudgetController] Budget updated: {}", budget);
            return ResponseEntity.ok(budget);
        } catch (RuntimeException e) {
            log.warn("[BudgetController] Budget not found for update: id={}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("[BudgetController] Error updating budget: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        log.info("[BudgetController] Delete budget request: id={}", id);
        try {
            budgetService.deleteBudget(id);
            log.info("[BudgetController] Budget deleted: id={}", id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.warn("[BudgetController] Budget not found for delete: id={}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("[BudgetController] Error deleting budget: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
