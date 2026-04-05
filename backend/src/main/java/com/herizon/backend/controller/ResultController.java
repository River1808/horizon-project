package com.herizon.backend.controller;

import com.herizon.backend.model.Question;
import com.herizon.backend.model.Response;
import com.herizon.backend.model.Result;
import com.herizon.backend.repository.QuestionRepository;
import com.herizon.backend.repository.ResponseRepository;
import com.herizon.backend.repository.ResultRepository;

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

    // ================================
    // GET RESULT BY USER ID
    // ================================
    @GetMapping("/results/{userId}")
    public Result getResult(@PathVariable String userId) {

        // 1️⃣ Check if result already exists
        Optional<Result> existingResult = resultRepository.findByUserId(userId);
        if (existingResult.isPresent()) {
            return existingResult.get();
        }

        // 2️⃣ Fetch user response
        Optional<Response> responseOpt = responseRepository.findByUserId(userId);

        // 3️⃣ Initialize category scores
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Science", 0);
        scores.put("Technology", 0);
        scores.put("Engineering", 0);
        scores.put("Arts", 0);
        scores.put("Math", 0);

        // 4️⃣ If no response, return empty result
        if (responseOpt.isEmpty()) {
            Result emptyResult = new Result(
                    userId,
                    scores,
                    "None",
                    "None",
                    LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            );
            return resultRepository.save(emptyResult);
        }

        Response response = responseOpt.get();

        // 5️⃣ Count points for each answer
        for (Response.Answer answer : response.getAnswers()) {

            Optional<Question> questionOpt = questionRepository.findById(answer.getQuestionId());

            if (questionOpt.isEmpty()) {
                System.out.println("Question not found for id: " + answer.getQuestionId());
                continue;
            }

            Question question = questionOpt.get();
            int index = answer.getSelectedOptionIndex();

            if (index < 0 || index >= question.getOptions().size()) {
                System.out.println("Invalid option index " + index + " for question " + question.getQuestion());
                continue;
            }

            Question.Option option = question.getOptions().get(index);

            String category = option.getCategory();
            int points = option.getPoints();

            if (category == null || category.isEmpty()) {
                System.out.println("Category missing for question " + question.getQuestion());
                continue;
            }

            // Sum points
            scores.put(category, scores.getOrDefault(category, 0) + points);
            System.out.println("Added " + points + " points to " + category + " for question: " + question.getQuestion());
        }

        // 6️⃣ Determine main field
        String mainField = scores.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        // 7️⃣ Determine secondary field
        Map<String, Integer> copyScores = new HashMap<>(scores);
        copyScores.remove(mainField);

        String secondaryField = copyScores.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        // 8️⃣ Save and return result
        Result result = new Result(
                userId,
                scores,
                mainField,
                secondaryField,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );

        return resultRepository.save(result);
    }

    // ================================
    // GET ALL RESULTS (optional)
    // ================================
    @GetMapping("/results")
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    // ================================
    // DELETE RESULT (optional)
    // ================================
    @DeleteMapping("/results/{userId}")
    public String deleteResult(@PathVariable String userId) {
        Optional<Result> result = resultRepository.findByUserId(userId);
        if (result.isPresent()) {
            resultRepository.delete(result.get());
            return "Result deleted";
        }
        return "Result not found";
    }
}