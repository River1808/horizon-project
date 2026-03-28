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

    // ⭐ NEW OPTIONAL FIELD
    private String googleFormLink;

    private Location location;

    public Station() {}

    public Station(
            String name,
            String address,
            List<String> activities,
            String manager,
            int volunteersNeeded,
            String googleFormLink,
            Location location
    ) {
        this.name = name;
        this.address = address;
        this.activities = activities;
        this.manager = manager;
        this.volunteersNeeded = volunteersNeeded;
        this.googleFormLink = googleFormLink;
        this.location = location;
    }

    // ----------------------------------------
    // GETTERS AND SETTERS
    // ----------------------------------------

    // id
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    // name
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // address
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    // activities
    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }

    // manager
    public String getManager() { return manager; }
    public void setManager(String manager) { this.manager = manager; }

    // volunteersNeeded
    public int getVolunteersNeeded() { return volunteersNeeded; }
    public void setVolunteersNeeded(int volunteersNeeded) { this.volunteersNeeded = volunteersNeeded; }

    // googleFormLink
    public String getGoogleFormLink() { return googleFormLink; }
    public void setGoogleFormLink(String googleFormLink) { this.googleFormLink = googleFormLink; }

    // location
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

}