package com.herizon.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.herizon.backend.model.Challenge;
import com.herizon.backend.repository.ChallengeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengesController {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private Cloudinary cloudinary;

    // =============================
    // GET ALL CHALLENGES
    // =============================
    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    // =============================
    // CREATE CHALLENGE
    // =============================
    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
        return challengeRepository.save(challenge);
    }

    // =============================
    // GET SINGLE CHALLENGE
    // =============================
    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallenge(@PathVariable String id) {
        return challengeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =============================
    // UPDATE CHALLENGE
    // =============================
    @PutMapping("/{id}")
    public ResponseEntity<Challenge> updateChallenge(
            @PathVariable String id,
            @RequestBody Challenge updatedChallenge
    ) {
        return challengeRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedChallenge.getTitle());
                    existing.setDescription(updatedChallenge.getDescription());
                    existing.setContent(updatedChallenge.getContent());
                    existing.setCategory(updatedChallenge.getCategory());
                    existing.setLevel(updatedChallenge.getLevel());
                    existing.setImageUrl(updatedChallenge.getImageUrl());

                    Challenge saved = challengeRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // =============================
    // UPLOAD IMAGE (Cloudinary)
    // =============================
    @PostMapping("/upload")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "herizon_challenges")
            );

            return Map.of("url", uploadResult.get("secure_url").toString());

        } catch (Exception e) {
            return Map.of("error", "Upload failed: " + e.getMessage());
        }
    }

    // =============================
    // DELETE CHALLENGE
    // =============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(@PathVariable String id) {
        challengeRepository.deleteById(id);
        return ResponseEntity.ok("Challenge deleted successfully");
    }
}