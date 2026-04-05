package com.herizon.backend.controller;

import com.herizon.backend.model.*;
import com.herizon.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ResultController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private ResultRepository resultRepository;

    // Get result for user
    @GetMapping("/results/{userId}")
    public Result getResult(@PathVariable String userId) {
        // Check if result already exists
        List<Result> existing = resultRepository.findAll();
        Optional<Result> res = existing.stream().filter(r -> userId.equals(r.getUserId())).findFirst();
        if (res.isPresent()) return res.get();

        // Calculate new result
        List<Question> questions = questionRepository.findAll();
        List<Response> responses = responseRepository.findAll();
        Optional<Response> userResponse = responses.stream().filter(r -> userId.equals(r.getUserId())).findFirst();
        if (userResponse.isEmpty()) {
            // Return a default result if no response found
            Map<String, Integer> defaultScores = new HashMap<>();
            defaultScores.put("Science", 0);
            defaultScores.put("Technology", 0);
            defaultScores.put("Engineering", 0);
            defaultScores.put("Arts", 0);
            defaultScores.put("Math", 0);
            return new Result(userId, defaultScores, "None", "None", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        Map<String, Integer> scores = new HashMap<>();
        scores.put("Science", 0);
        scores.put("Technology", 0);
        scores.put("Engineering", 0);
        scores.put("Arts", 0);
        scores.put("Math", 0);

        for (Response.Answer answer : userResponse.get().getAnswers()) {
            Question question = questions.stream().filter(q -> answer.getQuestionId().equals(q.getId())).findFirst().orElse(null);
            if (question == null || answer.getSelectedOptionIndex() >= question.getOptions().size()) continue;
            Question.Option option = question.getOptions().get(answer.getSelectedOptionIndex());
            scores.put(option.getCategory(), scores.get(option.getCategory()) + option.getPoints());
        }

        // Find main and secondary
        String mainField = scores.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();
        Map<String, Integer> scoresCopy = new HashMap<>(scores);
        scoresCopy.remove(mainField);
        String secondaryField = scoresCopy.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();

        Result result = new Result(userId, scores, mainField, secondaryField,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return resultRepository.save(result);
    }
}