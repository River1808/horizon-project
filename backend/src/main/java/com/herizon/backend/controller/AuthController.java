package com.herizon.backend.controller;

import com.herizon.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if ("admin".equals(username) && "admin".equals(password)) {
            String token = jwtUtil.generateToken(username, "admin");
            return ResponseEntity.ok(Map.of("token", token, "role", "admin"));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}