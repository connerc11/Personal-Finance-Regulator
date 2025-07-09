package com.personalfinance.transaction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.personalfinance.transaction.dto.TransactionCreateRequest;
import com.personalfinance.transaction.dto.TransactionResponse;
import com.personalfinance.transaction.dto.TransactionUpdateRequest;
import com.personalfinance.transaction.model.Transaction;
import com.personalfinance.transaction.repository.TransactionRepository;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public TransactionResponse createTransaction(TransactionCreateRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setTransactionDate(request.getTransactionDate() != null ? 
            request.getTransactionDate() : LocalDateTime.now());
        transaction.setNotes(request.getNotes());
        transaction.setLocation(request.getLocation());
        transaction.setMerchant(request.getMerchant());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return new TransactionResponse(savedTransaction);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsByUser(Long userId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId, pageable);
        return transactions.map(TransactionResponse::new);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return new TransactionResponse(transaction);
    }

    public TransactionResponse updateTransaction(Long id, TransactionUpdateRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
        }
        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }
        if (request.getType() != null) {
            transaction.setType(request.getType());
        }
        if (request.getCategory() != null) {
            transaction.setCategory(request.getCategory());
        }
        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate());
        }
        if (request.getNotes() != null) {
            transaction.setNotes(request.getNotes());
        }
        if (request.getLocation() != null) {
            transaction.setLocation(request.getLocation());
        }
        if (request.getMerchant() != null) {
            transaction.setMerchant(request.getMerchant());
        }

        Transaction updatedTransaction = transactionRepository.save(transaction);
        return new TransactionResponse(updatedTransaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getTransactionSummary(Long userId) {
        BigDecimal totalIncome = transactionRepository.getTotalAmountByUserIdAndType(
                userId, Transaction.TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.getTotalAmountByUserIdAndType(
                userId, Transaction.TransactionType.EXPENSE);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        summary.put("totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
        summary.put("netBalance", 
                summary.get("totalIncome").subtract(summary.get("totalExpenses")));

        return summary;
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCategoryExpenses(Long userId) {
        List<Object[]> results = transactionRepository.getExpensesByCategory(userId);
        Map<String, BigDecimal> categoryExpenses = new HashMap<>();

        for (Object[] result : results) {
            Transaction.Category category = (Transaction.Category) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            categoryExpenses.put(category.name(), amount);
        }

        return categoryExpenses;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                userId, startDate, endDate);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
}
