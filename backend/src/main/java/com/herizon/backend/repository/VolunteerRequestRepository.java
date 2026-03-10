package com.herizon.backend.repository;

import com.herizon.backend.model.VolunteerRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VolunteerRequestRepository extends MongoRepository<VolunteerRequest, String> {
}