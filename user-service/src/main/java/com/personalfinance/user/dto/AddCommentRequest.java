package com.personalfinance.user.dto;

public class AddCommentRequest {
    private String comment;

    // Constructors
    public AddCommentRequest() {}

    public AddCommentRequest(String comment) {
        this.comment = comment;
    }

    // Getters and Setters
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
