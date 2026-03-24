package com.herizon.backend.controller;

import com.herizon.backend.model.Lesson;
import com.herizon.backend.repository.LessonRepository;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Lesson getLesson(@PathVariable String id) {
        return lessonRepository.findById(id).orElse(null);
    }
}