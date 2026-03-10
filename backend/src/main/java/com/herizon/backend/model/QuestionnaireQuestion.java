package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "questionnaireQuestions")
public class QuestionnaireQuestion {
    @Id
    private String id;
    private String question;
    private List<String> options;

    public QuestionnaireQuestion() {}

    public QuestionnaireQuestion(String question, List<String> options) {
        this.question = question;
        this.options = options;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
}