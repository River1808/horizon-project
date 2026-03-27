package com.herizon.backend.dto;

import java.util.Map;

public class QuestionSubmissionDTO {
    private String userName;
    private Map<String, String> answers;

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
}
