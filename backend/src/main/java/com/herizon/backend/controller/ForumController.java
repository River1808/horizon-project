package com.herizon.backend.controller;

import com.herizon.backend.model.Post;
import com.herizon.backend.model.Comment;
import com.herizon.backend.repository.PostRepository;
import com.herizon.backend.repository.CommentRepository;
import com.herizon.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*")
public class ForumController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper method to extract userId from Authorization header
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    // =============================
    // GET ALL POSTS
    // =============================
    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // =============================
    // CREATE POST
    // =============================
    @PostMapping("/posts")
    public Post createPost(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Post post) {
        try {
            // Ensure post has required fields
            if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
                post.setTitle("Untitled");
            }
            if (post.getContent() == null || post.getContent().trim().isEmpty()) {
                post.setContent("");
            }
            
            String userId = extractUserIdFromToken(authHeader);
            if (userId != null) {
                post.setAuthor(userId);
            } else {
                post.setAuthor("anonymous");
            }
            return postRepository.save(post);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create post: " + e.getMessage());
        }
    }

    // =============================
    // GET COMMENTS BY POST ID
    // =============================
    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentRepository.findByPostId(postId);
    }

    // =============================
    // ADD COMMENT TO POST
    // =============================
    @PostMapping("/posts/{postId}/comments")
    public Comment addComment(
            @PathVariable String postId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Comment comment) {

        try {
            comment.setPostId(postId);
            
            // Ensure comment has required fields
            if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
                comment.setContent("");
            }
            
            String userId = extractUserIdFromToken(authHeader);
            if (userId != null) {
                comment.setAuthor(userId);
            } else {
                comment.setAuthor("anonymous");
            }
            return commentRepository.save(comment);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add comment: " + e.getMessage());
        }
    }
}