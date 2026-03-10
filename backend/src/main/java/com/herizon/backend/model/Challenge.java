package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "challenges")
public class Challenge {
    @Id
    private String id;
    private String title;
    private String description;
    private List<String> materials;
    private String instructions;
    private String difficulty;
    private String estimatedTime;

    public Challenge() {}

    public Challenge(String title, String description, List<String> materials, String instructions, String difficulty, String estimatedTime) {
        this.title = title;
        this.description = description;
        this.materials = materials;
        this.instructions = instructions;
        this.difficulty = difficulty;
        this.estimatedTime = estimatedTime;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getMaterials() { return materials; }
    public void setMaterials(List<String> materials) { this.materials = materials; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }
}