package com.herizon.backend.controller;

import com.herizon.backend.dto.StationDTO;
import com.herizon.backend.service.StationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin
public class StationController {

    private final StationService service;

    public StationController(StationService service) {
        this.service = service;
    }

    @GetMapping
    public List<StationDTO> getAll() {
        return service.getAll();
    }

    @PostMapping
    public StationDTO create(@RequestBody StationDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public StationDTO update(@PathVariable String id, @RequestBody StationDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{id}/volunteer-request")
    public void volunteer(@PathVariable String id, @RequestBody Object body) {
        System.out.println("Volunteer request for station " + id);
    }
}