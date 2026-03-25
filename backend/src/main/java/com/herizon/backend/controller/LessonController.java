package com.herizon.backend.controller;

import com.herizon.backend.model.Lesson;
import com.herizon.backend.repository.LessonRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    // =============================
    // GET ALL LESSONS
    // =============================
    @GetMapping
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    // =============================
    // CREATE LESSON
    // =============================
    @PostMapping
    public Lesson createLesson(@RequestBody Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    // =============================
    // GET SINGLE LESSON BY ID
    // =============================
    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLesson(@PathVariable String id) {
        return lessonRepository.findById(id)
                .map(ResponseEntity::ok) // return 200 + lesson
                .orElse(ResponseEntity.notFound().build()); // return 404
    }
    @PutMapping("/{id}")
    public Lesson updateLesson(@PathVariable String id, @RequestBody Lesson updatedLesson) {
        return lessonRepository.findById(id).map(lesson -> {

            lesson.setTitle(updatedLesson.getTitle());
            lesson.setDescription(updatedLesson.getDescription());
            lesson.setContent(updatedLesson.getContent());
            lesson.setCategory(updatedLesson.getCategory());
            lesson.setLevel(updatedLesson.getLevel());
            lesson.setImageUrl(updatedLesson.getImageUrl());

            return lessonRepository.save(lesson);
        }).orElse(null);
    }
}