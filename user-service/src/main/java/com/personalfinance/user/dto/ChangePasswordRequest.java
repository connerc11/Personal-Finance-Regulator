package com.personalfinance.user.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class ChangePasswordRequest {
    
    @NotBlank
    private String currentPassword;
    
    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
    
    // Constructors
    public ChangePasswordRequest() {}
    
    public ChangePasswordRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
    
    // Getters and Setters
    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
