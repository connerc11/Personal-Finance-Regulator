package com.personalfinance.user.dto;

public class SendMessageRequest {
    private String message;
    private Long replyToId;

    // Constructors
    public SendMessageRequest() {}

    public SendMessageRequest(String message, Long replyToId) {
        this.message = message;
        this.replyToId = replyToId;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getReplyToId() {
        return replyToId;
    }

    public void setReplyToId(Long replyToId) {
        this.replyToId = replyToId;
    }
}
