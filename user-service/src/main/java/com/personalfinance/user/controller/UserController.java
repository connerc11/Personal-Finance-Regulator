package com.personalfinance.user.controller;

import com.personalfinance.user.dto.ChangePasswordRequest;
import com.personalfinance.user.dto.UserProfileRequest;
import com.personalfinance.user.dto.UserProfileResponse;
import com.personalfinance.user.model.User;
import com.personalfinance.user.model.UserPreferences;
import com.personalfinance.user.repository.UserRepository;
import com.personalfinance.user.repository.UserPreferencesRepository;
import com.personalfinance.user.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")  // Updated for API Gateway routing
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String UPLOAD_DIR = "uploads/avatars/";

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                UserProfileResponse response = new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getPhoneNumber(),
                    user.getAvatarUrl(),
                    user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null,
                    user.getUpdatedAt() != null ? user.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null
                );
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            @Valid @RequestBody UserProfileRequest profileRequest,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Update user fields
                if (profileRequest.getFirstName() != null) {
                    user.setFirstName(profileRequest.getFirstName());
                }
                if (profileRequest.getLastName() != null) {
                    user.setLastName(profileRequest.getLastName());
                }
                if (profileRequest.getEmail() != null && !profileRequest.getEmail().equals(user.getEmail())) {
                    // Check if email is already taken
                    if (userRepository.existsByEmail(profileRequest.getEmail())) {
                        return ResponseEntity.badRequest()
                                .body("Error: Email is already in use!");
                    }
                    user.setEmail(profileRequest.getEmail());
                }
                if (profileRequest.getPhoneNumber() != null) {
                    user.setPhoneNumber(profileRequest.getPhoneNumber());
                }
                
                User savedUser = userRepository.save(user);
                
                UserProfileResponse response = new UserProfileResponse(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getFirstName(),
                    savedUser.getLastName(),
                    savedUser.getPhoneNumber(),
                    savedUser.getAvatarUrl(),
                    savedUser.getCreatedAt() != null ? savedUser.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null,
                    savedUser.getUpdatedAt() != null ? savedUser.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null
                );
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user profile: " + e.getMessage());
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("avatar") MultipartFile file,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("File must be an image");
            }
            
            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size must be less than 5MB");
            }
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(filename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update user with avatar URL
            User user = userOptional.get();
            String avatarUrl = "/uploads/avatars/" + filename;
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
            
            return ResponseEntity.ok().body("{\"avatarUrl\": \"" + avatarUrl + "\"}");
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating avatar: " + e.getMessage());
        }
    }

    @PostMapping("/profile/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Verify current password
                if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
                    return ResponseEntity.badRequest()
                            .body("Current password is incorrect");
                }
                
                // Validate new password
                if (changePasswordRequest.getNewPassword().length() < 6) {
                    return ResponseEntity.badRequest()
                            .body("New password must be at least 6 characters long");
                }
                
                // Update password
                user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                userRepository.save(user);
                
                return ResponseEntity.ok("Password changed successfully");
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error changing password: " + e.getMessage());
        }
    }

    @GetMapping("/preferences")
    public ResponseEntity<?> getUserPreferences(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<UserPreferences> preferencesOptional = userPreferencesRepository.findByUserId(userDetails.getId());
            
            if (preferencesOptional.isPresent()) {
                return ResponseEntity.ok(preferencesOptional.get());
            } else {
                // Create default preferences for new user
                UserPreferences defaultPreferences = new UserPreferences(userDetails.getId());
                UserPreferences savedPreferences = userPreferencesRepository.save(defaultPreferences);
                return ResponseEntity.ok(savedPreferences);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user preferences: " + e.getMessage());
        }
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updateUserPreferences(
            @RequestBody UserPreferences preferences,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<UserPreferences> existingPreferences = userPreferencesRepository.findByUserId(userDetails.getId());
            
            UserPreferences preferencesToUpdate;
            if (existingPreferences.isPresent()) {
                preferencesToUpdate = existingPreferences.get();
            } else {
                preferencesToUpdate = new UserPreferences(userDetails.getId());
            }
            
            // Update preferences
            preferencesToUpdate.setEmailNotifications(preferences.getEmailNotifications());
            preferencesToUpdate.setPushNotifications(preferences.getPushNotifications());
            preferencesToUpdate.setBudgetAlerts(preferences.getBudgetAlerts());
            preferencesToUpdate.setTransactionAlerts(preferences.getTransactionAlerts());
            preferencesToUpdate.setSecurityAlerts(preferences.getSecurityAlerts());
            preferencesToUpdate.setProfileVisible(preferences.getProfileVisible());
            preferencesToUpdate.setShareData(preferences.getShareData());
            preferencesToUpdate.setTheme(preferences.getTheme());
            preferencesToUpdate.setLanguage(preferences.getLanguage());
            preferencesToUpdate.setCurrency(preferences.getCurrency());
            
            UserPreferences savedPreferences = userPreferencesRepository.save(preferencesToUpdate);
            return ResponseEntity.ok(savedPreferences);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user preferences: " + e.getMessage());
        }
    }
}
