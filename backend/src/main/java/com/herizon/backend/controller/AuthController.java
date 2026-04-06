package com.herizon.backend.controller;

import com.herizon.backend.model.User;
import com.herizon.backend.repository.UserRepository;
import com.herizon.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String usernameOrEmail = loginRequest.get("usernameOrEmail");
        String password = loginRequest.get("password");

        User user = userRepository.findByUsername(usernameOrEmail);
        if (user == null) {
            user = userRepository.findByEmail(usernameOrEmail);
        }

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());
            return ResponseEntity.ok(Map.of("token", token, "role", user.getRole(), "userId", user.getId(), "username", user.getUsername()));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String email = registerRequest.get("email");
        String username = registerRequest.get("username");
        String password = registerRequest.get("password");

        if (userRepository.findByUsername(username) != null) {
            return ResponseEntity.status(400).body("Username already exists");
        }
        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.status(400).body("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User newUser = new User(username, username, email, hashedPassword, "user");
        User savedUser = userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("username", user.get().getUsername()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}