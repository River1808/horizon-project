package com.herizon.backend.controller;

import com.herizon.backend.dto.QuestionSubmissionDTO;
import com.herizon.backend.model.Question;
import com.herizon.backend.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        return questionRepository.save(question);
    }

    // Get all questions
    @GetMapping("/questions")
    public List<Question> getQuestions() {
        return questionRepository.findAll();
    }

    // Submit answers & evaluate
    @PostMapping("/questionnaire/submit")
    public Map<String, Object> gradeAnswers(@RequestBody QuestionSubmissionDTO submission) {

        List<Question> questions = questionRepository.findAll();
        int score = 0;

        for (Question q : questions) {
            String userAns = submission.getAnswers().get(q.getId());
            if (userAns == null) continue;

            boolean correct = q.getOptions().stream()
                    .anyMatch(opt -> opt.getText().equals(userAns) && opt.isCorrect());

            if (correct) score++;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("total", questions.size());
        result.put("score", score);

        return result;
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

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }
}