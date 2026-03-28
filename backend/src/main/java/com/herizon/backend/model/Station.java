package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "stations")
public class Station {

    @Id
    private String id;

    private String name;
    private String address;
    private List<String> activities;
    private String manager;
    private int volunteersNeeded;
    private String googleFormLink;

    // ⭐ DEFAULT location to avoid null crashes
    private Location location = new Location(0, 0);

    public Station() {}

    public Station(String name, String address, List<String> activities,
                   String manager, int volunteersNeeded, String googleFormLink,
                   Location location) {
        this.name = name;
        this.address = address;
        this.activities = activities;
        this.manager = manager;
        this.volunteersNeeded = volunteersNeeded;
        this.googleFormLink = googleFormLink;
        this.location = location;
    }

    // ---------- GETTERS & SETTERS ----------

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

    // ---------- NESTED LOCATION CLASS ----------
    public static class Location {
        private double lat;
        private double lng;

        public Location() {}

        public Location(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }

        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
    }
}