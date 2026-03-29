package com.herizon.backend.service;

import com.herizon.backend.dto.StationDTO;
import com.herizon.backend.model.Station;
import com.herizon.backend.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StationService {

    private final StationRepository repo;

    public StationService(StationRepository repo) {
        this.repo = repo;
    }

    public List<StationDTO> getAll() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public StationDTO create(StationDTO dto) {
        Station station = toEntity(dto);
        return toDTO(repo.save(station));
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
    public StationDTO getById(String id) {
        Station station = repo.findById(id).orElseThrow(() -> new RuntimeException("Station not found"));
        return toDTO(station);
    }
    public StationDTO update(String id, StationDTO dto) {
        Station station = repo.findById(id).orElseThrow();

        station.setName(dto.getName());
        station.setAddress(dto.getAddress());
        station.setActivities(dto.getActivities());
        station.setManager(dto.getManager());
        station.setVolunteersNeeded(dto.getVolunteersNeeded());
        station.setGoogleFormLink(dto.getGoogleFormLink());
        if (dto.getLocation() != null) {
            station.setLocation(new Station.Location(dto.getLocation().getLat(), dto.getLocation().getLng()));
        }

        return toDTO(repo.save(station));
    }

    private StationDTO toDTO(Station s) {
        StationDTO dto = new StationDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setAddress(s.getAddress());
        dto.setActivities(s.getActivities());
        dto.setManager(s.getManager());
        dto.setVolunteersNeeded(s.getVolunteersNeeded());
        dto.setGoogleFormLink(s.getGoogleFormLink());
        if (s.getLocation() != null) {
            dto.setLocation(new StationDTO.Location(s.getLocation().getLat(), s.getLocation().getLng()));
        }
        return dto;
    }

    private Station toEntity(StationDTO dto) {
        Station s = new Station();
        s.setName(dto.getName());
        s.setAddress(dto.getAddress());
        s.setActivities(dto.getActivities());
        s.setManager(dto.getManager());
        s.setVolunteersNeeded(dto.getVolunteersNeeded());
        s.setGoogleFormLink(dto.getGoogleFormLink());
        if (dto.getLocation() != null) {
            s.setLocation(new Station.Location(dto.getLocation().getLat(), dto.getLocation().getLng()));
        }
        return s;
    }
}