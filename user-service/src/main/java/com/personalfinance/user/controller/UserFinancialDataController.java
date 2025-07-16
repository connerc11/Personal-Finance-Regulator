package com.personalfinance.user.controller;

import com.personalfinance.user.model.UserFinancialData;
import com.personalfinance.user.service.UserFinancialDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.personalfinance.user.security.UserDetailsImpl;
import java.util.Map;

@RestController
@RequestMapping("/api/users/financial-data")
public class UserFinancialDataController {
    private final UserFinancialDataService service;

    public UserFinancialDataController(UserFinancialDataService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getFinancialData(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromPrincipal(userDetails);
        return service.getByUserId(userId)
            .map(data -> ResponseEntity.ok(Map.of("data", data.getData())))
            .orElse(ResponseEntity.ok(Map.of("data", "{}")));
    }

    @PutMapping
    public ResponseEntity<?> saveFinancialData(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) throws Exception {
        Long userId = getUserIdFromPrincipal(userDetails);
        String dataJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(body.get("data"));
        UserFinancialData saved = service.saveOrUpdate(userId, dataJson);
        return ResponseEntity.ok(Map.of("data", saved.getData()));
    }

    private Long getUserIdFromPrincipal(UserDetails userDetails) {
        if (userDetails instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) userDetails).getId();
        }
        throw new IllegalArgumentException("UserDetails is not instance of UserDetailsImpl");
    }
}
