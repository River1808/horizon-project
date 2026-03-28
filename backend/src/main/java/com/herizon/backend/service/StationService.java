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
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StationDTO create(StationDTO dto) {
        Station station = toEntity(dto);
        return toDTO(repo.save(station));
    }

    public StationDTO update(String id, StationDTO dto) {
        Station s = repo.findById(id).orElseThrow();

        s.setName(dto.getName());
        s.setAddress(dto.getAddress());
        s.setActivities(dto.getActivities());
        s.setManager(dto.getManager());
        s.setVolunteersNeeded(dto.getVolunteersNeeded());
        s.setGoogleFormLink(dto.getGoogleFormLink());

        s.setLocation(new Station.Location(dto.getLat(), dto.getLng()));

        return toDTO(repo.save(s));
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    // ---------- CONVERTERS ----------
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
            dto.setLat(s.getLocation().getLat());
            dto.setLng(s.getLocation().getLng());
        } else {
            dto.setLat(0);
            dto.setLng(0);
        }

        return dto;
    }

    private Station toEntity(StationDTO d) {
        Station s = new Station();

        s.setName(d.getName());
        s.setAddress(d.getAddress());
        s.setActivities(d.getActivities());
        s.setManager(d.getManager());
        s.setVolunteersNeeded(d.getVolunteersNeeded());
        s.setGoogleFormLink(d.getGoogleFormLink());

        s.setLocation(new Station.Location(d.getLat(), d.getLng()));

        return s;
    }
}