package com.herizon.backend.controller;

import com.herizon.backend.dto.CreateStationDTO;
import com.herizon.backend.dto.VolunteerRequestDTO;
import com.herizon.backend.model.Station;
import com.herizon.backend.repository.StationRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {

    private final StationRepository stationRepository;

    public StationController(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    // --------------------------
    // GET ALL STATIONS
    // --------------------------
    @GetMapping
    public List<Station> getAll() {
        return stationRepository.findAll();
    }

    // --------------------------
    // CREATE NEW STATION
    // --------------------------
    @PostMapping
    public Station createStation(@RequestBody CreateStationDTO dto) {
        Station station = new Station(
                dto.getName(),
                dto.getAddress(),
                dto.getActivities(),
                dto.getManager(),
                dto.getVolunteersNeeded(),
                dto.getLocation()
        );

        return stationRepository.save(station);
    }

    // --------------------------
    // UPDATE STATION
    // --------------------------
    @PutMapping("/{id}")
    public Station updateStation(@PathVariable String id, @RequestBody CreateStationDTO dto) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        station.setName(dto.getName());
        station.setAddress(dto.getAddress());
        station.setActivities(dto.getActivities());
        station.setManager(dto.getManager());
        station.setVolunteersNeeded(dto.getVolunteersNeeded());
        station.setLocation(dto.getLocation());

        return stationRepository.save(station);
    }

    // --------------------------
    // DELETE STATION
    // --------------------------
    @DeleteMapping("/{id}")
    public String deleteStation(@PathVariable String id) {
        if (!stationRepository.existsById(id)) {
            return "Station not found";
        }
        stationRepository.deleteById(id);
        return "Deleted";
    }

    // --------------------------
    // VOLUNTEER REQUEST
    // --------------------------
    @PostMapping("/{id}/volunteer-request")
    public String volunteerRequest(
            @PathVariable String id,
            @RequestBody VolunteerRequestDTO dto) {

        System.out.println("\n---- Volunteer Request ----");
        System.out.println("Station: " + id);
        System.out.println("User: " + dto.getUserName());
        System.out.println("Message: " + dto.getMessage());
        System.out.println("---------------------------\n");

        return "OK";
    }
}