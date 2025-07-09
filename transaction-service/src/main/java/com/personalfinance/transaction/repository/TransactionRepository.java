package com.personalfinance.transaction.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.personalfinance.transaction.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Page<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId, Pageable pageable);
    
    List<Transaction> findByUserIdAndTransactionDateBetween(
            Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByUserIdAndType(Long userId, Transaction.TransactionType type);
    
    List<Transaction> findByUserIdAndCategory(Long userId, Transaction.Category category);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = :type")
    BigDecimal getTotalAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") Transaction.TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByUserIdAndTypeAndDateRange(
            @Param("userId") Long userId, 
            @Param("type") Transaction.TransactionType type,
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = 'EXPENSE' GROUP BY t.category")
    List<Object[]> getExpensesByCategory(@Param("userId") Long userId);
}
