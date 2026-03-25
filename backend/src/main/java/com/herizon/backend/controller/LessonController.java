package com.herizon.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.herizon.backend.model.Lesson;
import com.herizon.backend.repository.LessonRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private Cloudinary cloudinary;  // <-- Inject Cloudinary bean

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
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =============================
    // UPDATE LESSON
    // =============================
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

    // =============================
    // UPLOAD IMAGE TO CLOUDINARY
    // =============================
    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return Map.of("url", uploadResult.get("secure_url").toString());
        } catch (Exception e) {
            return Map.of("error", "Upload failed");
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable String id) {
        lessonRepository.deleteById(id);
        return ResponseEntity.ok("Lesson deleted successfully");
    }
}