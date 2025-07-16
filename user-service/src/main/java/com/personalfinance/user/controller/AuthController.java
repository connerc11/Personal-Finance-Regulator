package com.personalfinance.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.personalfinance.user.dto.JwtResponse;
import com.personalfinance.user.dto.LoginRequest;
import com.personalfinance.user.dto.SignupRequest;
import com.personalfinance.user.model.User;
import com.personalfinance.user.repository.UserRepository;
import com.personalfinance.user.security.JwtUtils;
import com.personalfinance.user.security.UserDetailsImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/auth")  // Updated to match frontend and security config
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/signin")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    // DEBUG: Log incoming identifier and password
    System.out.println("[DEBUG] Login identifier: " + loginRequest.getIdentifier());
    System.out.println("[DEBUG] Login password: " + loginRequest.getPassword());

    // Find user by username or email
    User user = userRepository.findByUsername(loginRequest.getIdentifier())
            .orElse(userRepository.findByEmail(loginRequest.getIdentifier()).orElse(null));
    if (user == null) {
        return ResponseEntity.status(401).body("User not found");
    }
    // DEBUG: Log user password hash from DB
    System.out.println("[DEBUG] User password hash from DB: " + user.getPassword());

    // Authenticate using username and password
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    return ResponseEntity.ok(new JwtResponse(jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            userDetails.getFirstName(),
            userDetails.getLastName()));
}
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }
        
        // DEBUG: Log incoming password
        System.out.println("[DEBUG] Registration password: " + signUpRequest.getPassword());
        String encodedPassword = encoder.encode(signUpRequest.getPassword());
        System.out.println("[DEBUG] Registration password hash: " + encodedPassword);

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encodedPassword,
                signUpRequest.getFirstName(),
                signUpRequest.getLastName());

        user.setPhoneNumber(signUpRequest.getPhoneNumber());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
