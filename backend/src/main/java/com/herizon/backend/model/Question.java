package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String question;
    private List<Option> options;

    public static class Option {
        private String text;
        private boolean correct;

        public Option() {}

        public Option(String text, boolean correct) {
            this.text = text;
            this.correct = correct;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public boolean isCorrect() { return correct; }
        public void setCorrect(boolean correct) { this.correct = correct; }
    }

    public Question() {}

    public Question(String question, List<Option> options) {
        this.question = question;
        this.options = options;
    }

    public String getId() { return id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }
}
