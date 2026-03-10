package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "stations")
public class Station {
    @Id
    private String id;
    private String name;
    private Location location;
    private List<String> activities;
    private boolean volunteersNeeded;

    public Station() {}

    public Station(String name, Location location, List<String> activities, boolean volunteersNeeded) {
        this.name = name;
        this.location = location;
        this.activities = activities;
        this.volunteersNeeded = volunteersNeeded;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }
    public boolean isVolunteersNeeded() { return volunteersNeeded; }
    public void setVolunteersNeeded(boolean volunteersNeeded) { this.volunteersNeeded = volunteersNeeded; }
}