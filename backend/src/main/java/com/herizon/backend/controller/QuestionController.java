package com.herizon.backend.controller;

import com.herizon.backend.model.Question;
import com.herizon.backend.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    // Create a question
    @PostMapping("/questions")
    public Question createQuestion(@RequestBody Question question) {
        if (question.getCreatedBy() == null) question.setCreatedBy("admin");
        if (question.getCreatedAt() == null) question.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return questionRepository.save(question);
    }

    // Get all questions
    @GetMapping("/questions")
    public List<Question> getQuestions() {
        return questionRepository.findAll();
    }

    // Get one question by id
    @GetMapping("/questions/{id}")
    public Question getQuestionById(@PathVariable String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found: " + id));
    }

    // Update existing question
    @PutMapping("/questions/{id}")
    public Question updateQuestion(@PathVariable String id, @RequestBody Question updated) {
        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found: " + id));

        existing.setQuestion(updated.getQuestion());
        existing.setSection(updated.getSection());
        existing.setOptions(updated.getOptions());

        return questionRepository.save(existing);
    }

    // Delete question
    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable String id) {
        if (!questionRepository.existsById(id)) {
            throw new NoSuchElementException("Question not found: " + id);
        }
        questionRepository.deleteById(id);
    }
}