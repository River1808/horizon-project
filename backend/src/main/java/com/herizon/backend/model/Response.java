package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "responses")
public class Response {

    @Id
    private String id;

    private String userId;
    private List<Answer> answers;
    private String createdAt;

    public static class Answer {
        private String questionId;
        private int selectedOptionIndex;

        public Answer() {}

        public Answer(String questionId, int selectedOptionIndex) {
            this.questionId = questionId;
            this.selectedOptionIndex = selectedOptionIndex;
        }

        public String getQuestionId() { return questionId; }
        public void setQuestionId(String questionId) { this.questionId = questionId; }

        public int getSelectedOptionIndex() { return selectedOptionIndex; }
        public void setSelectedOptionIndex(int selectedOptionIndex) { this.selectedOptionIndex = selectedOptionIndex; }
    }

    public Response() {}

    public Response(String userId, List<Answer> answers, String createdAt) {
        this.userId = userId;
        this.answers = answers;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}