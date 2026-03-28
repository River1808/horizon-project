package com.herizon.backend.controller;

import com.herizon.backend.dto.StationDTO;
import com.herizon.backend.dto.VolunteerRequestDTO;
import com.herizon.backend.service.StationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/stations")
public class StationController {

    private final StationService service;

    public StationController(StationService service) {
        this.service = service;
    }

    // GET all stations
    @GetMapping
    public List<StationDTO> getAll() {
        return service.getAll();
    }

    // CREATE
    @PostMapping
    public StationDTO create(@RequestBody StationDTO dto) {
        return service.create(dto);
    }

    // UPDATE
    @PutMapping("/{id}")
    public StationDTO update(@PathVariable String id, @RequestBody StationDTO dto) {
        return service.update(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // VOLUNTEER REQUEST (no DB save required)
    @PostMapping("/{id}/volunteer-request")
    public String submitVolunteerRequest(
            @PathVariable String id,
            @RequestBody VolunteerRequestDTO req
    ) {
        // For MVP: simply log it
        System.out.println("Volunteer request for station " + id);
        System.out.println("Name: " + req.getUserName());
        System.out.println("Message: " + req.getMessage());
        return "OK";
    }
}