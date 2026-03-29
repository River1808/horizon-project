package com.herizon.backend.dto;

import java.util.List;

public class StationDTO {

    private String id;
    private String name;
    private String address;
    private List<String> activities;
    private String manager;
    private int volunteersNeeded;
    private String googleFormLink;

    //  Nested location object to match DB
    private Location location;

    public StationDTO() {}

    // Nested class for location
    public static class Location {
        private double lat;
        private double lng;

        public Location() {}

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }

        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
    }

    // GETTERS & SETTERS
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }

    public String getManager() { return manager; }
    public void setManager(String manager) { this.manager = manager; }

    public int getVolunteersNeeded() { return volunteersNeeded; }
    public void setVolunteersNeeded(int volunteersNeeded) { this.volunteersNeeded = volunteersNeeded; }

    public String getGoogleFormLink() { return googleFormLink; }
    public void setGoogleFormLink(String googleFormLink) { this.googleFormLink = googleFormLink; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
}