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
    private Cloudinary cloudinary;

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
    // GET SINGLE LESSON
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
    public ResponseEntity<Lesson> updateLesson(@PathVariable String id, @RequestBody Lesson updatedLesson) {
        return lessonRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedLesson.getTitle());
                    existing.setDescription(updatedLesson.getDescription());
                    existing.setContent(updatedLesson.getContent());
                    existing.setCategory(updatedLesson.getCategory());
                    existing.setLevel(updatedLesson.getLevel());
                    existing.setImageUrl(updatedLesson.getImageUrl());

                    Lesson saved = lessonRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // =============================
    // UPLOAD IMAGE
    // =============================
    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "herizon_lessons")
            );

            return Map.of("url", uploadResult.get("secure_url").toString());

        } catch (Exception e) {
            return Map.of("error", "Upload failed: " + e.getMessage());
        }
    }

    // =============================
    // DELETE LESSON
    // =============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable String id) {

        return lessonRepository.findById(id)
                .map(lesson -> {
                    lessonRepository.delete(lesson);

                    // IMPORTANT: Force generic type to Void
                    return ResponseEntity.<Void>noContent().build();
                })
                .orElseGet(() -> ResponseEntity.<Void>notFound().build());
    }
}