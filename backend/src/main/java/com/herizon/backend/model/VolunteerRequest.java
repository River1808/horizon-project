package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "volunteerRequests")
public class VolunteerRequest {
    @Id
    private String id;
    private String stationId;
    private String userName;
    private String message;

    public VolunteerRequest() {}

    public VolunteerRequest(String stationId, String userName, String message) {
        this.stationId = stationId;
        this.userName = userName;
        this.message = message;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}