package com.herizon.backend.dto;

import com.herizon.backend.model.Location;

import java.util.List;

public class CreateStationDTO {

    private String name;
    private String address;
    private List<String> activities;
    private String manager;
    private int volunteersNeeded;
    private Location location;

    public CreateStationDTO() {}

    public String getName() { return name; }
    public String getAddress() { return address; }
    public List<String> getActivities() { return activities; }
    public String getManager() { return manager; }
    public int getVolunteersNeeded() { return volunteersNeeded; }
    public Location getLocation() { return location; }

}