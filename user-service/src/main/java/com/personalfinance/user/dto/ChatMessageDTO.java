package com.personalfinance.user.dto;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private Long roomId;
    private Long userId;
    private String message;
    private LocalDateTime timestamp;
    private Boolean isEdited;
    private Long replyToId;
    private UserInfo user;
    private ChatMessageDTO replyTo;

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
    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, Long roomId, Long userId, String message, 
                         LocalDateTime timestamp, Boolean isEdited, Long replyToId) {
        this.id = id;
        this.roomId = roomId;
        this.userId = userId;
        this.message = message;
        this.timestamp = timestamp;
        this.isEdited = isEdited;
        this.replyToId = replyToId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    public Long getReplyToId() {
        return replyToId;
    }

    public void setReplyToId(Long replyToId) {
        this.replyToId = replyToId;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public ChatMessageDTO getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(ChatMessageDTO replyTo) {
        this.replyTo = replyTo;
    }
}
