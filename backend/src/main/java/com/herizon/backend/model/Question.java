package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String question;
    private String section;
    private List<Option> options;
    private String createdBy;
    private String createdAt;

    public static class Option {
        private String text;
        private String category;
        private int points;

        public Option() {}

        public Option(String text, String category, int points) {
            this.text = text;
            this.category = category;
            this.points = points;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public int getPoints() { return points; }
        public void setPoints(int points) { this.points = points; }
    }

    public Question() {}

    public Question(String question, String section, List<Option> options, String createdBy, String createdAt) {
        this.question = question;
        this.section = section;
        this.options = options;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
