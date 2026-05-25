package com.example.demo.dto;

public class ExecuteRequest {
    private String language;
    private String code;

    // Default Constructor
    public ExecuteRequest() {}

    // Getters and Setters
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}