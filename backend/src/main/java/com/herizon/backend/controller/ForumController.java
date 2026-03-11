package com.herizon.backend.controller;

import com.herizon.backend.model.Post;
import com.herizon.backend.model.Comment;
import com.herizon.backend.repository.PostRepository;
import com.herizon.backend.repository.CommentRepository;

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
    public Post createPost(@RequestBody Post post) {
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
            @RequestBody Comment comment) {

        comment.setPostId(postId);
        return commentRepository.save(comment);
    }
}