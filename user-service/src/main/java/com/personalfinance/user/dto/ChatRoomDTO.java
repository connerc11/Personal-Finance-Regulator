package com.personalfinance.user.dto;

import java.time.LocalDateTime;

public class ChatRoomDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private Integer memberCount;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime lastActivity;

    // Constructors
    public ChatRoomDTO() {}

    public ChatRoomDTO(Long id, String name, String description, Boolean isPublic, 
                      Integer memberCount, Long createdBy, LocalDateTime createdAt, LocalDateTime lastActivity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.memberCount = memberCount;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.lastActivity = lastActivity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
}
