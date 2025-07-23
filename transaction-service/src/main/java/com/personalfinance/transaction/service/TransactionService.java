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
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    public TransactionResponse createTransaction(TransactionCreateRequest request) {
        logger.debug("[createTransaction] Incoming request: {}", request);
        try {
            Transaction transaction = new Transaction();
            transaction.setUserId(request.getUserId());
            transaction.setDescription(request.getDescription());
            transaction.setAmount(request.getAmount());
            transaction.setType(request.getType());
            transaction.setCategory(request.getCategory());
            transaction.setTransactionDate(request.getTransactionDate() != null ? 
                request.getTransactionDate() : java.time.LocalDate.now());
            transaction.setNotes(request.getNotes());
            transaction.setLocation(request.getLocation());
            transaction.setMerchant(request.getMerchant());

            logger.debug("[createTransaction] Saving transaction: {}", transaction);
            Transaction savedTransaction = transactionRepository.save(transaction);
            logger.info("[createTransaction] Transaction saved: id={}, userId={}, amount={}, type={}, category={}",
                savedTransaction.getId(), savedTransaction.getUserId(), savedTransaction.getAmount(), savedTransaction.getType(), savedTransaction.getCategory());
            return new TransactionResponse(savedTransaction);
        } catch (Exception e) {
            logger.error("[createTransaction] Error creating transaction: {}", e.getMessage(), e);
            if (e.getCause() != null) {
                logger.error("[createTransaction] Root cause: {}", e.getCause().getMessage(), e.getCause());
            }
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsByUser(Long userId, Pageable pageable) {
        logger.debug("[getTransactionsByUser] userId={}, page={}, size={}", userId, pageable.getPageNumber(), pageable.getPageSize());
        try {
            Page<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId, pageable);
            logger.info("[getTransactionsByUser] Fetched {} transactions for userId={}", transactions.getTotalElements(), userId);
            return transactions.map(TransactionResponse::new);
        } catch (Exception e) {
            logger.error("[getTransactionsByUser] Error fetching transactions: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        logger.debug("[getTransactionById] id={}", id);
        try {
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
            logger.info("[getTransactionById] Found transaction: {}", transaction);
            return new TransactionResponse(transaction);
        } catch (Exception e) {
            logger.error("[getTransactionById] Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    public TransactionResponse updateTransaction(Long id, TransactionUpdateRequest request) {
        logger.debug("[updateTransaction] id={}, request={}", id, request);
        try {
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

            logger.debug("[updateTransaction] Saving updated transaction: {}", transaction);
            Transaction updatedTransaction = transactionRepository.save(transaction);
            logger.info("[updateTransaction] Transaction updated: id={}, userId={}, amount={}, type={}, category={}",
                updatedTransaction.getId(), updatedTransaction.getUserId(), updatedTransaction.getAmount(), updatedTransaction.getType(), updatedTransaction.getCategory());
            return new TransactionResponse(updatedTransaction);
        } catch (Exception e) {
            logger.error("[updateTransaction] Error updating transaction: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteTransaction(Long id) {
        logger.debug("[deleteTransaction] id={}", id);
        try {
            if (!transactionRepository.existsById(id)) {
                throw new RuntimeException("Transaction not found with id: " + id);
            }
            transactionRepository.deleteById(id);
            logger.info("[deleteTransaction] Transaction deleted: id={}", id);
        } catch (Exception e) {
            logger.error("[deleteTransaction] Error deleting transaction: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getTransactionSummary(Long userId) {
        logger.debug("[getTransactionSummary] userId={}", userId);
        try {
            BigDecimal totalIncome = transactionRepository.getTotalAmountByUserIdAndType(
                    userId, Transaction.TransactionType.INCOME);
            BigDecimal totalExpenses = transactionRepository.getTotalAmountByUserIdAndType(
                    userId, Transaction.TransactionType.EXPENSE);

            Map<String, BigDecimal> summary = new HashMap<>();
            summary.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
            summary.put("totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
            summary.put("netBalance", 
                    summary.get("totalIncome").subtract(summary.get("totalExpenses")));

            logger.info("[getTransactionSummary] Summary: {}", summary);
            return summary;
        } catch (Exception e) {
            logger.error("[getTransactionSummary] Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCategoryExpenses(Long userId) {
        logger.debug("[getCategoryExpenses] userId={}", userId);
        try {
            List<Object[]> results = transactionRepository.getExpensesByCategory(userId);
            Map<String, BigDecimal> categoryExpenses = new HashMap<>();

            for (Object[] result : results) {
                Transaction.Category category = (Transaction.Category) result[0];
                BigDecimal amount = (BigDecimal) result[1];
                categoryExpenses.put(category.name(), amount);
            }

            logger.info("[getCategoryExpenses] Category expenses: {}", categoryExpenses);
            return categoryExpenses;
        } catch (Exception e) {
            logger.error("[getCategoryExpenses] Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("[getTransactionsByDateRange] userId={}, startDate={}, endDate={}", userId, startDate, endDate);
        try {
            List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                    userId, startDate, endDate);
            logger.info("[getTransactionsByDateRange] Fetched {} transactions for userId={}", transactions.size(), userId);
            return transactions.stream()
                    .map(TransactionResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("[getTransactionsByDateRange] Error: {}", e.getMessage(), e);
            throw e;
        }
    }
}
