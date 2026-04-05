package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "career_mapping")
public class Career {

    @Id
    private String id;

    private String mainCategory;
    private String secondaryCategory;
    private String career;

    public Career() {}

    public Career(String mainCategory, String secondaryCategory, String career) {
        this.mainCategory = mainCategory;
        this.secondaryCategory = secondaryCategory;
        this.career = career;
    }

    public String getId() { return id; }

    public String getMainCategory() { return mainCategory; }
    public void setMainCategory(String mainCategory) { this.mainCategory = mainCategory; }

    public String getSecondaryCategory() { return secondaryCategory; }
    public void setSecondaryCategory(String secondaryCategory) { this.secondaryCategory = secondaryCategory; }

    public String getCareer() { return career; }
    public void setCareer(String career) { this.career = career; }
}