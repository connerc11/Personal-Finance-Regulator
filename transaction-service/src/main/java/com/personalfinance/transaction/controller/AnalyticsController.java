package com.personalfinance.transaction.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.personalfinance.transaction.dto.TransactionResponse;
import com.personalfinance.transaction.model.Transaction;
import com.personalfinance.transaction.service.TransactionService;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/user/{userId}/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "6months") String timeRange) {
        
        Map<String, BigDecimal> summary = transactionService.getTransactionSummary(userId);
        Map<String, BigDecimal> categoryExpenses = transactionService.getCategoryExpenses(userId);
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        BigDecimal totalIncome = summary.get("totalIncome");
        BigDecimal totalExpenses = summary.get("totalExpenses");
        BigDecimal netSavings = summary.get("netSavings");
        
        // Handle null values
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        if (netSavings == null) netSavings = totalIncome.subtract(totalExpenses);
        
        dashboardData.put("totalIncome", totalIncome);
        dashboardData.put("totalExpenses", totalExpenses);
        dashboardData.put("netSavings", netSavings);
        
        String savingsRate = "0";
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.divide(totalIncome, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal("100")).toString();
        }
        dashboardData.put("savingsRate", savingsRate);
        
        // Add category breakdown for dashboard
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        
        for (Map.Entry<String, BigDecimal> entry : categoryExpenses.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("name", formatCategoryName(entry.getKey()));
            categoryData.put("value", entry.getValue());
            categoryData.put("amount", entry.getValue());
            
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal percentage = entry.getValue().divide(totalExpenses, 4, BigDecimal.ROUND_HALF_UP)
                        .multiply(new BigDecimal("100"));
                categoryData.put("percentage", percentage);
            } else {
                categoryData.put("percentage", BigDecimal.ZERO);
            }
            
            categoryData.put("color", getCategoryColor(entry.getKey()));
            categoryBreakdown.add(categoryData);
        }
        
        dashboardData.put("categoryBreakdown", categoryBreakdown);
        
        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/user/{userId}/monthly-trend")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTrend(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "6months") String timeRange) {
        
        // Get transactions for the last 6 months
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(6);
        
        List<TransactionResponse> transactions = transactionService.getTransactionsByDateRange(userId, startDate, endDate);
        
        // Group by month
        Map<YearMonth, Map<String, BigDecimal>> monthlyData = new HashMap<>();
        
        for (TransactionResponse transaction : transactions) {
            YearMonth month = YearMonth.from(transaction.getTransactionDate());
            
            monthlyData.putIfAbsent(month, new HashMap<>());
            Map<String, BigDecimal> monthData = monthlyData.get(month);
            
            if (Transaction.TransactionType.INCOME.equals(transaction.getType())) {
                monthData.put("income", monthData.getOrDefault("income", BigDecimal.ZERO).add(transaction.getAmount()));
            } else {
                monthData.put("expenses", monthData.getOrDefault("expenses", BigDecimal.ZERO).add(transaction.getAmount()));
            }
        }
        
        // Convert to frontend format
        List<Map<String, Object>> trendData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.from(endDate.minusMonths(i));
            Map<String, BigDecimal> data = monthlyData.getOrDefault(month, new HashMap<>());
            
            BigDecimal income = data.getOrDefault("income", BigDecimal.ZERO);
            BigDecimal expenses = data.getOrDefault("expenses", BigDecimal.ZERO);
            BigDecimal savings = income.subtract(expenses);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", month.format(formatter));
            monthData.put("income", income);
            monthData.put("expenses", expenses);
            monthData.put("savings", savings);
            
            trendData.add(monthData);
        }
        
        return ResponseEntity.ok(trendData);
    }

    @GetMapping("/user/{userId}/category-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getCategoryBreakdown(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "6months") String timeRange) {
        
        Map<String, BigDecimal> categoryExpenses = transactionService.getCategoryExpenses(userId);
        Map<String, BigDecimal> summary = transactionService.getTransactionSummary(userId);
        BigDecimal totalExpenses = summary.get("totalExpenses");
        
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        
        for (Map.Entry<String, BigDecimal> entry : categoryExpenses.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("name", formatCategoryName(entry.getKey()));
            categoryData.put("value", entry.getValue());
            categoryData.put("amount", entry.getValue());
            
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal percentage = entry.getValue().divide(totalExpenses, 4, BigDecimal.ROUND_HALF_UP)
                        .multiply(new BigDecimal("100"));
                categoryData.put("percentage", percentage);
            } else {
                categoryData.put("percentage", BigDecimal.ZERO);
            }
            
            categoryData.put("color", getCategoryColor(entry.getKey()));
            categoryBreakdown.add(categoryData);
        }
        
        return ResponseEntity.ok(categoryBreakdown);
    }

    @GetMapping("/user/{userId}/budget-performance")
    public ResponseEntity<List<Map<String, Object>>> getBudgetPerformance(@PathVariable Long userId) {
        // Mock budget performance data for now
        List<Map<String, Object>> budgetPerformance = new ArrayList<>();
        
        Map<String, Object> groceries = new HashMap<>();
        groceries.put("category", "Groceries");
        groceries.put("budgeted", 900);
        groceries.put("actual", 800);
        groceries.put("performance", 88.9);
        budgetPerformance.add(groceries);
        
        Map<String, Object> dining = new HashMap<>();
        dining.put("category", "Dining");
        dining.put("budgeted", 400);
        dining.put("actual", 450);
        dining.put("performance", 112.5);
        budgetPerformance.add(dining);
        
        Map<String, Object> transportation = new HashMap<>();
        transportation.put("category", "Transportation");
        transportation.put("budgeted", 350);
        transportation.put("actual", 300);
        transportation.put("performance", 85.7);
        budgetPerformance.add(transportation);
        
        Map<String, Object> entertainment = new HashMap<>();
        entertainment.put("category", "Entertainment");
        entertainment.put("budgeted", 250);
        entertainment.put("actual", 200);
        entertainment.put("performance", 80.0);
        budgetPerformance.add(entertainment);
        
        return ResponseEntity.ok(budgetPerformance);
    }

    private String formatCategoryName(String category) {
        String formatted = category.replace("_", " ").toLowerCase();
        // Capitalize first letter of each word
        String[] words = formatted.split(" ");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                result.append(Character.toUpperCase(word.charAt(0)))
                      .append(word.substring(1))
                      .append(" ");
            }
        }
        return result.toString().trim();
    }

    private String getCategoryColor(String category) {
        // Assign colors based on category
        switch (category.toUpperCase()) {
            case "GROCERIES": return "#8884d8";
            case "DINING": return "#82ca9d";
            case "TRANSPORTATION": return "#ffc658";
            case "UTILITIES": return "#ff7300";
            case "ENTERTAINMENT": return "#0088fe";
            case "SHOPPING": return "#00c49f";
            case "HEALTHCARE": return "#ffb347";
            case "EDUCATION": return "#d084d0";
            default: return "#87d068";
        }
    }
}
