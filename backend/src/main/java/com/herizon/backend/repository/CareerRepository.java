package com.herizon.backend.repository;

import com.herizon.backend.model.Career;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CareerRepository extends MongoRepository<Career, String> {
}