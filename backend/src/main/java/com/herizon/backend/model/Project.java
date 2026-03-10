package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String goal;
    private List<String> materials;
    private String instructions;
    private String expectedOutcomes;

    public Project() {}

    public Project(String title, String goal, List<String> materials, String instructions, String expectedOutcomes) {
        this.title = title;
        this.goal = goal;
        this.materials = materials;
        this.instructions = instructions;
        this.expectedOutcomes = expectedOutcomes;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public List<String> getMaterials() { return materials; }
    public void setMaterials(List<String> materials) { this.materials = materials; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getExpectedOutcomes() { return expectedOutcomes; }
    public void setExpectedOutcomes(String expectedOutcomes) { this.expectedOutcomes = expectedOutcomes; }
}