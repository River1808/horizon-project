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

    // Helper method to extract username from Authorization header
    private String extractUsernameFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUsername(token);
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
        String username = extractUsernameFromToken(authHeader);
        if (username != null) {
            post.setAuthor(username);
        }
        return postRepository.save(post);
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

        comment.setPostId(postId);
        String username = extractUsernameFromToken(authHeader);
        if (username != null) {
            comment.setAuthor(username);
        }
        return commentRepository.save(comment);
    }
}