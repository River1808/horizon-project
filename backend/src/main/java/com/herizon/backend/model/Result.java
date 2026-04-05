package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "results")
public class Result {

    @Id
    private String id;

    private String userId;
    private Map<String, Integer> scores;
    private String mainField;
    private String secondaryField;
    private String createdAt;

    public Result() {}

    public Result(String userId, Map<String, Integer> scores, String mainField, String secondaryField, String createdAt) {
        this.userId = userId;
        this.scores = scores;
        this.mainField = mainField;
        this.secondaryField = secondaryField;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }

    public String getMainField() { return mainField; }
    public void setMainField(String mainField) { this.mainField = mainField; }

    public String getSecondaryField() { return secondaryField; }
    public void setSecondaryField(String secondaryField) { this.secondaryField = secondaryField; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}