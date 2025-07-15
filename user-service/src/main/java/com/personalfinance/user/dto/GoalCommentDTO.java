package com.personalfinance.user.dto;

import java.time.LocalDateTime;

public class GoalCommentDTO {
    private Long id;
    private Long goalId;
    private Long userId;
    private String comment;
    private LocalDateTime timestamp;
    private Boolean isEdited;
    private UserInfo user;

    // User info nested class
    public static class UserInfo {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;
        private String avatarUrl;

        // Constructors
        public UserInfo() {}

        public UserInfo(Long id, String username, String firstName, String lastName, String avatarUrl) {
            this.id = id;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.avatarUrl = avatarUrl;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    // Constructors
    public GoalCommentDTO() {}

    public GoalCommentDTO(Long id, Long goalId, Long userId, String comment, 
                         LocalDateTime timestamp, Boolean isEdited) {
        this.id = id;
        this.goalId = goalId;
        this.userId = userId;
        this.comment = comment;
        this.timestamp = timestamp;
        this.isEdited = isEdited;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGoalId() {
        return goalId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }
}
