package com.personalfinance.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    // Notification preferences
    @Column(nullable = false)
    private Boolean emailNotifications = true;
    
    @Column(nullable = false)
    private Boolean pushNotifications = true;
    
    @Column(nullable = false)
    private Boolean budgetAlerts = true;
    
    @Column(nullable = false)
    private Boolean transactionAlerts = true;
    
    @Column(nullable = false)
    private Boolean securityAlerts = true;
    
    // Privacy preferences
    @Column(nullable = false)
    private Boolean profileVisible = false;
    
    @Column(nullable = false)
    private Boolean shareData = false;
    
    // Theme preferences
    @Column(length = 20)
    private String theme = "light";
    
    @Column(length = 10)
    private String language = "en";
    
    @Column(length = 20)
    private String currency = "USD";
    
    // Constructors
    public UserPreferences() {}
    
    public UserPreferences(Long userId) {
        this.userId = userId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    
    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }
    
    public Boolean getBudgetAlerts() { return budgetAlerts; }
    public void setBudgetAlerts(Boolean budgetAlerts) { this.budgetAlerts = budgetAlerts; }
    
    public Boolean getTransactionAlerts() { return transactionAlerts; }
    public void setTransactionAlerts(Boolean transactionAlerts) { this.transactionAlerts = transactionAlerts; }
    
    public Boolean getSecurityAlerts() { return securityAlerts; }
    public void setSecurityAlerts(Boolean securityAlerts) { this.securityAlerts = securityAlerts; }
    
    public Boolean getProfileVisible() { return profileVisible; }
    public void setProfileVisible(Boolean profileVisible) { this.profileVisible = profileVisible; }
    
    public Boolean getShareData() { return shareData; }
    public void setShareData(Boolean shareData) { this.shareData = shareData; }
    
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
