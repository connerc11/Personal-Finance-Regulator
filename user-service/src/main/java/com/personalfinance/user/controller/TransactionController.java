package com.personalfinance.user.controller;

import com.personalfinance.user.model.Transaction;
import com.personalfinance.user.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        // Optionally, check that userDetails.getUsername() matches the userId's owner
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction, @AuthenticationPrincipal UserDetails userDetails) {
        // Optionally, set transaction.userId from userDetails
        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.ok(saved);
    }
}
