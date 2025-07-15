package com.personalfinance.user.dto;

public class CreateChatRoomRequest {
    private String name;
    private String description;
    private Boolean isPublic = true;

    // Constructors
    public CreateChatRoomRequest() {}

    public CreateChatRoomRequest(String name, String description, Boolean isPublic) {
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
    }

    // Getters and Setters
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
}
