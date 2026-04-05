package com.herizon.backend.controller;

import com.herizon.backend.model.Career;
import com.herizon.backend.repository.CareerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CareerController {

    @Autowired
    private CareerRepository careerRepository;

    // Get all careers
    @GetMapping("/careers")
    public List<Career> getCareers() {
        return careerRepository.findAll();
    }
}