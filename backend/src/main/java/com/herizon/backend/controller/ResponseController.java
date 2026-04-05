package com.herizon.backend.controller;

import com.herizon.backend.model.Response;
import com.herizon.backend.repository.ResponseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ResponseController {

    @Autowired
    private ResponseRepository responseRepository;

    // Submit response
    @PostMapping("/responses")
    public Response submitResponse(@RequestBody Response response) {
        if (response.getCreatedAt() == null) response.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return responseRepository.save(response);
    }
}