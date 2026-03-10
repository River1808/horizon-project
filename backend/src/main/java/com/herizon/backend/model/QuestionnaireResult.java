package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Document(collection = "questionnaireResults")
public class QuestionnaireResult {
    @Id
    private String id;
    private String userName;
    private Map<String, String> answers;
    private String personalityType;

    public QuestionnaireResult() {}

    public QuestionnaireResult(String userName, Map<String, String> answers, String personalityType) {
        this.userName = userName;
        this.answers = answers;
        this.personalityType = personalityType;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
    public String getPersonalityType() { return personalityType; }
    public void setPersonalityType(String personalityType) { this.personalityType = personalityType; }
}