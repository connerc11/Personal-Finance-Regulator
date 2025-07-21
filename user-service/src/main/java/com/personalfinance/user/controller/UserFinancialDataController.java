package com.personalfinance.user.controller;

import com.personalfinance.user.model.UserFinancialData;
import com.personalfinance.user.service.UserFinancialDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.personalfinance.user.security.UserDetailsImpl;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users/financial-data")
public class UserFinancialDataController {
    private final UserFinancialDataService service;
    private static final Logger logger = LoggerFactory.getLogger(UserFinancialDataController.class);

    public UserFinancialDataController(UserFinancialDataService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getFinancialData(@AuthenticationPrincipal UserDetails userDetails) {
        logger.info("GET /api/users/financial-data called for user: {}", userDetails != null ? userDetails.getUsername() : "null");
        Long userId = getUserIdFromPrincipal(userDetails);
        UserFinancialData data = service.getByUserId(userId).orElse(null);
        logger.debug("Fetched financial data for userId {}: {}", userId, data != null ? data.getData() : "null");
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("data", data == null ? null : data.getData());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> saveFinancialData(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) throws Exception {
        logger.info("PUT /api/users/financial-data called for user: {}", userDetails != null ? userDetails.getUsername() : "null");
        logger.debug("Request body: {}", body);
        Long userId = getUserIdFromPrincipal(userDetails);
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        com.fasterxml.jackson.databind.JsonNode dataNode = mapper.valueToTree(body.get("data"));
        logger.debug("Converted dataNode for userId {}: {}", userId, dataNode);
        service.saveOrUpdate(userId, dataNode);
        logger.info("Saved financial data for userId {}", userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private Long getUserIdFromPrincipal(UserDetails userDetails) {
        if (userDetails instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) userDetails).getId();
        }
        throw new IllegalArgumentException("UserDetails is not instance of UserDetailsImpl");
    }
}
